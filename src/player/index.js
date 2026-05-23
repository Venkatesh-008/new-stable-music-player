import TrackPlayer, {
  Capability,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';
import { restorePlaybackState } from './persistenceManager';
import { initRepeatMode } from './repeatManager';
import { initPlaybackSpeed } from './playbackManager';

let isPlayerInitialized = false;

export async function setupPlayer() {
  if (isPlayerInitialized) return true;

  try {
    await TrackPlayer.setupPlayer();

    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },

      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],

      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],

      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
        Capability.Stop,
      ],
    });

    isPlayerInitialized = true;

    // Restore state, repeat mode, and playback speed
    await restorePlaybackState();
    await initRepeatMode();
    await initPlaybackSpeed();

    console.log('TrackPlayer initialized');
    return true;

  } catch (error) {
    console.log('TrackPlayer setup error:', error);
    return false;
  }
}