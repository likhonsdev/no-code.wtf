import { NextRequest } from 'next/server';
import { WebSocketServer } from 'ws';
import { spawn } from 'node-pty';

// This is a simplified example. In a real application, you'd want to
// manage WebSocket connections more robustly (e.g., using a dedicated server
// process or a library like socket.io).
// Next.js API routes are serverless functions, so a persistent WebSocket
// server isn't directly supported in the same way as a long-running Node.js server.
// For demonstration, we'll simulate it, but for production, consider a custom server.

let wss: WebSocketServer | null = null;

export async function GET(req: NextRequest) {
  // This route is primarily for establishing the WebSocket connection.
  // The actual WebSocket communication happens outside the typical HTTP request/response cycle.

  if (!wss) {
    wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws) => {
      console.log('WebSocket client connected');

      const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
      const ptyProcess = spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env as { [key: string]: string },
      });

      ptyProcess.onData((data) => {
        ws.send(data);
      });

      ws.on('message', (message) => {
        ptyProcess.write(message.toString());
      });

      ws.on('close', () => {
        ptyProcess.kill();
        console.log('WebSocket client disconnected');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        ptyProcess.kill();
      });
    });

    // This is a hack for Next.js serverless environment.
    // In a real app, you'd have a dedicated server for WebSockets.
    // This attempts to attach the WebSocket server to the Next.js dev server.
    // It might not work reliably in all Next.js deployment environments.
    // For production, a custom Node.js server or a service like Vercel's Edge Functions
    // with WebSocket support would be needed.
    (req.socket as any).server.on('upgrade', (request: any, socket: any, head: any) => {
      wss?.handleUpgrade(request, socket, head, (ws) => {
        wss?.emit('connection', ws, request);
      });
    });
  }

  return new Response(null, { status: 101 }); // Switching Protocols
}