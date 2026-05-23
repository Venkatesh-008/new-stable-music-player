import { useProgress } from 'react-native-track-player';

export default function usePlaybackProgress() {

  const progress = useProgress(250);

  return {
    position: progress.position,
    duration: progress.duration,
    buffered: progress.buffered,
  };
}