import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import type { ProcessedData } from '@/types';
import { useMemo } from 'react';

interface MovementGraphProps {
  data: ProcessedData[];
}

export function MovementGraph({ data }: MovementGraphProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return [];
    
    const now = data[data.length - 1].timestamp;
    const timeDelay = now - 20000;
    
    const recentData = data.filter(item => item.timestamp >= timeDelay);
    console.log(recentData);
    
    if (recentData.length > 0) {
      const startTime = recentData[0].timestamp;
      const data = recentData.map(item => ({
        ...item,
        relativeTime: (item.timestamp - startTime) / 1000
      }));
      return data;
    }
    
    return [];
  }, [data]);

  const timeTicks = [0, 4, 8, 12, 16, 20];

  if (chartData.length === 0) {
    return (
      <div className="w-3/4 mx-auto flex items-center justify-center h-full">
        <p className="text-white text-lg text-center">
          No data available. Connect to device to see movement data.
        </p>
      </div>
    );
  }

  return (
    <div className="w-3/4 mx-auto">
      <h3 className="text-2xl font-bold mb-4">Velocity over Time (20s Window)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="relativeTime" 
            domain={[0, 20]}
            ticks={timeTicks}
            tickFormatter={(value) => `${value}s`}
            tick={{ fontSize: 12, fill: '#fff' }}
            allowDataOverflow={true}
            type="number"
          />
          <YAxis 
            allowDataOverflow={true}
            domain={[-2, 2]}
            tick={{ fontSize: 12, fill: '#fff' }}
          />
          <Legend />
          <Line type="monotone" dataKey="velX" stroke="#8884d8" name="Velocity X" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="velY" stroke="#82ca9d" name="Velocity Y" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="velZ" stroke="#ffc658" name="Velocity Z" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      
      <h3 className="text-2xl font-bold">Acceleration over Time (20s Window)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="relativeTime" 
            domain={[0, 20]}
            ticks={timeTicks}
            tickFormatter={(value) => `${value}s`}
            tick={{ fontSize: 12, fill: '#fff' }}
            allowDataOverflow={true}
            type="number"
          />
          <YAxis 
            allowDataOverflow={true}
            domain={[-0.02, 0.02]}
            tick={{ fontSize: 12, fill: '#fff' }}
          />
          <Legend />
          <Line type="monotone" dataKey="accelX" stroke="#8884d8" name="Acceleration X" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="accelY" stroke="#82ca9d" name="Acceleration Y" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="accelZ" stroke="#ffc658" name="Acceleration Z" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}