import { Button } from '@mui/material'
import BluetoothIcon from '@mui/icons-material/Bluetooth'
import { useTheme } from '@mui/material/styles'

interface ConnectButtonProps {
  onConnect: () => void;
  isConnected: boolean;
}

export function ConnectButton({ onConnect, isConnected }: ConnectButtonProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Button
      onClick={onConnect} 
      disabled={isConnected} 
      variant={isConnected ? "outlined" : "contained"} 
      size="large"
      startIcon={<BluetoothIcon />}
      sx={{
        px: 4,
        py: 1.5,
        fontSize: '1.1rem',
        fontWeight: 600,
        borderRadius: 3,
        textTransform: 'none',
        minWidth: 220,
        height: 56,
        background: isConnected 
          ? 'transparent'
          : isDark 
            ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        border: isConnected 
          ? `2px solid ${isDark ? '#60a5fa' : '#3b82f6'}`
          : 'none',
        color: isConnected 
          ? (isDark ? '#60a5fa' : '#3b82f6')
          : '#ffffff',
        '&:hover': {
          background: isConnected 
            ? (isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)')
            : isDark 
              ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
              : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          transform: 'translateY(-1px)',
          boxShadow: isConnected 
            ? 'none'
            : '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
        },
        '&:disabled': {
          background: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.1)',
          color: isDark ? '#64748b' : '#94a3b8',
          border: isDark ? '2px solid #475569' : '2px solid #cbd5e1',
        },
        transition: 'all 0.2s ease-in-out',
        boxShadow: isConnected 
          ? 'none'
          : '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
      }}
    >
      {isConnected ? "Connected" : "Connect Device"}
    </Button>
  );
}