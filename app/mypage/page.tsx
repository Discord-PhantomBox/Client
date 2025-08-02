'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/auth';
import axios from 'axios';
import ProtectedRoute from '../../components/ProtectedRoute';

interface UserProfile {
  nickname: string;
  username: string;
  bio?: string;
  email: string;
  picture?: string;
}

export default function MyPage() {
  return (
    <ProtectedRoute>
      <MyPageContent />
    </ProtectedRoute>
  );
}

function MyPageContent() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile>({
    nickname: '',
    username: '',
    bio: '',
    email: user?.email || '',
    picture: user?.picture
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    // 사용자 프로필 정보 로드
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      
      if (!BASE_URL) {
        console.error('BASE_URL이 설정되지 않았습니다.');
        setError('서버 연결에 실패했습니다.');
        return;
      }
      
      const response = await axios.get(`${BASE_URL}/auth/profile`);
      setProfile(response.data);
    } catch (err) {
      console.error('프로필 로드 오류:', err);
      setError('프로필을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.nickname.trim() || !profile.username.trim()) {
      setError('닉네임과 아이디는 필수입니다.');
      return;
    }

    if (!BASE_URL) {
      setError('서버 연결에 실패했습니다.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const response = await axios.put(`${BASE_URL}/auth/profile`, {
        nickname: profile.nickname,
        username: profile.username,
        bio: profile.bio
      });

      setSuccess('프로필이 성공적으로 업데이트되었습니다.');
      
    } catch (err: any) {
      console.error('프로필 업데이트 오류:', err);
      setError(err.response?.data?.message || '프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-gray-300 text-xl font-mono animate-pulse">
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-6 text-center font-mono">
            마이페이지
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-700 text-red-400 rounded font-mono">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-700 text-green-400 rounded font-mono">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-mono mb-2">
                  닉네임 *
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={profile.nickname}
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
                  value={profile.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white font-mono focus:outline-none focus:border-gray-500"
                  placeholder="아이디를 입력하세요"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-mono mb-2">
                이메일
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-400 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-mono mb-2">
                자기소개
              </label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white font-mono focus:outline-none focus:border-gray-500 resize-none"
                placeholder="자기소개를 입력하세요"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-2 px-4 bg-gray-800 text-white rounded font-mono hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-600"
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
              
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2 px-4 bg-red-900 text-white rounded font-mono hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors border border-red-700"
              >
                로그아웃
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 