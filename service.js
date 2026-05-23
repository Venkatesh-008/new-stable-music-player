import TrackPlayer, { Event } from 'react-native-track-player';
import { handleRemoteDuck } from './src/player/audioFocusManager';

const playbackService = async () => {

  TrackPlayer.addEventListener(
    Event.RemotePlay,
    async () => {
      await TrackPlayer.play();
    }
  );

  TrackPlayer.addEventListener(
    Event.RemotePause,
    async () => {
      await TrackPlayer.pause();
    }
  );

  TrackPlayer.addEventListener(
    Event.RemoteNext,
    async () => {
      await TrackPlayer.skipToNext();
    }
  );

  TrackPlayer.addEventListener(
    Event.RemotePrevious,
    async () => {
      await TrackPlayer.skipToPrevious();
    }
  );

  TrackPlayer.addEventListener(
    Event.RemoteStop,
    async () => {
      await TrackPlayer.stop();
    }
  );

  TrackPlayer.addEventListener(
    Event.RemoteDuck,
    async (event) => {
      await handleRemoteDuck(event);
    }
  );

  TrackPlayer.addEventListener(
    Event.RemoteSeek,
    async (event) => {
      await TrackPlayer.seekTo(event.position);
    }
  );
};

export default playbackService;