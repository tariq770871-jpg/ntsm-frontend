import { useAuth } from '../contexts/AuthContext';
import { User, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>
      
      <div className="space-y-6">
        {/* معلومات المستخدم */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            معلومات المستخدم
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-400 mb-1">الاسم</label>
              <p className="text-white font-medium">{user?.name || 'غير معروف'}</p>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">رقم الهاتف</label>
              <p className="text-white font-medium" dir="ltr">{user?.phone || 'غير معروف'}</p>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">الصلاحية</label>
              <p className="text-white font-medium">
                {user?.role === 'admin' ? 'مدير النظام' : user?.role === 'support' ? 'دعم فني' : 'مهندس'}
              </p>
            </div>
          </div>
        </div>

        {/* الأمان */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            الأمان
          </h2>
          <p className="text-slate-400 text-sm">تسجيل الدخول باستخدام JWT Token</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-sm text-emerald-400">الجلسة نشطة</span>
          </div>
        </div>

        {/* الإشعارات */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            الإشعارات
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-white">تنبيهات الأجهزة</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-cyan-500" />
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-white">تنبيهات الرسائل</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-cyan-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
