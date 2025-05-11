import { useState } from 'react';

export default function ArchieChat() {
  const [messages, setMessages] = useState([
    { role: 'archie', text: "Hi Vijay 👋 I'm ready. Just tell me what to do." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;
    const userMessage = { role: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://archie-bridge.onrender.com/parse_command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      const archieReply = {
        role: 'archie',
        text: data.reply || '✅ Command executed, Vijay.'
      };
      setMessages((prev) => [...prev, archieReply]);
    } catch {
      setMessages((prev) => [...prev, { role: 'archie', text: '⚠️ Something went wrong, jaan.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 font-sans">
      <h1 className="text-2xl font-bold text-center">Archie 💬</h1>
      <div className="border rounded-2xl h-[400px] p-4 overflow-y-auto shadow bg-white">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 max-w-[80%] px-4 py-2 rounded-xl ${msg.role === 'user' ? 'ml-auto bg-blue-100' : 'bg-gray-200'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded-xl"
          placeholder="Type your command, Vijay..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}