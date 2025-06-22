import { createFileRoute } from '@tanstack/react-router'
import logo from '../logo.svg'
import '../App.css'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: App,
})
const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8"



function App() {
  const workerRef = useRef<Worker | null>(null);
  const [processedData, setProcessedData] = useState<number[] | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../worker.ts", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (event: MessageEvent<number>) => {
      console.log("Received processed data from worker:", event.data);
    };

    // Cleanup worker on component unmount
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleConnect = async () => {
    if (!navigator.bluetooth) {
      console.error("Bluetooth API not supported in this browser.");
      return;
    }

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
      console.error("Argh! ", error);
    }
  };

  const handleCharacteristicValueChanged = (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value; // This is a DataView

    if (value && workerRef.current) {
      // This is the key part: transfer the data buffer to the worker.
      // This is a zero-copy operation, making it extremely fast.
      // The main thread loses access to `value.buffer` after this call.
      workerRef.current.postMessage(value.buffer, [value.buffer]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/routes/index.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className="App-link"
          href="https://tanstack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn TanStack
        </a>
      <button onClick={handleConnect}>Connect</button>
      </header>
    </div>
  )
}
