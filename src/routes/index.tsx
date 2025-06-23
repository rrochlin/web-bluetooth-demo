import { createFileRoute } from '@tanstack/react-router'
import { ConnectButton } from '@/components/ConnectButton'
import { useBluetooth } from '@/hooks/useBluetooth'
import { MovementGraph } from '@/components/MovementGraph'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AppThemeProvider } from '@/contexts/ThemeContext'
import { Box, Container, Typography, Paper, Stack, Chip } from '@mui/material'
import { useTheme } from '@/contexts/ThemeContext'

export const Route = createFileRoute('/')({
  component: App,
})

function AppContent() {
  const { connect, isConnected, processedData } = useBluetooth();
  const { mode } = useTheme();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: mode === 'dark' 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      py: 3,
      px: 2
    }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography 
              variant="h2" 
              component="h1"
              sx={{ 
                fontWeight: 700,
                mb: 1,
                background: mode === 'dark' 
                  ? 'linear-gradient(45deg, #60a5fa, #a78bfa)'
                  : 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Movement Tracker
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: '1.1rem' }}
            >
              Real-time Bluetooth sensor data visualization
            </Typography>
          </Box>

          {/* Connection Status */}
          <Paper 
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.8)' 
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${mode === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
              textAlign: 'center'
            }}
          >
            <Stack spacing={2} alignItems="center">
              <ConnectButton onConnect={connect} isConnected={isConnected} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={isConnected ? "Connected" : "Disconnected"}
                  color={isConnected ? "success" : "default"}
                  variant={isConnected ? "filled" : "outlined"}
                  size="small"
                />
                {processedData && (
                  <Chip 
                    label={`${processedData.length} data points`}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>
            </Stack>
          </Paper>

          {/* Chart Section */}
          {processedData && processedData.length > 0 && (
            <Paper 
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                background: mode === 'dark' 
                  ? 'rgba(30, 41, 59, 0.8)' 
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${mode === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
              }}
            >
              <MovementGraph data={processedData} />
            </Paper>
          )}

          {/* Empty State */}
          {(!processedData || processedData.length === 0) && (
            <Paper 
              elevation={0}
              sx={{
                p: 8,
                borderRadius: 3,
                background: mode === 'dark' 
                  ? 'rgba(30, 41, 59, 0.8)' 
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${mode === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Data Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connect to your Bluetooth device to start seeing movement data
              </Typography>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <AppThemeProvider>
      <ThemeToggle />
      <AppContent />
    </AppThemeProvider>
  );
}
