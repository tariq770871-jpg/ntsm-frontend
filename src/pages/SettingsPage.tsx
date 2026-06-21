import { useState } from 'react';
import axios from 'axios';

export default function SettingsPage() {
  const [mikrotikForm, setMikrotikForm] = useState({
    ipAddress: '',
    port: '8728',
    username: 'monitor',
    password: '',
    ssl: false,
  });

  const handleTest = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/devices/test-mikrotik`, mikrotikForm);
      alert(res.data.success ? 'نجح الاتصال' : `فشل: ${res.data.error}`);
    } catch (e) {
      alert('خطأ في الاتصال');
    }
  };

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">ربط MikroTik</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">IP الجهاز</label>
            <input type="text" value={mikrotikForm.ipAddress} onChange={e => setMikrotikForm({...mikrotikForm, ipAddress: e.target.value})} className="w-full p-2 border rounded text-left" placeholder="192.168.88.1" />
          </div>
          <div>
            <label className="block text-sm mb-1">المنفذ</label>
            <input type="number" value={mikrotikForm.port} onChange={e => setMikrotikForm({...mikrotikForm, port: e.target.value})} className="w-full p-2 border rounded text-left" />
          </div>
          <div>
            <label className="block text-sm mb-1">اسم المستخدم</label>
            <input type="text" value={mikrotikForm.username} onChange={e => setMikrotikForm({...mikrotikForm, username: e.target.value})} className="w-full p-2 border rounded text-left" />
          </div>
          <div>
            <label className="block text-sm mb-1">كلمة المرور</label>
            <input type="password" value={mikrotikForm.password} onChange={e => setMikrotikForm({...mikrotikForm, password: e.target.value})} className="w-full p-2 border rounded text-left" />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleTest} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">اختبار الاتصال</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">سكريبت MikroTik</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto text-left" dir="ltr">
{`:local sysUser "monitor"
:local sysPass "STRONG_PASSWORD"
:local serverIP "YOUR_SERVER_IP"

/user group add name=monitoring policy=read,api,winbox,!local,!telnet,!ssh,!ftp,!reboot,!write,!policy,!test,!password
/user add name=$sysUser group=monitoring password=$sysPass comment="NOC System Read-Only"
/ip service enable api
/ip service set api port=8728 address=$serverIP
/ip firewall filter add chain=input protocol=tcp dst-port=8728 src-address=$serverIP action=accept place-before=0
/ip firewall filter add chain=input protocol=tcp dst-port=8728 action=drop place-before=0
:log info "NOC monitoring enabled"`}
        </pre>
        <button onClick={() => navigator.clipboard.writeText(document.querySelector('pre')?.textContent || '')} className="mt-2 bg-gray-200 px-4 py-2 rounded">نسخ</button>
      </div>
    </div>
  );
}
