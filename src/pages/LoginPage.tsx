import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(phone, password);
      navigate('/dashboard');
    } catch {
      setError('رقم الهاتف أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          إدارة الدعم الفني والصيانة للشبكات
        </h1>
        <p className="text-center text-sm text-gray-500">NTSM</p>
        
        {error && <p className="text-red-500 bg-red-50 p-2 rounded text-sm text-center">{error}</p>}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-left"
            placeholder="أدخل رقم الهاتف"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-left"
            placeholder="أدخل كلمة المرور"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition"
        >
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
}
