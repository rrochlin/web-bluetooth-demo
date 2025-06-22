import { createFileRoute } from '@tanstack/react-router'
import logo from '../logo.svg'
import '../App.css'
import { ConnectButton } from '@/components/ConnectButton'
import { useBluetooth } from '@/hooks/useBluetooth'

export const Route = createFileRoute('/')({
  component: App,
})


function App() {
  const { connect, isConnected, data } = useBluetooth();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/routes/index.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className="App-link"
          href="https://tanstack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn TanStack
        </a>
        <ConnectButton onConnect={connect} isConnected={isConnected} />
      </header>
    </div>
  )
}
