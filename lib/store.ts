import { create } from 'zustand'

export type Emotion = '공포' | '분노' | '슬픔' | '불안' | '혐오' | '놀람' | '기쁨'

export interface UserExperience {
  memory: string
  emotion: Emotion
  intensity: number
  location: string
}

interface AppState {
  userExperience: UserExperience | null
  currentScene: string
  isInExperience: boolean
  setUserExperience: (experience: UserExperience) => void
  setCurrentScene: (scene: string) => void
  setIsInExperience: (isIn: boolean) => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  userExperience: null,
  currentScene: '',
  isInExperience: false,
  setUserExperience: (experience) => set({ userExperience: experience }),
  setCurrentScene: (scene) => set({ currentScene: scene }),
  setIsInExperience: (isIn) => set({ isInExperience: isIn }),
  reset: () => set({ userExperience: null, currentScene: '', isInExperience: false }),
})) 