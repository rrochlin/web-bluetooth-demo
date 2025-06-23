import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import type { ProcessedData } from '@/types';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

interface MovementGraphProps {
  data: ProcessedData[];
}

export function MovementGraph({ data }: MovementGraphProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const chartData = useMemo(() => {
    if (data.length === 0) return [];
    
    const now = data[data.length - 1].timestamp;
    const timeDelay = now - 20000;
    
    const recentData = data.filter(item => item.timestamp >= timeDelay);
    
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
  
  // Theme-aware colors
  const colors = {
    velX: isDark ? '#60a5fa' : '#3b82f6',
    velY: isDark ? '#34d399' : '#10b981', 
    velZ: isDark ? '#fbbf24' : '#f59e0b',
    accelX: isDark ? '#a78bfa' : '#8b5cf6',
    accelY: isDark ? '#f472b6' : '#ec4899',
    accelZ: isDark ? '#fb7185' : '#ef4444',
  };

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)';

  if (chartData.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 400,
        color: 'text.secondary'
      }}>
        <Typography variant="h6">
          No data available. Connect to device to see movement data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Velocity Chart */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Velocity over Time
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={gridColor}
              opacity={0.5}
            />
            <XAxis 
              dataKey="relativeTime" 
              domain={[0, 20]}
              ticks={timeTicks}
              tickFormatter={(value) => `${value}s`}
              tick={{ 
                fontSize: 12, 
                fill: textColor,
                fontWeight: 500
              }}
              axisLine={{ stroke: gridColor }}
              allowDataOverflow={true}
              type="number"
            />
            <YAxis 
              allowDataOverflow={true}
              domain={[-2, 2]}
              tick={{ 
                fontSize: 12, 
                fill: textColor,
                fontWeight: 500
              }}
              axisLine={{ stroke: gridColor }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: `1px solid ${gridColor}`,
                borderRadius: 8,
                color: textColor
              }}
            />
            <Legend 
              wrapperStyle={{
                color: textColor,
                fontSize: 12
              }}
            />
            <Line 
              type="monotone" 
              dataKey="velX" 
              stroke={colors.velX} 
              name="Velocity X" 
              dot={false} 
              strokeWidth={2.5} 
            />
            <Line 
              type="monotone" 
              dataKey="velY" 
              stroke={colors.velY} 
              name="Velocity Y" 
              dot={false} 
              strokeWidth={2.5} 
            />
            <Line 
              type="monotone" 
              dataKey="velZ" 
              stroke={colors.velZ} 
              name="Velocity Z" 
              dot={false} 
              strokeWidth={2.5} 
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Acceleration Chart */}
      <Box>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Acceleration over Time
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={gridColor}
              opacity={0.5}
            />
            <XAxis 
              dataKey="relativeTime" 
              domain={[0, 20]}
              ticks={timeTicks}
              tickFormatter={(value) => `${value}s`}
              tick={{ 
                fontSize: 12, 
                fill: textColor,
                fontWeight: 500
              }}
              axisLine={{ stroke: gridColor }}
              allowDataOverflow={true}
              type="number"
            />
            <YAxis 
              allowDataOverflow={true}
              domain={[-0.02, 0.02]}
              tick={{ 
                fontSize: 12, 
                fill: textColor,
                fontWeight: 500
              }}
              axisLine={{ stroke: gridColor }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: `1px solid ${gridColor}`,
                borderRadius: 8,
                color: textColor
              }}
            />
            <Legend 
              wrapperStyle={{
                color: textColor,
                fontSize: 12
              }}
            />
            <Line 
              type="monotone" 
              dataKey="accelX" 
              stroke={colors.accelX} 
              name="Acceleration X" 
              dot={false} 
              strokeWidth={2.5} 
            />
            <Line 
              type="monotone" 
              dataKey="accelY" 
              stroke={colors.accelY} 
              name="Acceleration Y" 
              dot={false} 
              strokeWidth={2.5} 
            />
            <Line 
              type="monotone" 
              dataKey="accelZ" 
              stroke={colors.accelZ} 
              name="Acceleration Z" 
              dot={false} 
              strokeWidth={2.5} 
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}