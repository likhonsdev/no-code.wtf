'use client';

import { useChat } from 'ai/react';
import AITerminal from './AITerminal';
import { Message } from 'ai'; // Import Message type
import { VisibilitySelector } from './VisibilitySelector'; // Import VisibilitySelector

function MyChat() {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: '/api/chat', // New API route for chat
  });

  // Assuming a chat ID is available, for demonstration purposes
  const chatId = 'some-chat-id';

  const handleTerminalCommand = (command: string) => {
    console.log('Terminal command received:', command);
    // For now, AITerminal handles its own AI generation.
    // If you want the terminal commands to be part of the chat history,
    // you would use 'append' here:
    // append({ role: 'user', content: `/command ${command}` });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '16px' }}>
          <VisibilitySelector chatId={chatId} selectedVisibilityType="private" />
        </div>
        {messages.map((message: Message) => (
          <div key={message.id} style={{ marginBottom: '8px' }}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>
      <div style={{ height: '500px', borderTop: '1px solid #333' }}>
        <AITerminal onCommand={handleTerminalCommand} />
      </div>
      <form onSubmit={handleSubmit} style={{ padding: '16px', borderTop: '1px solid #eee' }}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
          style={{ width: 'calc(100% - 80px)', padding: '8px', marginRight: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Send</button>
      </form>
    </div>
  );
}

export default MyChat;