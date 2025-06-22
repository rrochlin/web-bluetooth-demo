import type { ProcessedData, SensorData } from "@/types";

let vx = 0;
let vy = 0;
let vz = 0;
let ax = 0;
let ay = 0;
let az = 0;

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

function processSensorData(data: SensorData[]): ProcessedData[] {
    let px = data[0].x_axis;
    let py = data[0].y_axis;
    let pz = data[0].z_axis;
    let pt = data[0].timestamp;
    let x_vels: number[] = [vx];
    let y_vels: number[] = [vy];
    let z_vels: number[] = [vz];
    let x_accs: number[] = [ax];
    let y_accs: number[] = [ay];
    let z_accs: number[] = [az];
    for (const item of data.slice(1)) {
        const dt = item.timestamp - pt;
        const dx = item.x_axis - px;
        const dy = item.y_axis - py;
        const dz = item.z_axis - pz;
        if (dt > 0) {
            vx = dx / dt;
            vy = dy / dt;
            vz = dz / dt;
            ax = (vx - x_vels[x_vels.length - 1]) / dt;
            ay = (vy - y_vels[y_vels.length - 1]) / dt;
            az = (vz - z_vels[z_vels.length - 1]) / dt;
        }
        x_vels.push(vx);
        y_vels.push(vy);
        z_vels.push(vz);
        x_accs.push(ax);
        y_accs.push(ay);
        z_accs.push(az); 
        px = item.x_axis;
        py = item.y_axis;
        pz = item.z_axis;
        pt = item.timestamp;
    }
    return data.map((item, index) => ({
        timestamp: item.timestamp,
        velX: x_vels[index],
        velY: y_vels[index],
        velZ: z_vels[index],
        accelX: x_accs[index],
        accelY: y_accs[index],
        accelZ: z_accs[index],
    }));
}