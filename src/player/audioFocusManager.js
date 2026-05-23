import TrackPlayer from 'react-native-track-player';

// TrackPlayer automatically handles ducking via its updateOptions when initialized.
// If RemoteDuck event is fired, we handle it here if we want custom behaviors.

export const handleRemoteDuck = async (event) => {
  try {
    if (event.paused || event.permanent) {
      await TrackPlayer.pause();
    } else {
      const state = await TrackPlayer.getPlaybackState();
      if (state.state !== 'playing' && !event.paused && !event.permanent) {
        await TrackPlayer.play();
      }
    }
  } catch (error) {
  }
};
