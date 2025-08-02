import { Emotion } from './store'

export interface SceneConfig {
  name: string
  description: string
  color: string
  particles: number
  message: string
}

export const emotionToScene: Record<Emotion, SceneConfig> = {
  '공포': {
    name: '어두운 숲',
    description: '깊고 어두운 숲속, 나뭇가지가 으스스하게 흔들린다',
    color: '#1a1a1a',
    particles: 50,
    message: '당신은 이 공포를 마주했습니다.'
  },
  '분노': {
    name: '붉은 폭풍',
    description: '붉은 번개가 치는 폭풍우 속',
    color: '#8b0000',
    particles: 80,
    message: '당신은 이 분노를 마주했습니다.'
  },
  '슬픔': {
    name: '비오는 거리',
    description: '빗방울이 떨어지는 어두운 거리',
    color: '#2f4f4f',
    particles: 30,
    message: '당신은 이 슬픔을 마주했습니다.'
  },
  '불안': {
    name: '미로',
    description: '끝없이 이어지는 미로',
    color: '#696969',
    particles: 40,
    message: '당신은 이 불안을 마주했습니다.'
  },
  '혐오': {
    name: '오염된 공간',
    description: '독성 물질이 가득한 공간',
    color: '#556b2f',
    particles: 60,
    message: '당신은 이 혐오를 마주했습니다.'
  },
  '놀람': {
    name: '빛의 폭발',
    description: '갑작스러운 빛의 폭발',
    color: '#ffd700',
    particles: 100,
    message: '당신은 이 놀람을 마주했습니다.'
  },
  '기쁨': {
    name: '별들의 축제',
    description: '반짝이는 별들이 춤추는 공간',
    color: '#ff69b4',
    particles: 120,
    message: '당신은 이 기쁨을 마주했습니다.'
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