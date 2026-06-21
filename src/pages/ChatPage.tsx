import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const socket = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;
    socket.emit('join', 'team');
    socket.on('message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => { socket.off('message'); };
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim() || !socket || !user) return;
    socket.emit('message', {
      room: 'team',
      content: input,
      senderId: user.id,
      chatType: 'team',
    });
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">المحادثات</h1>
      <div className="flex-1 bg-white rounded shadow overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={`p-2 rounded ${m.senderId === user?.id ? 'bg-blue-100 mr-auto' : 'bg-gray-100'}`}>
              <p className="text-sm">{m.content}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 border-t flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            className="flex-1 p-2 border rounded text-right"
            placeholder="اكتب رسالة..."
          />
          <button onClick={send} className="bg-blue-600 text-white px-4 py-2 rounded">إرسال</button>
        </div>
      </div>
    </div>
  );
}
