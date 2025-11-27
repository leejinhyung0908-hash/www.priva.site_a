'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const [loginStatus, setLoginStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const login = searchParams.get('login');
    const message = searchParams.get('message');

    if (token) {
      localStorage.setItem('accessToken', token);
      setToken(token);
      document.cookie = `access_token=${token}; path=/;`;

      // 서버 로그 기록
      fetch('/api/log/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: '로그인 성공', url: window.location.href, tokenLength: token.length }),
      }).catch(() => { });

      router.replace('/dashboard');
      return;
    }

    if (login === 'success') {
      setLoginStatus({ success: true, message: message ? decodeURIComponent(message) : '로그인 성공' });
      router.replace('/');
    }
  }, [searchParams, router, setToken]);

  const handleKakaoLogin = async () => {
    try {
      // Gateway 로그 기록
      await fetch('/api/log/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'Gateway 카카오 연결 시작' }),
      }).catch(() => { });

      const { startSocialLogin } = await import('@/lib/api');
      await startSocialLogin('kakao');
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
    }
  };

  const handleNaverLogin = async () => {
    try {
      await fetch('/api/log/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'Gateway 네이버 연결 시작' }),
      }).catch(() => { });

      const { startSocialLogin } = await import('@/lib/api');
      await startSocialLogin('naver');
    } catch (error) {
      console.error('네이버 로그인 실패:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await fetch('/api/log/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'Gateway 구글 연결 시작' }),
      }).catch(() => { });

      const { startSocialLogin } = await import('@/lib/api');
      await startSocialLogin('google');
    } catch (error) {
      console.error('구글 로그인 실패:', error);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        {loginStatus?.success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-green-800 font-bold text-lg mb-2">로그인 성공!</h2>
            <p className="text-green-700">{loginStatus.message}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">환영합니다</h1>
            <p className="text-gray-600">원하는 소셜 계정으로 간편하게 로그인하세요</p>
          </div>

          <button
            onClick={handleKakaoLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#000000] px-6 py-4 rounded-xl text-base font-semibold hover:bg-[#FDD835] transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            카카오 로그인
          </button>

          <button
            onClick={handleNaverLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#03C75A] text-[#000000] px-6 py-4 rounded-xl text-base font-semibold hover:bg-[#02B03F] transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            네이버 로그인
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#4285F4] text-[#FFFFFF] px-6 py-4 rounded-xl text-base font-semibold hover:bg-[#3367D6] transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            구글 로그인
          </button>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              로그인 시 <a href="#" className="text-blue-600 hover:underline">개인정보 처리방침</a> 및 <a href="#" className="text-blue-600 hover:underline">이용약관</a>에 동의하게 됩니다.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">Gateway를 통해 안전하게 로그인합니다</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <LoginContent />
    </Suspense>
  );
}
