'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push('/auth/login'); return; }
    // redirect based on role stored in localStorage or fetch from API
    fetch('/api/roles').then(r => r.json()).then(data => {
      const me = data.users?.find((u: any) => u.uid === user.uid);
      const role = me?.role || 'student';
      const routes: Record<string, string> = {
        admin: '/admin',
        teacher: '/teacher',
        sales: '/sales',
        support: '/support',
        editor: '/editor',
        parent: '/parent',
        student: '/student',
      };
      router.push(routes[role] || '/student');
    });
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-royal-200 border-t-royal-600 rounded-full animate-spin mx-auto" />
        <p className="text-royal-500 font-medium">جارٍ تحميل لوحة التحكم...</p>
      </div>
    </div>
  );
}
