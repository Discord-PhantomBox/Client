import { create } from 'zustand'
import * as THREE from 'three';

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
  // 프리로딩 관련 상태 추가
  preloadedEmotion: string | null;
  setPreloadedEmotion: (emotion: string | null) => void;
  isPreloading: boolean;
  setIsPreloading: (loading: boolean) => void;
  realtimeAnalysis: string | null;
  setRealtimeAnalysis: (emotion: string | null) => void;
  // 맵 크기 정보
  mapBounds: THREE.Box3 | null;
  setMapBounds: (bounds: THREE.Box3 | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  userExperience: null,
  setUserExperience: (experience) => set({ userExperience: experience }),
  reset: () => set({ userExperience: null }),
  // 프리로딩 관련 상태
  preloadedEmotion: null,
  setPreloadedEmotion: (emotion) => set({ preloadedEmotion: emotion }),
  isPreloading: false,
  setIsPreloading: (loading) => set({ isPreloading: loading }),
  realtimeAnalysis: null,
  setRealtimeAnalysis: (emotion) => set({ realtimeAnalysis: emotion }),
  // 맵 크기 정보
  mapBounds: null,
  setMapBounds: (bounds) => set({ mapBounds: bounds }),
})) 