'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../lib/auth';
import { motion } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="fixed w-full z-50 bg-black/40 backdrop-blur-md border border-gray-700/30 shadow-lg rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-bold text-white font-mono tracking-wider"
            >
              <span className="text-shadow-lg shadow-red-900/50">PHANTOM</span>
              <span className="text-gray-400">BOX</span>
            </motion.div>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white font-mono transition-colors duration-200 hover:bg-white/10 px-3 py-1.5 rounded text-sm"
            >
              홈
            </Link>
            <Link 
              href="/form" 
              className="text-gray-300 hover:text-white font-mono transition-colors duration-200 hover:bg-white/10 px-3 py-1.5 rounded text-sm"
            >
              기억 기록
            </Link>
            <Link 
              href="/experience" 
              className="text-gray-300 hover:text-white font-mono transition-colors duration-200 hover:bg-white/10 px-3 py-1.5 rounded text-sm"
            >
              3D 체험
            </Link>
          </nav>

          {/* 사용자 정보 */}
          <div className="hidden md:flex items-center space-x-3">
            <span className="text-gray-300 text-xs font-mono bg-white/10 px-2 py-1 rounded">
              Phantom Box
            </span>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 text-gray-300 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t border-gray-700/30 bg-black/60 backdrop-blur-md rounded-b-lg"
          >
            <div className="px-4 py-3 space-y-2">
              <Link 
                href="/" 
                className="block text-gray-300 hover:text-white font-mono transition-colors duration-200 hover:bg-white/10 px-3 py-2 rounded text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                홈
              </Link>
              <Link 
                href="/form" 
                className="block text-gray-300 hover:text-white font-mono transition-colors duration-200 hover:bg-white/10 px-3 py-2 rounded text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                기억 기록
              </Link>
              <Link 
                href="/experience" 
                className="block text-gray-300 hover:text-white font-mono transition-colors duration-200 hover:bg-white/10 px-3 py-2 rounded text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                3D 체험
              </Link>
              <div className="pt-3 border-t border-gray-700/30">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-xs font-mono bg-white/10 px-2 py-1 rounded">
                    Phantom Box
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
} 