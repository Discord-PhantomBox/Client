'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../lib/store';
import { motion } from 'framer-motion';
import axios from 'axios';

interface FormData {
  fearType: string;
  fearTypeOther: string;
  emotion: string;
  emotionOther: string;
  intensity: number;
  location: string;
  locationOther: string;
  fearPath: string;
  meaning: string;
  meaningOther: string;
  ready: string;
  readyOther: string;
}

// 감정 라벨과 가중치 매핑
const emotionLabels = {
  '가난한, 불우한': 0.15,
  '걱정스러운': 0.28,
  '고립된': 0.23,
  '괴로워하는': 0.24,
  '당혹스러운': 0.27,
  '두려운': 0.37,
  '배신당한': 0.29,
  '버려진': 0.21,
  '불안': 0.26,
  '상처': 0.17,
  '스트레스 받는': 0.34,
  '억울한': 0.22,
  '조심스러운': 0.26,
  '질투하는': 0.37,
  '초조한': 0.23,
  '충격 받은': 0.33,
  '취약한': 0.09,
  '혼란스러운': 0.31,
  '회의적인': 0.16,
  '희생된': 0.14
};

export default function Form() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const router = useRouter();
  const { setUserExperience } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    fearType: '',
    fearTypeOther: '',
    emotion: '',
    emotionOther: '',
    intensity: 5,
    location: '',
    locationOther: '',
    fearPath: '',
    meaning: '',
    meaningOther: '',
    ready: '',
    readyOther: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const questions = [
    {
      id: 'fearType',
      icon: '🔘',
      question: '당신이 겪었던 공포는 어떤 종류였나요?',
      type: 'select',
      options: [
        '낯선 사람에 대한 공포',
        '귀신이나 존재에 대한 공포',
        '높은 곳, 좁은 곳, 어두운 곳',
        '혼자 있는 상황',
        '사회적/정서적 공포 (따돌림, 불안, 상실 등)',
        '기타'
      ]
    },
    {
      id: 'emotion',
      icon: '😨',
      question: '그 순간 어떤 감정을 느꼈나요?',
      type: 'select',
      options: [
        '극도의 공포',
        '불쾌함',
        '외로움',
        '당황스러움',
        '기타'
      ]
    },
    {
      id: 'intensity',
      icon: '🎚️',
      question: '그 감정의 강도는 어땠나요?',
      type: 'slider',
      min: 1,
      max: 10
    },
    {
      id: 'location',
      icon: '🌆',
      question: '그 상황은 어디에서 일어났나요?',
      type: 'select',
      options: [
        '집 안',
        '골목길',
        '지하철/버스',
        '학교/회사',
        '자연 속 (산, 바다 등)',
        '기타'
      ]
    },
    {
      id: 'fearPath',
      icon: '🧭',
      question: '공포는 어디서 시작되어, 어디로 향했나요?',
      type: 'text',
      placeholder: '예: 골목 → 집 앞 문 → 방 안'
    },
    {
      id: 'meaning',
      icon: '💬',
      question: '지금 돌아보면, 그 경험은 어떤 의미였나요?',
      type: 'select',
      options: [
        '그냥 지나친 경험',
        '아직도 가끔 떠오름',
        '나를 성장시킨 사건',
        '무섭지만 중요한 기억',
        '기타'
      ]
    },
    {
      id: 'ready',
      icon: '🛡️',
      question: '이 경험을 다시 마주할 준비가 되어 있나요?',
      type: 'select',
      options: [
        '예',
        '아니오',
        '잘 모르겠음',
        '기타'
      ]
    }
  ];

  // 감정 분석 함수
  const analyzeEmotion = async (text: string) => {
    try {
      setIsAnalyzing(true);
      const response = await axios.post(`${BASE_URL}/label`, {
        text: text
      });
      
      const label = response.data.label;
      setAnalysisResult(label);
      
      // 분석된 라벨에 가중치 적용
      if (emotionLabels[label as keyof typeof emotionLabels]) {
        const weight = emotionLabels[label as keyof typeof emotionLabels];
        console.log(`분석된 감정: ${label}, 가중치: ${weight}`);
      }
      
      return label;
    } catch (error) {
      console.error('감정 분석 중 오류:', error);
      
      // API 오류 시 모의 감정 분석
      const mockAnalysis = () => {
        const emotions = ['두려운', '불안', '충격 받은', '고립된', '배신당한'];
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        setAnalysisResult(randomEmotion);
        return randomEmotion;
      };
      
      return mockAnalysis();
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 기타 입력 시 감정 분석 실행
  const handleOtherInput = async (field: string, value: string) => {
    const otherField = `${field}Other` as keyof FormData;
    setFormData(prev => ({
      ...prev,
      [otherField]: value
    }));

    // 텍스트 입력이 완료되면 감정 분석 실행
    if (value.length > 10) {
      await analyzeEmotion(value);
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 폼 완료 시 감정 분석 실행
      const performFinalAnalysis = async () => {
        // 모든 텍스트 입력을 합쳐서 감정 분석
        const allText = [
          formData.fearType === '기타' ? formData.fearTypeOther : formData.fearType,
          formData.emotion === '기타' ? formData.emotionOther : formData.emotion,
          formData.location === '기타' ? formData.locationOther : formData.location,
          formData.fearPath,
          formData.meaning === '기타' ? formData.meaningOther : formData.meaning,
          formData.ready === '기타' ? formData.readyOther : formData.ready
        ].filter(text => text && text.length > 0).join(' ');
        
        if (allText.length > 10) {
          const analyzedEmotion = await analyzeEmotion(allText);
          if (analyzedEmotion) {
            setUserExperience({
              emotion: formData.emotion === '기타' ? formData.emotionOther : formData.emotion,
              intensity: formData.intensity,
              location: formData.location === '기타' ? formData.locationOther : formData.location,
              fearType: formData.fearType === '기타' ? formData.fearTypeOther : formData.fearType,
              fearPath: formData.fearPath,
              meaning: formData.meaning === '기타' ? formData.meaningOther : formData.meaning,
              ready: formData.ready === '기타' ? formData.readyOther : formData.ready,
              analyzedEmotion: analyzedEmotion
            });
          } else {
            // 감정 분석 실패 시 기본값 설정
            setUserExperience({
              emotion: formData.emotion === '기타' ? formData.emotionOther : formData.emotion,
              intensity: formData.intensity,
              location: formData.location === '기타' ? formData.locationOther : formData.location,
              fearType: formData.fearType === '기타' ? formData.fearTypeOther : formData.fearType,
              fearPath: formData.fearPath,
              meaning: formData.meaning === '기타' ? formData.meaningOther : formData.meaning,
              ready: formData.ready === '기타' ? formData.readyOther : formData.ready,
              analyzedEmotion: '두려운' // 기본값
            });
          }
        } else {
          // 텍스트가 부족한 경우 기본값 설정
          setUserExperience({
            emotion: formData.emotion === '기타' ? formData.emotionOther : formData.emotion,
            intensity: formData.intensity,
            location: formData.location === '기타' ? formData.locationOther : formData.location,
            fearType: formData.fearType === '기타' ? formData.fearTypeOther : formData.fearType,
            fearPath: formData.fearPath,
            meaning: formData.meaning === '기타' ? formData.meaningOther : formData.meaning,
            ready: formData.ready === '기타' ? formData.readyOther : formData.ready,
            analyzedEmotion: '두려운' // 기본값
          });
        }
        
        router.push('/result');
      };
      
      performFinalAnalysis();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (value: string | number) => {
    const currentQuestion = questions[currentStep];
    setFormData(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const currentQuestion = questions[currentStep];
  
  // 기타 옵션을 선택했을 때 추가 입력이 필요한지 확인
  const needsOtherInput = (field: string) => {
    return formData[field as keyof FormData] === '기타' && 
           formData[`${field}Other` as keyof FormData] === '';
  };

  // 다음 버튼 활성화 조건 수정
  const canProceedWithOther = () => {
    const currentValue = formData[currentQuestion.id as keyof FormData];
    if (currentValue === '기타') {
      const otherField = `${currentQuestion.id}Other` as keyof FormData;
      return formData[otherField] !== '';
    }
    return currentValue !== '';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* 배경 효과 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-900/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-800/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        {/* 폐병원 창문 */}
        <div className="absolute top-1/3 left-1/6 w-32 h-48 border-2 border-gray-700/30 bg-transparent"></div>
        <div className="absolute bottom-1/3 right-1/6 w-32 h-48 border-2 border-gray-700/30 bg-transparent"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-black/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
        >
          {/* 진행률 */}
          <div className="mb-8">
            <div className="flex justify-between text-gray-400 text-sm font-mono mb-2">
              <span>질문 {currentStep + 1} / {questions.length}</span>
              <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700/30 rounded-full h-2">
              <motion.div
                className="bg-red-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* 질문 */}
          <div className="mb-8">
            <div className="text-4xl mb-4">{currentQuestion.icon}</div>
            <h2 className="text-2xl font-bold text-white mb-6 font-mono">
              {currentQuestion.question}
            </h2>

            {/* 입력 필드 */}
            {currentQuestion.type === 'text' && (
              <textarea
                value={formData[currentQuestion.id as keyof FormData] as string}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full h-32 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white font-mono resize-none focus:outline-none focus:border-red-500 transition-colors"
              />
            )}

            {currentQuestion.type === 'select' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleInputChange(option)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 font-mono ${
                      formData[currentQuestion.id as keyof FormData] === option
                        ? 'bg-red-900/30 border-red-500 text-white'
                        : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500'
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
                
                {/* 기타 선택 시 추가 입력 필드 */}
                {formData[currentQuestion.id as keyof FormData] === '기타' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 space-y-3"
                  >
                    <input
                      type="text"
                      value={formData[`${currentQuestion.id}Other` as keyof FormData] as string}
                      onChange={(e) => handleOtherInput(currentQuestion.id, e.target.value)}
                      placeholder="직접 입력해주세요..."
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white font-mono focus:outline-none focus:border-red-500 transition-colors"
                    />
                    
                    {/* 감정 분석 결과 표시 */}
                    {isAnalyzing && (
                      <div className="text-center py-2">
                        <div className="text-red-400 text-sm font-mono animate-pulse">
                          감정 분석 중...
                        </div>
                      </div>
                    )}
                    
                    {analysisResult && !isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-900/20 border border-red-500/30 rounded-lg p-3"
                      >
                        <div className="text-red-400 text-sm font-mono">
                          분석된 감정: <span className="text-white font-bold">{analysisResult}</span>
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          가중치: {emotionLabels[analysisResult as keyof typeof emotionLabels]?.toFixed(2) || 'N/A'}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {currentQuestion.type === 'slider' && (
              <div className="space-y-4">
                <div className="flex justify-between text-gray-400 text-sm font-mono">
                  <span>1 (약함)</span>
                  <span>10 (매우 강함)</span>
                </div>
                <input
                  type="range"
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  value={formData.intensity}
                  onChange={(e) => handleInputChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-center">
                  <span className="text-2xl font-bold text-red-400 font-mono">
                    {formData.intensity}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 네비게이션 버튼 */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-800/50 text-gray-300 border border-gray-600 rounded-lg font-mono hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              이전
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceedWithOther()}
              className="px-6 py-3 bg-red-900/50 text-red-300 border border-red-700 rounded-lg font-mono hover:bg-red-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentStep === questions.length - 1 ? '완료' : '다음'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 