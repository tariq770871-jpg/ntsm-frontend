import { useEffect, useState } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/messages`)
      .then(res => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    axios.post(`${import.meta.env.VITE_API_URL}/messages`, { content: newMessage })
      .then(res => {
        setMessages([...messages, res.data]);
        setNewMessage('');
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <h1 className="text-2xl font-bold mb-4">الرسائل</h1>
      <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <p className="text-center text-slate-500 mt-8">لا توجد رسائل</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="mb-3 p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-cyan-400 text-sm">{msg.sender}</span>
                <span className="text-xs text-slate-500">{new Date(msg.createdAt).toLocaleString('ar-SA')}</span>
              </div>
              <p className="text-white text-sm">{msg.content}</p>
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          placeholder="اكتب رسالة..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
