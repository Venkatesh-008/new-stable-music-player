import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
  originalQueue: [],
  activeQueue: [],
  currentQueueId: null,
  currentIndex: 0,
  queueType: '',
  isShuffleEnabled: false,

  setOriginalQueue: (queue) => set({ originalQueue: queue }),
  setActiveQueue: (queue) => set({ activeQueue: queue }),
  setCurrentQueueId: (id) => set({ currentQueueId: id }),
  setShuffleEnabled: (enabled) => set({ isShuffleEnabled: enabled }),
  setQueueState: (update) => set(update),
}));
