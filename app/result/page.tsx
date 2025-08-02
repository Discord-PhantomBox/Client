'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '../../lib/store'
import CTAButton from '../../components/CTAButton'

export default function ResultPage() {
  return <ResultContent />
}

function ResultContent() {
  const userExperience = useAppStore((state) => state.userExperience)
  const reset = useAppStore((state) => state.reset)

  const handleRestart = () => {
    reset()
    window.location.href = '/'
  }

  if (!userExperience) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-horror-100 to-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">데이터를 불러오는 중...</div>
      </div>
    )
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
        className="w-full max-w-2xl text-center relative z-10"
      >
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-blood-500/20 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-4 animate-glow">
              회고 완료
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blood-500 to-eerie-500 mx-auto rounded"></div>
          </motion.div>

                                <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6 text-left"
                      >

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-blood-500/20">
                <h3 className="text-blood-400 font-medium mb-2">공포 유형</h3>
                <p className="text-white/80">{userExperience.fearType}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-blood-500/20">
                <h3 className="text-blood-400 font-medium mb-2">주요 감정</h3>
                <p className="text-white/80">{userExperience.emotion}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-blood-500/20">
                <h3 className="text-blood-400 font-medium mb-2">감정 강도</h3>
                <p className="text-white/80">{userExperience.intensity}/10</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-blood-500/20">
                <h3 className="text-blood-400 font-medium mb-2">장소</h3>
                <p className="text-white/80">{userExperience.location}</p>
              </div>
            </div>

            {userExperience.fearPath && (
              <div className="bg-black/30 rounded-lg p-4 border border-blood-500/20">
                <h3 className="text-blood-400 font-medium mb-2">공포의 경로</h3>
                <p className="text-white/80">{userExperience.fearPath}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-blood-500/20">
                <h3 className="text-blood-400 font-medium mb-2">경험의 의미</h3>
                <p className="text-white/80">{userExperience.meaning}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-blood-500/20">
                <h3 className="text-blood-400 font-medium mb-2">재마주 준비</h3>
                <p className="text-white/80">{userExperience.ready}</p>
              </div>
            </div>

            {userExperience.analyzedEmotion && (
              <div className="bg-black/30 rounded-lg p-4 border border-blood-500/20">
                <h3 className="text-blood-400 font-medium mb-2">AI 감정 분석 결과</h3>
                <p className="text-white/80 font-bold text-lg">{userExperience.analyzedEmotion}</p>
                <p className="text-gray-400 text-sm mt-2">
                  이 감정에 맞는 3D 환경이 준비되었습니다.
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 space-y-4"
          >
            <p className="text-white/70 text-lg animate-pulse-slow">
              당신은 자신의 감정을 마주하고 회고를 완료했습니다.
            </p>
            <p className="text-white/50">
              이 경험을 통해 더 나은 내일을 만들어가세요.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <CTAButton onClick={handleRestart} variant="primary">
              다시 시작하기
            </CTAButton>
            <CTAButton href="/" variant="secondary" icon="arrow-left">
              홈으로 돌아가기
            </CTAButton>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
} 