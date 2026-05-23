import TrackPlayer from 'react-native-track-player';

let sleepTimerTimeout = null;
let targetTime = null;

export const startSleepTimer = (minutes, callback) => {
  cancelSleepTimer(); // Clear existing
  if (minutes <= 0) return;

  const ms = minutes * 60 * 1000;
  targetTime = Date.now() + ms;

  sleepTimerTimeout = setTimeout(async () => {
    try {
      await TrackPlayer.pause();
      console.log('SLEEP TIMER FINISHED. Playback paused.');
      if (callback) callback();
    } catch (error) {
      console.log('SLEEP TIMER ERROR:', error);
    }
  }, ms);
  
  console.log(`SLEEP TIMER STARTED FOR ${minutes} MINUTES`);
};

export const cancelSleepTimer = () => {
  if (sleepTimerTimeout) {
    clearTimeout(sleepTimerTimeout);
    sleepTimerTimeout = null;
    targetTime = null;
    console.log('SLEEP TIMER CANCELLED');
  }
};

export const getRemainingTime = () => {
  if (!targetTime) return 0;
  const remainingMs = targetTime - Date.now();
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000 / 60) : 0;
};
