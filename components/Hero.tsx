'use client';
import { motion } from 'framer-motion';
import { useAppStore } from '../lib/store';
import { getSceneByEmotion } from '../lib/emotionMapper';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function Hero() {
  const router = useRouter();
  const userExperience = useAppStore((state) => state.userExperience);
  
  // 감정 분석 결과가 있는지 확인
  const hasEmotionMapping = userExperience?.analyzedEmotion;
  
  // 매핑된 씬 정보 가져오기
  const mappedScene = hasEmotionMapping ? 
    getSceneByEmotion(userExperience.analyzedEmotion as any, userExperience.intensity) : null;

  const handleStartExperience = () => {
    router.push('/experience');
  };

  const handleStartForm = () => {
    router.push('/form');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Header />
      {/* 무채색 배경 효과 */}
      <div className="absolute inset-0">
        {/* 어두운 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-800"></div>
        
        {/* 무서운 기하학적 도형들 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-gray-700/20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-gray-600/30 -rotate-12 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-gray-500/40 rotate-90 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* 폐병원 창문 효과 */}
        <div className="absolute top-1/3 left-1/6 w-32 h-48 border-2 border-gray-700/30 bg-transparent"></div>
        <div className="absolute bottom-1/3 right-1/6 w-32 h-48 border-2 border-gray-700/30 bg-transparent"></div>
        <div className="absolute top-1/4 right-1/4 w-24 h-36 border border-gray-600/40 bg-transparent"></div>
        
        {/* 어두운 입체 효과 */}
        <div className="absolute top-1/6 left-1/3 w-48 h-48 bg-gradient-to-br from-gray-800/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-1/6 right-1/3 w-56 h-56 bg-gradient-to-tl from-gray-700/15 to-transparent rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl"
        >
          {/* 메인 타이틀 */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6 font-mono tracking-wider"
          >
            PHANTOM BOX
          </motion.h1>
          
          {/* 서브타이틀 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 font-mono max-w-2xl mx-auto leading-relaxed"
          >
            당신의 공포를 마주하세요
          </motion.p>

          {/* 설명 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-gray-400 mb-12 font-mono max-w-3xl mx-auto leading-relaxed"
          >
            깊은 어둠 속에서 당신의 가장 무서운 기억을 다시 마주하게 됩니다. 
            이곳에서는 도망칠 수 없습니다. 오직 마주할 수만 있습니다.
          </motion.p>

          {/* 감정 매핑 결과 표시 */}
          {hasEmotionMapping && mappedScene && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mb-8 p-6 bg-gray-900/40 border border-gray-700/50 rounded-lg backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold text-white mb-4 font-mono">
                분석된 감정: {userExperience.analyzedEmotion}
              </h3>
              <p className="text-gray-300 mb-4 font-mono">
                {mappedScene.description}
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-400 font-mono">
                <span>강도: {userExperience.intensity}/10</span>
                <span>•</span>
                <span>씬: {mappedScene.name}</span>
              </div>
            </motion.div>
          )}

          {/* 버튼들 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {hasEmotionMapping ? (
              // 감정 매핑이 완료된 경우
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartExperience}
                className="px-8 py-4 bg-red-900/50 text-red-300 border-2 border-red-700 rounded-lg font-mono text-lg hover:bg-red-800/50 hover:border-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/20"
              >
                두려움과 맞서기
              </motion.button>
            ) : (
              // 감정 매핑이 없는 경우
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartForm}
                className="px-8 py-4 bg-gray-800/50 text-gray-300 border-2 border-gray-600 rounded-lg font-mono text-lg hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300 shadow-lg"
              >
                기억을 담기
              </motion.button>
            )}
          </motion.div>

          {/* 경고 메시지 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-xs text-gray-500 mt-8 font-mono"
          >
            ⚠️ 이 경험은 심리적으로 불편할 수 있습니다. 준비가 되었을 때만 진행하세요.
          </motion.p>
        </motion.div>
      </div>

      {/* 하단 섹션들 */}
      <div className="relative z-10 bg-black">
        {/* 서비스 소개 */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6 font-mono">서비스 소개</h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto font-mono">
                Phantom Box는 당신의 가장 깊은 공포를 3D 공간에서 마주할 수 있게 해주는 
                혁신적인 심리 치료 플랫폼입니다.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 주요 기능 */}
        <section className="py-20 px-4 bg-gray-900/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6 font-mono">주요 기능</h2>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI 감정 분석",
                  description: "고급 머신러닝을 통해 당신의 감정을 정확히 분석합니다."
                },
                {
                  title: "3D 몰입 경험",
                  description: "실감나는 3D 환경에서 공포를 마주합니다."
                },
                {
                  title: "개인화된 치료",
                  description: "각자의 감정에 맞춘 맞춤형 경험을 제공합니다."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm"
                >
                  <h3 className="text-xl font-bold text-white mb-4 font-mono">{feature.title}</h3>
                  <p className="text-gray-300 font-mono">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 사용 가이드 */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6 font-mono">사용 가이드</h2>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-mono">1</div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 font-mono">기억 기록</h3>
                    <p className="text-gray-300 font-mono">가장 무서웠던 순간을 자세히 기록합니다.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-mono">2</div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 font-mono">감정 분석</h3>
                    <p className="text-gray-300 font-mono">AI가 당신의 감정을 분석하고 매핑합니다.</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-mono">3</div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 font-mono">3D 경험</h3>
                    <p className="text-gray-300 font-mono">분석된 감정에 맞는 3D 환경에서 마주합니다.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-mono">4</div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 font-mono">치유 과정</h3>
                    <p className="text-gray-300 font-mono">공포를 마주하며 치유의 과정을 경험합니다.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 개발팀 정보 */}
        <section className="py-20 px-4 bg-gray-900/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6 font-mono">개발팀</h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto font-mono">
                Phantom Box는 심리학과 기술의 융합을 통해 혁신적인 치료 경험을 제공합니다.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold text-white mb-4 font-mono">기술팀</h3>
                <p className="text-gray-300 font-mono">
                  최신 AI 기술과 3D 렌더링을 활용하여 몰입감 있는 경험을 구현합니다.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold text-white mb-4 font-mono">심리학팀</h3>
                <p className="text-gray-300 font-mono">
                  디자이너, 개발자 전공자들이 AI를 통해 수백가지 논문을 읽고 참여하여 안전하고 효과적인 치료 경험을 설계합니다.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 문의 및 연락처 */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6 font-mono">문의 및 연락처</h2>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "기술 지원",
                  description: "기술적 문제나 버그 신고",
                  contact: "chohamin0611@gmail.com"
                },
                {
                  title: "심리 상담",
                  description: "치료 관련 문의 및 상담",
                  contact: "chohamin0611@gmail.com"
                },
                {
                  title: "일반 문의",
                  description: "기타 문의사항",
                  contact: "chohamin0611@gmail.com"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm text-center"
                >
                  <h3 className="text-lg font-bold text-white mb-2 font-mono">{item.title}</h3>
                  <p className="text-gray-300 mb-4 font-mono text-sm">{item.description}</p>
                  <p className="text-red-400 font-mono">{item.contact}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
} 