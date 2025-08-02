'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../lib/auth';
import axios from 'axios';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code) {
          setError('인증 코드가 없습니다.');
          return;
        }

        if (!BASE_URL) {
          setError('서버 URL이 설정되지 않았습니다.');
          return;
        }

        console.log('콜백 처리 시작:', { code, state });

        // 백엔드에 인증 코드 전송
        const response = await axios.post(`${BASE_URL}/auth/login/callback`, {
          code,
          state
        });

        console.log('인증 응답:', response.data);

        // 로그인 성공 처리
        login(response.data.user);
        
        // 홈으로 리다이렉트
        router.push('/');

      } catch (error: any) {
        console.error('인증 오류:', error);
        setError('인증 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, login, router, BASE_URL]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-gray-300 text-xl font-mono animate-pulse">
          인증 처리 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-red-400 text-xl font-mono">
          {error}
        </div>
      </div>
    );
  }

  return null;
} 