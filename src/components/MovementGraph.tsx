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

  // Define explicit ticks for 0-20 seconds in 4-second intervals
  const timeTicks = [0, 4, 8, 12, 16, 20];

  if (chartData.length === 0) {
    return (
      <div style={{ 
        width: '75%', 
        height: 400, 
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        border: '1px solid #e9ecef',
        borderRadius: '8px'
      }}>
        <p style={{ color: '#fff', fontSize: '16px' }}>
          No data available. Connect to device to see movement data.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '75%', margin: '0 auto' }}>
      <h3 style={{ margin: '20px 0 10px 0' }}>Velocity over Time (20s Window)</h3>
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
            tick={{ fontSize: 12, fill: '#666' }}
            allowDataOverflow={true}
            type="number"
          />
          <YAxis 
            allowDataOverflow={true}
            domain={[-2, 2]}
            tick={{ fontSize: 12, fill: '#666' }}
          />
          <Legend />
          <Line type="monotone" dataKey="velX" stroke="#8884d8" name="Velocity X" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="velY" stroke="#82ca9d" name="Velocity Y" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="velZ" stroke="#ffc658" name="Velocity Z" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      
      <h3 style={{ margin: '30px 0 10px 0' }}>Acceleration over Time (20s Window)</h3>
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
            tick={{ fontSize: 12, fill: '#666' }}
            allowDataOverflow={true}
            type="number"
          />
          <YAxis 
            allowDataOverflow={true}
            domain={[-0.02, 0.02]}
            tick={{ fontSize: 12, fill: '#666' }}
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