"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { AttachAddon } from 'xterm-addon-attach';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from './ui/prompt-input';
import { Button } from './ui/button';

interface AITerminalProps {
  onCommand: (command: string) => void;
}

const AITerminal: React.FC<AITerminalProps> = ({ onCommand }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const [command, setCommand] = useState('');

  useEffect(() => {
    if (terminalRef.current && !term.current) {
      term.current = new Terminal({
        fontFamily: 'monospace',
        fontSize: 14,
        cursorBlink: true,
        theme: {
          background: '#1e1e1e',
          foreground: '#cccccc',
          cursor: '#cccccc',
          selectionBackground: '#5f5f5f',
        },
      });
      fitAddon.current = new FitAddon();

      term.current.loadAddon(fitAddon.current);
      term.current.open(terminalRef.current);
      fitAddon.current.fit();

      // Establish WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const socketUrl = `${protocol}//${window.location.host}/api/terminal/socket`;
      ws.current = new WebSocket(socketUrl);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        term.current?.loadAddon(new AttachAddon(ws.current!));
        term.current?.write('Welcome to AI Terminal!\r\n');
        term.current?.write('$ ');
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        term.current?.write('\r\nDisconnected from terminal server.\r\n');
      };

      ws.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        term.current?.write('\r\nWebSocket error. Check console for details.\r\n');
      };

      const handleResize = () => {
        fitAddon.current?.fit();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        term.current?.dispose();
        ws.current?.close();
        term.current = null;
        fitAddon.current = null;
        ws.current = null;
      };
    }
  }, [onCommand]);

  const handleSubmit = async () => {
    if (command.trim()) {
      onCommand(command);
      writeToTerminal(`$ ${command}\n`);
      setCommand('');
    }
  };

  const writeToTerminal = (text: string) => {
    if (term.current) {
      term.current.write(text.replace(/\n/g, '\r\n'));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={terminalRef} className="flex-1" />
      <div className="p-4">
        <PromptInput>
          <PromptInputTextarea
            placeholder="Enter command..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <PromptInputActions>
            <PromptInputAction tooltip="Clear">
              <Button 
                variant="ghost"
                onClick={() => {
                  if (term.current) {
                    term.current.clear();
                  }
                }}
              >
                Clear
              </Button>
            </PromptInputAction>
            <PromptInputAction tooltip="Send">
              <Button onClick={handleSubmit}>
                Send
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  );
};

export default AITerminal;
