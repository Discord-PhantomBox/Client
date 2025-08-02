'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/auth';
import axios from 'axios';

interface SignupData {
  nickname: string;
  username: string;
  bio?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState<SignupData>({
    nickname: '',
    username: '',
    bio: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nickname.trim() || !formData.username.trim()) {
      setError('닉네임과 아이디는 필수입니다.');
      return;
    }

    if (!BASE_URL) {
      setError('서버 연결에 실패했습니다.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${BASE_URL}/auth/signup`, {
        nickname: formData.nickname,
        username: formData.username,
        bio: formData.bio
      });

      // 회원가입 완료 후 홈으로 이동
      router.push('/');
      
    } catch (err: any) {
      console.error('회원가입 오류:', err);
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-6 text-center font-mono">
            회원가입 완료
          </h1>
          
          <p className="text-gray-400 text-center mb-6 font-mono">
            안녕하세요, {user?.name}님!<br />
            추가 정보를 입력해주세요.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-700 text-red-400 rounded font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-mono mb-2">
                닉네임 *
              </label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white font-mono focus:outline-none focus:border-gray-500"
                placeholder="닉네임을 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-mono mb-2">
                아이디 *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white font-mono focus:outline-none focus:border-gray-500"
                placeholder="아이디를 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-mono mb-2">
                자기소개
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white font-mono focus:outline-none focus:border-gray-500 resize-none"
                placeholder="자기소개를 입력하세요 (선택사항)"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-gray-800 text-white rounded font-mono hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-600"
            >
              {isLoading ? '처리 중...' : '완료'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 