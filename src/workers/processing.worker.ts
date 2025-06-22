import type { SensorData } from "@/types";

self.onmessage = (event: MessageEvent<ArrayBuffer>) => {
    const buffer = event.data;
    const view = new DataView(buffer);
    const results: number[] = [];
    
    const messageSize = 17;
    const messageCount = buffer.byteLength / messageSize;
    
    for (let i = 0; i < messageCount; i++) {
        const offset = i * messageSize;
        const data: SensorData = {
            timestamp: view.getUint32(offset, true),
            x_axis: view.getFloat32(offset + 4, true),
            y_axis: view.getFloat32(offset + 8, true),
            z_axis: view.getFloat32(offset + 12, true),
            is_calibrated: view.getUint8(offset + 16) !== 0,
        }

        const processedValue = processSensorData(data);
        results.push(processedValue);
    }
    
    // Send back the entire batch of results
    self.postMessage(results);
}

function processSensorData(data: SensorData): number {
    return data.x_axis + data.y_axis + data.z_axis;
}