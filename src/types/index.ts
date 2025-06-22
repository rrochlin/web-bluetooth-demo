export interface SensorData {
    timestamp: number;
    x_axis: number;
    y_axis: number;
    z_axis: number;
    is_calibrated: boolean;
}

export interface ProcessedData {
    velX: number;
    velY: number;
    velZ: number;
    accelX: number;
    accelY: number;
    accelZ: number;
}