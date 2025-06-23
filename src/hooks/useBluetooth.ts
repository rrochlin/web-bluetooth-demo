// src/hooks/useBluetooth.ts
import { useState, useCallback, useRef, useEffect } from "react";
import { parseSensorData } from "@/utils/parser";
import type { ProcessedData } from "@/types";

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const BATCH_TIMEOUT_MS = 1000;

export function useBluetooth() {
  const [isConnected, setIsConnected] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const MAX_DATA_POINTS = 2000;

  const batchBufferRef = useRef<ArrayBuffer>(new ArrayBuffer(17*50));
  const batchBufferViewRef = useRef<DataView>(new DataView(batchBufferRef.current));
  const batchBufferIndexRef = useRef<number>(0);
  const batchTimeoutRef = useRef<number | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedData[]>([]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/processing.worker.ts", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (event: MessageEvent<ProcessedData[]>) => {
      setProcessedData(prev => [...prev.slice(prev.length + event.data.length > MAX_DATA_POINTS ? event.data.length : 0), ...event.data]);
    };

    return () => {
      workerRef.current?.terminate();
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, []);

  const sendBatch = useCallback(() => {
    if (batchBufferIndexRef.current === 0 || !workerRef.current) return;
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
      batchTimeoutRef.current = null;
    }
    
    workerRef.current.postMessage(batchBufferRef.current, [batchBufferRef.current]);
    batchBufferRef.current = new ArrayBuffer(17*50);
    batchBufferViewRef.current = new DataView(batchBufferRef.current);
    batchBufferIndexRef.current = 0;
  }, []);

  const scheduleBatchSend = useCallback(() => {
    if (batchTimeoutRef.current) return;
    
    batchTimeoutRef.current = window.setTimeout(() => {
      sendBatch();
    }, BATCH_TIMEOUT_MS);
  }, [sendBatch]);

  const handleCharacteristicValueChanged = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;

    if (value) {
      const bufferCopy = parseSensorData(value.buffer);
      if (bufferCopy) {
        batchBufferViewRef.current.setUint32(batchBufferIndexRef.current, bufferCopy.timestamp, true);
        batchBufferViewRef.current.setFloat32(batchBufferIndexRef.current + 4, bufferCopy.x_axis, true);
        batchBufferViewRef.current.setFloat32(batchBufferIndexRef.current + 8, bufferCopy.y_axis, true);
        batchBufferViewRef.current.setFloat32(batchBufferIndexRef.current + 12, bufferCopy.z_axis, true);
        batchBufferViewRef.current.setUint8(batchBufferIndexRef.current + 16, bufferCopy.is_calibrated ? 1 : 0);
        batchBufferIndexRef.current += 17;
      }

      if (batchBufferIndexRef.current >= 17*50) {
        sendBatch();
      } else {
        scheduleBatchSend();
      }
    }
  }, [sendBatch, scheduleBatchSend]);

  const connect = useCallback(async () => {
    try {
      console.log("Requesting Bluetooth device...");
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }],
      });

      console.log("Connecting to GATT Server...");
      const server = await device.gatt?.connect();
      setIsConnected(true);

      console.log("Getting Service...");
      const service = await server?.getPrimaryService(SERVICE_UUID);

      console.log("Getting Characteristic...");
      const characteristic = await service?.getCharacteristic(
        CHARACTERISTIC_UUID
      );

      console.log("Starting Notifications...");
      await characteristic?.startNotifications();

      characteristic?.addEventListener(
        "characteristicvaluechanged",
        handleCharacteristicValueChanged
      );

      console.log("Connected and listening for notifications!");
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      setIsConnected(false);
    }
  }, [handleCharacteristicValueChanged]);

  return { connect, isConnected, processedData };
}