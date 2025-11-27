'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function NaverCallbackPage() {
    const router = useRouter();
    const params = useSearchParams();
    const setToken = useAuthStore((state) => state.setToken);

    useEffect(() => {
        // URL에서 토큰 추출 (백엔드에서 리다이렉트한 경우)
        const token = params.get('token');

        if (token) {
            // 토큰 저장
            localStorage.setItem('accessToken', token);
            setToken(token);
            document.cookie = `access_token=${token}; path=/;`;

            // 로그인 성공 로그 기록
            fetch('/api/log/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: '로그인 성공',
                    url: window.location.href,
                    tokenLength: token.length,
                }),
            }).catch(() => { });

            console.log('✅ 네이버 로그인 성공, 대시보드로 이동합니다...');
            router.replace('/dashboard');
        } else {
            // 토큰이 없으면 에러 처리
            console.error('❌ 토큰을 받지 못했습니다.');
            router.replace('/');
        }
    }, [params, router, setToken]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">네이버 로그인 처리 중...</p>
            </div>
        </div>
    );
}
