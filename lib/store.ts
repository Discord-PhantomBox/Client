import { create } from 'zustand'

interface UserExperience {
  emotion: string
  intensity: number
  location: string
  fearType: string
  fearPath: string
  meaning: string
  ready: string
  analyzedEmotion?: string
}

interface AppStore {
  userExperience: UserExperience | null;
  setUserExperience: (experience: UserExperience) => void;
  reset: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  userExperience: null,
  setUserExperience: (experience) => set({ userExperience: experience }),
  reset: () => set({ userExperience: null }),
})) 