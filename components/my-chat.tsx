import { Chatbot } from 'ai/react';
import AITerminal from './AITerminal';

function MyChat() {
  const handleTerminalCommand = (command: string) => {
    console.log('Terminal command received:', command);
    // Here you would typically send this command to a backend for execution
    // For now, the AITerminal component itself handles sending to AI for generation
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* You can keep the Chatbot or remove it based on your final design */}
        <Chatbot
          initialMessages={[]}
          onMessage={async (message) => {
            // Handle new messages for the chatbot, if still in use
            console.log('Chatbot message:', message);
          }}
          tools={[]}
        />
      </div>
      <div style={{ height: '500px', borderTop: '1px solid #333' }}>
        <AITerminal onCommand={handleTerminalCommand} />
      </div>
    </div>
  );
}

export default MyChat;