import type { ProcessedData, SensorData } from "@/types";

self.onmessage = (event: MessageEvent<ArrayBuffer>) => {
    const buffer = event.data;
    const view = new DataView(buffer);
    const collectedData: SensorData[] = []; 
    
    const messageSize = 17;
    const messageCount = buffer.byteLength / messageSize;
    
    for (let i = 0; i < messageCount; i++) {
        const offset = i * messageSize;
        collectedData.push({
            timestamp: view.getUint32(offset, true),
            x_axis: view.getFloat32(offset + 4, true),
            y_axis: view.getFloat32(offset + 8, true),
            z_axis: view.getFloat32(offset + 12, true),
            is_calibrated: view.getUint8(offset + 16) !== 0,
        });
    }
    
    self.postMessage(processSensorData(collectedData));
}

function processSensorData(data: SensorData[]): ProcessedData {
    let vx, vy, vz, ax, ay, az = 0;
    let px = data[0].x_axis;
    let py = data[0].y_axis;
    let pz = data[0].z_axis;
    let pt = data[0].timestamp;
    let x_vels: number[] = [];
    let y_vels: number[] = [];
    let z_vels: number[] = [];
    let x_accs: number[] = [];
    let y_accs: number[] = [];
    let z_accs: number[] = [];
    for (const item of data.slice(1)) {
        const dt = item.timestamp - pt;
        const dx = item.x_axis - px;
        const dy = item.y_axis - py;
        const dz = item.z_axis - pz;
        if (dt > 0) {
            vx = dx / dt;
            vy = dy / dt;
            vz = dz / dt;
            ax = (vx - (x_vels[x_vels.length - 1] || 0)) / dt;
            ay = (vy - (y_vels[y_vels.length - 1] || 0)) / dt;
            az = (vz - (z_vels[z_vels.length - 1] || 0)) / dt;
        }
        x_vels.push(vx || 0);
        y_vels.push(vy || 0);
        z_vels.push(vz || 0);
        x_accs.push(ax || 0);
        y_accs.push(ay || 0);
        z_accs.push(az || 0); 
        px = item.x_axis;
        py = item.y_axis;
        pz = item.z_axis;
        pt = item.timestamp;
    }
    
    const calculateAverages = (arrays: number[][]) => {
        return arrays.map(arr => arr.reduce((sum, val) => sum + (val || 0), 0) / arr.length);
    };

    const [velX, velY, velZ, accelX, accelY, accelZ] = calculateAverages([
        x_vels, y_vels, z_vels, x_accs, y_accs, z_accs
    ]);

    return { velX, velY, velZ, accelX, accelY, accelZ };
}