// 감정 타입 정의
export type Emotion = 
  | '가난한, 불우한'
  | '걱정스러운'
  | '고립된'
  | '괴로워하는'
  | '당혹스러운'
  | '두려운'
  | '배신당한'
  | '버려진'
  | '불안'
  | '상처'
  | '스트레스 받는'
  | '억울한'
  | '조심스러운'
  | '질투하는'
  | '초조한'
  | '충격 받은'
  | '취약한'
  | '혼란스러운'
  | '회의적인'
  | '희생된';

export interface SceneConfig {
  name: string
  description: string
  color: string
  particles: number
  message: string
}

// 감정별 가중치 정의 (Form.tsx와 동일)
export const emotionWeights: Record<Emotion, number> = {
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

// 실시간 감정 분석 함수
export const analyzeRealtimeEmotion = (text: string): Emotion => {
  // 간단한 키워드 기반 감정 분석
  const keywords: Record<string, Emotion[]> = {
    '두려워': ['두려운', '불안', '초조한'],
    '무서워': ['두려운', '충격 받은'],
    '외로워': ['고립된', '버려진'],
    '배신': ['배신당한', '상처'],
    '질투': ['질투하는'],
    '불안': ['불안', '걱정스러운'],
    '스트레스': ['스트레스 받는'],
    '혼란': ['혼란스러운', '당혹스러운'],
    '상처': ['상처', '괴로워하는'],
    '취약': ['취약한'],
    '희생': ['희생된'],
    '가난': ['가난한, 불우한'],
    '억울': ['억울한'],
    '조심': ['조심스러운'],
    '회의': ['회의적인']
  };

  const lowerText = text.toLowerCase();
  const detectedEmotions: Emotion[] = [];

  // 키워드 매칭
  for (const [keyword, emotions] of Object.entries(keywords)) {
    if (lowerText.includes(keyword)) {
      detectedEmotions.push(...emotions);
    }
  }

  // 감정이 감지되면 가중치가 가장 높은 것을 반환
  if (detectedEmotions.length > 0) {
    const emotionWithWeights = detectedEmotions.map(emotion => ({
      emotion,
      weight: emotionWeights[emotion]
    }));
    
    emotionWithWeights.sort((a, b) => b.weight - a.weight);
    return emotionWithWeights[0].emotion;
  }

  // 감지되지 않으면 기본값
  return '두려운';
};

// 가장 높은 가중치의 감정 찾기
export const getHighestWeightEmotion = (emotions: Emotion[]): Emotion => {
  if (emotions.length === 0) return '두려운';
  
  const emotionWithWeights = emotions.map(emotion => ({
    emotion,
    weight: emotionWeights[emotion]
  }));
  
  emotionWithWeights.sort((a, b) => b.weight - a.weight);
  return emotionWithWeights[0].emotion;
};

export const emotionToScene: Record<Emotion, SceneConfig> = {
  '가난한, 불우한': {
    name: '빈곤한 거리',
    description: '빈곤과 절망이 가득한 어두운 거리',
    color: '#2f2f2f',
    particles: 20,
    message: '당신은 이 빈곤을 마주했습니다.'
  },
  '걱정스러운': {
    name: '불안의 미로',
    description: '끝없이 이어지는 걱정의 미로',
    color: '#4a4a4a',
    particles: 35,
    message: '당신은 이 걱정을 마주했습니다.'
  },
  '고립된': {
    name: '외톨이의 방',
    description: '깊은 고립감이 가득한 방',
    color: '#1a1a1a',
    particles: 15,
    message: '당신은 이 고립을 마주했습니다.'
  },
  '괴로워하는': {
    name: '고통의 공간',
    description: '끝없는 괴로움이 가득한 공간',
    color: '#3a3a3a',
    particles: 40,
    message: '당신은 이 괴로움을 마주했습니다.'
  },
  '당혹스러운': {
    name: '혼란의 폭풍',
    description: '갑작스러운 혼란의 폭풍',
    color: '#5a5a5a',
    particles: 60,
    message: '당신은 이 당혹을 마주했습니다.'
  },
  '두려운': {
    name: '공포의 어둠',
    description: '깊고 어두운 공포의 공간',
    color: '#000000',
    particles: 80,
    message: '당신은 이 공포를 마주했습니다.'
  },
  '배신당한': {
    name: '배신의 상처',
    description: '깊은 배신감이 가득한 공간',
    color: '#8b0000',
    particles: 50,
    message: '당신은 이 배신을 마주했습니다.'
  },
  '버려진': {
    name: '버림받은 곳',
    description: '깊은 외로움이 가득한 공간',
    color: '#2a2a2a',
    particles: 25,
    message: '당신은 이 버림을 마주했습니다.'
  },
  '불안': {
    name: '불안의 미로',
    description: '끝없는 불안이 가득한 미로',
    color: '#4a4a4a',
    particles: 45,
    message: '당신은 이 불안을 마주했습니다.'
  },
  '상처': {
    name: '상처의 공간',
    description: '깊은 상처가 가득한 공간',
    color: '#6a6a6a',
    particles: 30,
    message: '당신은 이 상처를 마주했습니다.'
  },
  '스트레스 받는': {
    name: '압박의 공간',
    description: '강한 압박감이 가득한 공간',
    color: '#5a5a5a',
    particles: 55,
    message: '당신은 이 스트레스를 마주했습니다.'
  },
  '억울한': {
    name: '억울함의 공간',
    description: '깊은 억울함이 가득한 공간',
    color: '#7a7a7a',
    particles: 40,
    message: '당신은 이 억울함을 마주했습니다.'
  },
  '조심스러운': {
    name: '경계의 공간',
    description: '끊임없는 경계심이 가득한 공간',
    color: '#4a4a4a',
    particles: 35,
    message: '당신은 이 경계를 마주했습니다.'
  },
  '질투하는': {
    name: '질투의 불길',
    description: '녹색 불길이 치솟는 공간',
    color: '#228b22',
    particles: 70,
    message: '당신은 이 질투를 마주했습니다.'
  },
  '초조한': {
    name: '초조의 공간',
    description: '끊임없는 초조함이 가득한 공간',
    color: '#5a5a5a',
    particles: 50,
    message: '당신은 이 초조를 마주했습니다.'
  },
  '충격 받은': {
    name: '충격의 폭발',
    description: '갑작스러운 충격의 폭발',
    color: '#ff4500',
    particles: 90,
    message: '당신은 이 충격을 마주했습니다.'
  },
  '취약한': {
    name: '취약함의 공간',
    description: '깊은 취약함이 가득한 공간',
    color: '#3a3a3a',
    particles: 20,
    message: '당신은 이 취약함을 마주했습니다.'
  },
  '혼란스러운': {
    name: '혼란의 소용돌이',
    description: '끊임없이 회전하는 혼란의 소용돌이',
    color: '#6a6a6a',
    particles: 65,
    message: '당신은 이 혼란을 마주했습니다.'
  },
  '회의적인': {
    name: '회의의 공간',
    description: '깊은 회의가 가득한 공간',
    color: '#4a4a4a',
    particles: 30,
    message: '당신은 이 회의를 마주했습니다.'
  },
  '희생된': {
    name: '희생의 공간',
    description: '깊은 희생이 가득한 공간',
    color: '#2a2a2a',
    particles: 25,
    message: '당신은 이 희생을 마주했습니다.'
  }
}

export const getSceneByEmotion = (emotion: Emotion, intensity: number): SceneConfig => {
  const baseScene = emotionToScene[emotion]
  
  // 감정 강도에 따라 더 어둡게 조정
  const darkenColor = (color: string, factor: number): string => {
    // 간단한 색상 어둡게 조정
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)
      
      const darkenFactor = Math.max(0.1, 1 - (intensity / 10))
      const newR = Math.floor(r * darkenFactor)
      const newG = Math.floor(g * darkenFactor)
      const newB = Math.floor(b * darkenFactor)
      
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
    }
    return color
  }
  
  return {
    ...baseScene,
    particles: Math.floor(baseScene.particles * (intensity / 10)),
    color: darkenColor(baseScene.color, intensity / 10)
  }
} 