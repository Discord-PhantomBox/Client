'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-700/50 relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gray-900/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gray-800/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        {/* 폐병원 창문 */}
        <div className="absolute top-1/2 left-1/6 w-24 h-32 border border-gray-700/20 bg-transparent"></div>
        <div className="absolute bottom-1/2 right-1/6 w-24 h-32 border border-gray-700/20 bg-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* 로고 및 설명 */}
            <div className="col-span-1 md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl font-bold text-white font-mono tracking-wider mb-4">
                  <span className="text-shadow-lg shadow-red-900/50">PHANTOM</span>
                  <span className="text-gray-400">BOX</span>
                </div>
                <p className="text-gray-400 text-sm font-mono leading-relaxed mb-6">
                  당신의 가장 무서운 기억을 담는 디지털 공간입니다.<br />
                  폐병원의 분위기에서 마주하는 자신의 감정과 기억들을 통해,<br />
                  더 나은 내일을 위한 회고의 시간을 가져보세요.
                </p>
                <div className="flex space-x-4">
                  <div className="w-2 h-2 bg-red-500/30 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-red-500/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="w-2 h-2 bg-red-500/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
              </motion.div>
            </div>

            {/* 빠른 링크 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold text-white mb-4 font-mono">빠른 링크</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white font-mono text-sm transition-colors duration-200">
                    홈
                  </Link>
                </li>
                <li>
                  <Link href="/form" className="text-gray-400 hover:text-white font-mono text-sm transition-colors duration-200">
                    기억 기록
                  </Link>
                </li>
                <li>
                  <Link href="/experience" className="text-gray-400 hover:text-white font-mono text-sm transition-colors duration-200">
                    3D 체험
                  </Link>
                </li>
                <li>
                  <Link href="/mypage" className="text-gray-400 hover:text-white font-mono text-sm transition-colors duration-200">
                    마이페이지
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* 연락처 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold text-white mb-4 font-mono">연락처</h3>
              <ul className="space-y-2">
                <li className="text-gray-400 font-mono text-sm">
                  이메일: phantombox@example.com
                </li>
                <li className="text-gray-400 font-mono text-sm">
                  피드백: 서비스 개선 의견
                </li>
                <li className="text-gray-400 font-mono text-sm">
                  버그 리포트: 발견한 문제점
                </li>
              </ul>
            </motion.div>
          </div>

          {/* 하단 구분선 */}
          <div className="border-t border-gray-700/50 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-gray-400 text-sm font-mono mb-4 md:mb-0"
              >
                © 2024 Phantom Box. 모든 권리 보유.
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex space-x-6"
              >
                <Link href="#" className="text-gray-400 hover:text-white font-mono text-sm transition-colors duration-200">
                  개인정보처리방침
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white font-mono text-sm transition-colors duration-200">
                  이용약관
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white font-mono text-sm transition-colors duration-200">
                  쿠키 정책
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* 추가 무서운 효과들 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-red-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-0.5 h-0.5 bg-red-500/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-0.5 h-0.5 bg-red-500/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </footer>
  );
} 