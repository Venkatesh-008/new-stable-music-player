import TrackPlayer from 'react-native-track-player';
import { storage } from '../store/mmkv';
import { usePlayerStore } from '../store/playerStore';

export const savePlaybackState = async (currentSong, isShuffleEnabled, currentQueueId) => {
  try {
    if (!currentSong) return;
    
    const { position } = await TrackPlayer.getProgress();
    const queue = await TrackPlayer.getQueue();
    const activeTrackIndex = await TrackPlayer.getActiveTrackIndex();
    
    const store = usePlayerStore.getState();
    const state = {
      song: currentSong,
      position,
      queue,
      originalQueue: store.originalQueue,
      activeQueue: store.activeQueue,
      queueId: currentQueueId,
      shuffle: isShuffleEnabled,
    };
    
    storage.set('savedPlaybackState', JSON.stringify(state));
  } catch (error) {
  }
};

export const restorePlaybackState = async () => {
  try {
    const stateStr = storage.getString('savedPlaybackState');
    if (!stateStr) return null;
    
    const state = JSON.parse(stateStr);
    
    if (state.queue && state.queue.length > 0) {
       const store = usePlayerStore.getState();
       store.setQueueState({
         originalQueue: state.originalQueue ? [...state.originalQueue] : [],
         activeQueue: state.activeQueue ? [...state.activeQueue] : [],
         currentQueueId: state.queueId,
         isShuffleEnabled: state.shuffle,
       });
       
       await TrackPlayer.reset();
       await TrackPlayer.add(state.queue);
       
       const trackIndex = state.queue.findIndex(t => t.id.toString() === state.song.id.toString());
       if (trackIndex !== -1) {
         await TrackPlayer.skip(trackIndex);
       }
       if (state.position) {
         await TrackPlayer.seekTo(state.position);
       }
       
       return state;
    }
  } catch (error) {
  }
  return null;
};
