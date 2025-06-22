self.onmessage = (event: MessageEvent<ArrayBuffer>) => {
    const view = new DataView(event.data);
    const message = view.getUint32(0, true);
    // const data = view.getUint32(4, true);
    // const timestamp = view.getUint32(8, true);
    // const sender = view.getUint32(12, true);
    // const receiver = view.getUint32(16, true);
    // const content = view.getUint32(20, true);
    // const signature = view.getUint32(24, true);
    // const nonce = view.getUint32(28, true);
    const processedValue = fib(message)
    self.postMessage(processedValue);
    
}

// recursive fibonacci to maximize cpu usage
function fib(n: number): number {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}