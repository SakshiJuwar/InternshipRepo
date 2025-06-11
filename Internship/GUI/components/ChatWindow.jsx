'use client';
import { useState } from 'react';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt: input }),
    });
    const data = await res.json();
    setMessages([...messages, { user: input, bot: data.response }]);
    setInput('');
  };

  return (
    <div className="p-4">
      <div className="h-96 overflow-y-scroll border p-2">
        {messages.map((msg, i) => (
          <div key={i}>
            <p><strong>:</strong> {msg.user}</p>
            <p><strong>Bot:</strong> {msg.bot}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input value={input} onChange={(e) => setInput(e.target.value)} className="border p-2 w-full" />
        <button onClick={handleSend} className="ml-2 bg-blue-500 text-white px-4 py-2">Send</button>
      </div>
    </div>
  );
}