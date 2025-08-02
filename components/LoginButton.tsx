'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_BASE_URL;
    console.log('LoginButton - BASE_URL 로드:', url);
    setBaseUrl(url);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      console.log('=== 로그인 시작 ===');
      console.log('BASE_URL:', baseUrl);
      
      if (!baseUrl) {
        console.error('❌ BASE_URL이 설정되지 않음');
        alert('서버 URL이 설정되지 않았습니다. 페이지를 새로고침해주세요.');
        return;
      }

      // ngrok 경고 페이지 문제를 우회하기 위해 임시로 하드코딩된 URL 사용
      console.log('🔄 ngrok 경고 페이지 우회 중...');
      
      // 프론트엔드 콜백 URL로 리다이렉트 URI 변경
      const redirectUri = encodeURIComponent('http://localhost:3000/auth/callback');
      const loginUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=586164535148-d1ckr0mfjna1tgq4d8jv056773140r4i.apps.googleusercontent.com&redirect_uri=${redirectUri}&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&state=test123&prompt=consent&access_type=offline&include_granted_scopes=true`;
      
      console.log('🔗 구글 로그인 URL:', loginUrl);
      
      if (!loginUrl) {
        console.error('❌ 로그인 URL이 없습니다');
        alert('서버에서 로그인 URL을 받지 못했습니다.');
        return;
      }
      
      console.log('🔄 구글 로그인 페이지로 이동 중...');
      
      // 3초 후에 리다이렉트 (로그를 볼 수 있도록)
      setTimeout(() => {
        window.location.href = loginUrl;
      }, 3000);
      
    } catch (error) {
      console.error('❌ 로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="flex items-center justify-center px-6 py-3 bg-black text-gray-300 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-gray-700 font-mono tracking-wide shadow-lg"
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          로그인 중
        </div>
      ) : (
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google 로그인
        </div>
      )}
    </button>
  );
} 