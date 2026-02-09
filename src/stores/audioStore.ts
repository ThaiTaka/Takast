import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  currentChapterId: string | null;
  currentText: string;
  progress: number; // 0-100
  voice: SpeechSynthesisVoice | null;
  rate: number; // 0.5 - 2.0
  
  // Actions
  setPlaying: (playing: boolean) => void;
  setPaused: (paused: boolean) => void;
  setChapter: (chapterId: string) => void;
  setText: (text: string) => void;
  setProgress: (progress: number) => void;
  setVoice: (voice: SpeechSynthesisVoice | null) => void;
  setRate: (rate: number) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      isPlaying: false,
      isPaused: false,
      currentChapterId: null,
      currentText: '',
      progress: 0,
      voice: null,
      rate: 1.0,
      
      setPlaying: (playing) => set({ isPlaying: playing }),
      setPaused: (paused) => set({ isPaused: paused }),
      setChapter: (chapterId) => set({ currentChapterId: chapterId }),
      setText: (text) => set({ currentText: text }),
      setProgress: (progress) => set({ progress }),
      setVoice: (voice) => set({ voice }),
      setRate: (rate) => set({ rate: Math.max(0.5, Math.min(2.0, rate)) }),
      reset: () => set({
        isPlaying: false,
        isPaused: false,
        currentChapterId: null,
        currentText: '',
        progress: 0,
      }),
    }),
    {
      name: 'takash-audio-storage',
      partialize: (state) => ({
        rate: state.rate,
      }),
    }
  )
);
