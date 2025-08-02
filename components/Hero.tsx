'use client'

import { motion } from 'framer-motion'
import CTAButton from './CTAButton'

export default function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-horror-100 to-black relative overflow-hidden">
      {/* 배경 효과 - 더 자연스럽게 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blood-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-eerie-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 깜빡이는 효과 - 더 미묘하게 */}
      <div className="absolute inset-0 animate-flicker opacity-10 bg-gradient-to-b from-transparent via-red-900/5 to-transparent"></div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-blood-500 to-eerie-500 bg-clip-text text-transparent animate-glow">
              공포의 기억을 걷는
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed animate-pulse-slow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            당신이 가장 무서웠던 순간은 언제였나요?
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <CTAButton href="/form" variant="primary" className="text-lg px-8 py-4 animate-shadow-pulse">
              기억하러 가기
            </CTAButton>
          </motion.div>
        </motion.div>
      </div>

      {/* 하단 스크롤 인디케이터 - 더 무섭게 */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-blood-500 rounded-full flex justify-center animate-glow">
          <div className="w-1 h-3 bg-blood-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </motion.div>

      {/* 추가 공포 효과 - 더 미묘하게 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blood-500/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-0.5 h-0.5 bg-eerie-500/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blood-500/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  )
} 