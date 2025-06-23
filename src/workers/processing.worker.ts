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
    collectedData.sort((a, b) => a.timestamp - b.timestamp);
    
    self.postMessage(processSensorData(collectedData));
}

function getVelocity(p1: number, p2: number, dt: number) {
    return (p2 - p1) / dt;
}

function getAcceleration(v1: number, v2: number, dt: number) {
    return (v2 - v1) / dt;
}

function processSensorData(data: SensorData[]): ProcessedData[] {
    let timesstamps: number[] = []
    let x_vels: number[] = []
    let y_vels: number[] = []
    let z_vels: number[] = []
    let x_accs: number[] = []
    let y_accs: number[] = []
    let z_accs: number[] = []
    for (let i = 2; i < data.length; i++) {
        const dt1 = data[i].timestamp - data[i-1].timestamp;
        const dt2 = data[i-1].timestamp - data[i-2].timestamp;
        if (dt1 != dt2) {
            continue;
        }
        const vx = getVelocity(data[i-1].x_axis, data[i].x_axis, dt1);
        const pvx = getVelocity(data[i-2].x_axis, data[i-1].x_axis, dt2);
        const vy = getVelocity(data[i-1].y_axis, data[i].y_axis, dt1);
        const pvy = getVelocity(data[i-2].y_axis, data[i-1].y_axis, dt2);
        const vz = getVelocity(data[i-1].z_axis, data[i].z_axis, dt1);
        const pvz = getVelocity(data[i-2].z_axis, data[i-1].z_axis, dt2);
        const ax = getAcceleration(vx, pvx, dt2+dt1);
        const ay = getAcceleration(vy, pvy, dt2+dt1);
        const az = getAcceleration(vz, pvz, dt2+dt1);
        timesstamps.push(data[i].timestamp);
        x_vels.push(vx);
        y_vels.push(vy);
        z_vels.push(vz);
        x_accs.push(ax);
        y_accs.push(ay);
        z_accs.push(az);
    }
    return timesstamps.map((timestamp, index) => ({
        timestamp: timestamp,
        velX: x_vels[index],
        velY: y_vels[index],
        velZ: z_vels[index],
        accelX: x_accs[index],
        accelY: y_accs[index],
        accelZ: z_accs[index],
    }));
}
