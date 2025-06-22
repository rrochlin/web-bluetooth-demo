import type { SensorData } from "@/types";

export function parseSensorData(buffer: ArrayBuffer): SensorData | null {
    if (buffer.byteLength < 17) {
      console.error("Received buffer is too small!");
      return null;
    }
  
    const view = new DataView(buffer);
    const data: SensorData = {
        timestamp: view.getUint32(0, true),
        x_axis: view.getFloat32(4, true),
        y_axis: view.getFloat32(8, true),
        z_axis: view.getFloat32(12, true),
        is_calibrated: view.getUint8(16) !== 0,
    }

    return data;
}