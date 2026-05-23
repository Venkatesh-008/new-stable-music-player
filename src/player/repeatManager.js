import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import { storage } from '../store/mmkv';

export const REPEAT_OFF = 'off';
export const REPEAT_ALL = 'all';
export const REPEAT_ONE = 'one';

export const initRepeatMode = async () => {
  try {
    const savedMode = storage.getString('repeatMode') || REPEAT_OFF;
    await applyRepeatMode(savedMode);
    return savedMode;
  } catch (error) {
    return REPEAT_OFF;
  }
};

export const toggleRepeatMode = async (currentMode) => {
  let nextMode = REPEAT_OFF;
  if (currentMode === REPEAT_OFF) nextMode = REPEAT_ALL;
  else if (currentMode === REPEAT_ALL) nextMode = REPEAT_ONE;
  else if (currentMode === REPEAT_ONE) nextMode = REPEAT_OFF;

  await applyRepeatMode(nextMode);
  storage.set('repeatMode', nextMode);
  return nextMode;
};

const applyRepeatMode = async (mode) => {
  try {
    let rntpMode = RepeatMode.Off;
    if (mode === REPEAT_ALL) rntpMode = RepeatMode.Queue;
    if (mode === REPEAT_ONE) rntpMode = RepeatMode.Track;
    await TrackPlayer.setRepeatMode(rntpMode);
  } catch (error) {
  }
};
