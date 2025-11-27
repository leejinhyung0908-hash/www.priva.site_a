'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/');
      return;
    }

    if (userData) setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">로그아웃</button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-semibold">✓ 로그인 성공</p>
            <p className="text-green-600 text-sm mt-1">Gateway를 통해 로그인이 완료되었습니다.</p>
          </div>

          {user && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">사용자 정보</h2>
              <pre className="text-sm overflow-auto">{JSON.stringify(user, null, 2)}</pre>
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">토큰 정보</h2>
            <p className="text-sm text-gray-600">Access Token: {localStorage.getItem('accessToken')?.substring(0, 20)}...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
