import { createFileRoute } from '@tanstack/react-router'
import '../App.css'
import { ConnectButton } from '@/components/ConnectButton'
import { useBluetooth } from '@/hooks/useBluetooth'
import { ThreeDVisualizer } from '@/components/3DVisualizer'

export const Route = createFileRoute('/')({
  component: App,
})


function App() {
  const { connect, isConnected, processedData } = useBluetooth();

  return (
    <div className="App">
      <header className="App-header">
        <ConnectButton onConnect={connect} isConnected={isConnected} />
        <ThreeDVisualizer latestProcessedData={processedData} />
      </header>
    </div>
  )
}
