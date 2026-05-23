import TrackPlayer from 'react-native-track-player';
import { storage } from '../store/mmkv';

export const initPlaybackSpeed = async () => {
  try {
    const savedSpeed = storage.getNumber('playbackSpeed') || 1.0;
    await TrackPlayer.setRate(savedSpeed);
    return savedSpeed;
  } catch (error) {
    console.log('INIT SPEED ERROR:', error);
    return 1.0;
  }
};

export const setPlaybackSpeed = async (speed) => {
  try {
    await TrackPlayer.setRate(speed);
    storage.set('playbackSpeed', speed);
    console.log('PLAYBACK SPEED SET TO:', speed);
    return speed;
  } catch (error) {
    console.log('SET SPEED ERROR:', error);
  }
};

export const seekToPosition = async (position) => {
  try {
    await TrackPlayer.seekTo(position);
  } catch (error) {
    console.log('SEEK ERROR:', error);
  }
};

export const skipForward = async (amount = 10) => {
  try {
    const { position, duration } = await TrackPlayer.getProgress();
    if (position + amount < duration) {
      await TrackPlayer.seekTo(position + amount);
    } else {
      await TrackPlayer.skipToNext();
    }
  } catch (error) {
    console.log('SKIP FORWARD ERROR:', error);
  }
};

export const skipBackward = async (amount = 10) => {
  try {
    const { position } = await TrackPlayer.getProgress();
    if (position - amount > 0) {
      await TrackPlayer.seekTo(position - amount);
    } else {
      await TrackPlayer.seekTo(0);
    }
  } catch (error) {
    console.log('SKIP BACKWARD ERROR:', error);
  }
};
