import { Button, Icon, IconButton } from '@mui/material'
import BluetoothIcon from '@mui/icons-material/Bluetooth'
interface ConnectButtonProps {
  onConnect: () => void;
  isConnected: boolean;
}

export function ConnectButton({ onConnect, isConnected }: ConnectButtonProps) {
  return (

    <Button
      onClick={onConnect} 
      disabled={isConnected} 
      variant={isConnected ? "outlined" : "contained"} 
      className={`border-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded m-4 ${isConnected ? "text-blue-500" : "text-white"}`} 
      startIcon={<BluetoothIcon />}
    >
      {isConnected ? "Connected" : "Connect Device"}
    </Button>

  );
}