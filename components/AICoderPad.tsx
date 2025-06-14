'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from '@xterm/addon-fit';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  SandpackThemeProvider,
  useSandpack,
} from '@codesandbox/sandpack-react';

// Helper component to update Sandpack files
const SandpackUpdater: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const { sandpack } = useSandpack();
  const [currentLang, setCurrentLang] = useState(language);

  useEffect(() => {
    if (language !== currentLang) {
      // Language changed, reset files for the new language
      sandpack.resetAllFiles();
      setCurrentLang(language);
    }

    let fileName = 'index.js'; // Default for JavaScript
    let sandpackTemplate: 'static' | 'react' | 'vue' | 'angular' | 'svelte' | 'vanilla' | 'node' = 'static';

    switch (language.toLowerCase()) {
      case 'javascript':
        fileName = 'index.js';
        sandpackTemplate = 'static'; // or 'node' if it's Node.js specific
        break;
      case 'python':
        fileName = 'main.py';
        sandpackTemplate = 'static'; // Sandpack has limited Python support, often via Pyodide
        break;
      case 'html':
        fileName = 'index.html';
        sandpackTemplate = 'static';
        break;
      case 'css':
        // CSS usually accompanies HTML
        fileName = 'styles.css';
        sandpackTemplate = 'static';
        // For CSS, we might want to update an HTML file that links to it
        sandpack.updateFile('index.html', `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>CSS Test</h1>
  <p>This is styled by styles.css</p>
</body>
</html>`);
        break;
      default:
        fileName = `code.${language}`;
        sandpackTemplate = 'static';
    }

    if (code) {
      sandpack.updateFile(fileName, code);
      // Ensure the active file is the one we just updated
      sandpack.setActiveFile(fileName);
    }
    // Consider if template needs to change based on language
    // sandpack.openFile(fileName); // This might be needed if template changes don't auto-open

  }, [code, language, sandpack, currentLang]);

  return null;
};


const AICoderPad: React.FC = () => {
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  const initializeTerminal = useCallback(() => {
    if (terminalRef.current && !xtermRef.current) {
      const term = new Terminal({
        cursorBlink: true,
        convertEol: true,
        fontSize: 14,
        fontFamily: 'monospace',
        theme: {
          background: '#1e1e1e',
          foreground: '#d4d4d4',
        }
      });
      const fitAddon = new FitAddon();
      fitAddonRef.current = fitAddon;
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();
      xtermRef.current = term;
    }
  }, []);

  useEffect(() => {
    initializeTerminal();
    const handleResize = () => {
      fitAddonRef.current?.fit();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      xtermRef.current?.dispose();
      xtermRef.current = null;
    };
  }, [initializeTerminal]);

  const handleGenerateCode = async () => {
    if (!userPrompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    if (!xtermRef.current) {
        setError('Terminal not initialized.');
        initializeTerminal(); // Attempt to re-initialize
        if (!xtermRef.current) return; // Still not initialized
    }

    setIsStreaming(true);
    setError(null);
    setGeneratedCode('');
    xtermRef.current?.reset();
    xtermRef.current?.writeln(`🚀 Generating ${language} code for: "${userPrompt}"...\r\n`);

    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt, language }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `API Error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedCode = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        xtermRef.current?.write(chunk);
        accumulatedCode += chunk;
      }
      setGeneratedCode(accumulatedCode);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
      xtermRef.current?.writeln(`\r\n❌ Error: ${message}`);
    } finally {
      setIsStreaming(false);
      xtermRef.current?.writeln("\r\n✅ Streaming complete.");
    }
  };
  
  const getSandpackTemplate = () => {
    switch (language.toLowerCase()) {
      case 'react':
      case 'javascript_react': // if you use such a distinction
        return 'react';
      case 'vue':
        return 'vue';
      case 'angular':
        return 'angular';
      case 'svelte':
        return 'svelte';
      case 'node':
        return 'node';
      case 'html':
      case 'css':
      case 'javascript':
      case 'python': // Python is often 'static' in Sandpack as it runs client-side via Pyodide
      default:
        return 'static';
    }
  };

  const sandpackFiles = {
    [language === 'python' ? 'main.py' : language === 'html' ? 'index.html' : language === 'css' ? 'styles.css' : 'index.js']: generatedCode,
  };
   if (language === 'css' && generatedCode) {
    sandpackFiles['index.html'] = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CSS Test</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Styled with Generated CSS</h1>
  <div class="container">
    <p>This content is styled by the CSS generated in <code>styles.css</code>.</p>
  </div>
</body>
</html>`;
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '95vh', gap: '1rem', padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          type="text"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Enter your coding prompt (e.g., 'create a button that alerts hello')"
          style={{ flexGrow: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          disabled={isStreaming}
        />
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setGeneratedCode(''); // Clear code when language changes
            xtermRef.current?.reset();
          }}
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          disabled={isStreaming}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="typescript">TypeScript</option>
          <option value="react">React (TSX)</option>
          {/* Add more languages as needed */}
        </select>
        <button
          onClick={handleGenerateCode}
          disabled={isStreaming}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isStreaming ? 'Generating...' : 'Generate Code'}
        </button>
      </div>

      {error && <div style={{ color: 'red', padding: '0.5rem', border: '1px solid red', borderRadius: '4px' }}>Error: {error}</div>}

      <div style={{ display: 'flex', flexGrow: 1, gap: '1rem', overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Live Output (Xterm.js):</h3>
          <div ref={terminalRef} style={{ flexGrow: 1, backgroundColor: '#1e1e1e', borderRadius: '4px', overflow: 'hidden' }}></div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Code Playground (Sandpack):</h3>
          <div style={{ flexGrow: 1, border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
            <SandpackProvider
              template={getSandpackTemplate()}
              theme="auto"
              files={sandpackFiles}
              options={{
                activeFile: language === 'python' ? 'main.py' : language === 'html' ? 'index.html' : language === 'css' ? 'styles.css' : 'index.js',
                editorHeight: 'calc(100% - 40px)', // Adjust as needed
                showNavigator: true,
                showLineNumbers: true,
                showTabs: true,
                closableTabs: true,
              }}
            >
              <SandpackThemeProvider>
                <SandpackLayout>
                  <SandpackFileExplorer style={{ height: '100%' }} />
                  <SandpackCodeEditor style={{ height: '100%' }} />
                  <SandpackPreview style={{ height: '100%' }} />
                </SandpackLayout>
              </SandpackThemeProvider>
              <SandpackUpdater code={generatedCode} language={language} />
            </SandpackProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoderPad;
