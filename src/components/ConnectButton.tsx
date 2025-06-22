interface ConnectButtonProps {
  onConnect: () => void;
  isConnected: boolean;
}

export function ConnectButton({ onConnect, isConnected }: ConnectButtonProps) {
  return (
    <button onClick={onConnect} disabled={isConnected}>
      {isConnected ? "Connected" : "Connect to Device"}
    </button>
  );
}