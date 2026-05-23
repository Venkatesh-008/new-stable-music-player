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
      if (callback) callback();
    } catch (error) {
    }
  }, ms);
  
};

export const cancelSleepTimer = () => {
  if (sleepTimerTimeout) {
    clearTimeout(sleepTimerTimeout);
    sleepTimerTimeout = null;
    targetTime = null;
  }
};

export const getRemainingTime = () => {
  if (!targetTime) return 0;
  const remainingMs = targetTime - Date.now();
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000 / 60) : 0;
};
