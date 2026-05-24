import TrackPlayer, { Event } from 'react-native-track-player';
import { handleRemoteDuck } from './src/player/audioFocusManager';

const playbackService = async () => {

  TrackPlayer.addEventListener(
    Event.RemotePlay,
    async () => {
      try {
        await TrackPlayer.play();
      } catch (e) {
        // Handle silently
      }
    }
  );

  TrackPlayer.addEventListener(
    Event.RemotePause,
    async () => {
      try {
        await TrackPlayer.pause();
      } catch (e) {}
    }
  );

  TrackPlayer.addEventListener(
    Event.RemoteNext,
    async () => {
      try {
        await TrackPlayer.skipToNext();
      } catch (e) {}
    }
  );

  TrackPlayer.addEventListener(
    Event.RemotePrevious,
    async () => {
      try {
        await TrackPlayer.skipToPrevious();
      } catch (e) {}
    }
  );

  TrackPlayer.addEventListener(
    Event.RemoteStop,
    async () => {
      try {
        await TrackPlayer.stop();
      } catch (e) {}
    }
  );

  TrackPlayer.addEventListener(
    Event.RemoteDuck,
    async (event) => {
      try {
        await handleRemoteDuck(event);
      } catch (e) {}
    }
  );

  TrackPlayer.addEventListener(
    Event.RemoteSeek,
    async (event) => {
      try {
        if (event && event.position !== undefined) {
          await TrackPlayer.seekTo(event.position);
        }
      } catch (e) {}
    }
  );
};

export default playbackService;