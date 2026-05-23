import TrackPlayer from 'react-native-track-player';
import { storage } from '../store/mmkv';
import { queueState } from './queueState';

export const savePlaybackState = async (currentSong, isShuffleEnabled, currentQueueId) => {
  try {
    if (!currentSong) return;
    
    const { position } = await TrackPlayer.getProgress();
    const queue = await TrackPlayer.getQueue();
    const activeTrackIndex = await TrackPlayer.getActiveTrackIndex();
    
    const state = {
      song: currentSong,
      position,
      queue,
      originalQueue: queueState.originalQueue,
      activeQueue: queueState.activeQueue,
      queueId: currentQueueId,
      shuffle: isShuffleEnabled,
    };
    
    storage.set('savedPlaybackState', JSON.stringify(state));
  } catch (error) {
    console.log('SAVE STATE ERROR:', error);
  }
};

export const restorePlaybackState = async () => {
  try {
    const stateStr = storage.getString('savedPlaybackState');
    if (!stateStr) return null;
    
    const state = JSON.parse(stateStr);
    
    if (state.queue && state.queue.length > 0) {
       // Restore queue
       queueState.originalQueue.length = 0;
       if (state.originalQueue) queueState.originalQueue.push(...state.originalQueue);
       
       queueState.activeQueue.length = 0;
       if (state.activeQueue) queueState.activeQueue.push(...state.activeQueue);
       
       queueState.currentQueueId = state.queueId;
       queueState.isShuffleEnabled = state.shuffle;
       
       await TrackPlayer.reset();
       await TrackPlayer.add(state.queue);
       
       const trackIndex = state.queue.findIndex(t => t.id.toString() === state.song.id.toString());
       if (trackIndex !== -1) {
         await TrackPlayer.skip(trackIndex);
       }
       if (state.position) {
         await TrackPlayer.seekTo(state.position);
       }
       
       console.log('PLAYBACK STATE RESTORED');
       return state;
    }
  } catch (error) {
    console.log('RESTORE STATE ERROR:', error);
  }
  return null;
};
