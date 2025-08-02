'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppStore, Emotion } from '../lib/store'
import CTAButton from './CTAButton'

const emotions: Emotion[] = ['공포', '분노', '슬픔', '불안', '혐오', '놀람', '기쁨']

export default function Form() {
  const router = useRouter()
  const setUserExperience = useAppStore((state) => state.setUserExperience)
  
  const [formData, setFormData] = useState({
    memory: '',
    emotion: '공포' as Emotion,
    intensity: 5,
    location: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUserExperience(formData)
    router.push('/experience')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-horror-100 to-black flex items-center justify-center p-4">
      {/* 배경 효과 - 더 미묘하게 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blood-500/3 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-eerie-500/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-blood-500/20 shadow-2xl">
          <motion.h1 
            className="text-3xl font-bold text-center text-white mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            당신의 기억을 기록하세요
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 공포의 기억 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-blood-400 font-medium mb-2">
                공포의 기억
              </label>
              <textarea
                value={formData.memory}
                onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
                className="w-full h-32 px-4 py-3 bg-black/30 border border-blood-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500 resize-none"
                placeholder="그 순간에 대해 자세히 설명해주세요..."
                required
              />
            </motion.div>

            {/* 감정 선택 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-blood-400 font-medium mb-2">
                주요 감정
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {emotions.map((emotion) => (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() => setFormData({ ...formData, emotion })}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      formData.emotion === emotion
                        ? 'bg-blood-600 text-white border-blood-500 shadow-lg'
                        : 'bg-black/30 text-gray-300 border-horror-400 hover:border-blood-500 hover:bg-black/50'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 감정 강도 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-blood-400 font-medium mb-2">
                감정 강도: {formData.intensity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.intensity}
                onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
                className="w-full h-2 bg-horror-400 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #8b0000 0%, #8b0000 ${(formData.intensity / 10) * 100}%, #4a4a4a ${(formData.intensity / 10) * 100}%, #4a4a4a 100%)`
                }}
              />
            </motion.div>

            {/* 장소 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-blood-400 font-medium mb-2">
                장소 (선택사항)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 bg-black/30 border border-blood-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
                placeholder="어디서 일어났나요?"
              />
            </motion.div>

            {/* 제출 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-4"
            >
              <button type="submit" className="w-full inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-blood-600 to-eerie-600 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood-500 animate-glow transition-all duration-300 transform hover:scale-105 border border-blood-500/30">
                경험 시작하기
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  )
} 