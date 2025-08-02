'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/auth';

export default function AuthRedirect() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // 로그인하지 않은 상태에서는 아무것도 하지 않음
    if (!isAuthenticated || !user) {
      return;
    }

    // 로그인된 상태에서는 홈으로 이동
    router.push('/');
  }, [isAuthenticated, user, router]);

  return null;
} 