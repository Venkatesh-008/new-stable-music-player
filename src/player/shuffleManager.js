import TrackPlayer from 'react-native-track-player';
import { queueState } from './queueState';

const formatTrack = (song) => ({
  id: song.id.toString(),
  url: song.url || song.path,
  title: song.title,
  artist: song.artist,
  artwork: song.artwork,
  duration: song.duration,
});

export const toggleShuffle = async (isShuffleEnabled) => {
  try {
    queueState.isShuffleEnabled = isShuffleEnabled;
    const activeTrackIndex = await TrackPlayer.getActiveTrackIndex();
    const activeTrack = await TrackPlayer.getActiveTrack();
    
    if (!activeTrack || activeTrackIndex === undefined) return;

    const originalTracks = [...queueState.originalQueue];
    let newQueue = [];

    if (isShuffleEnabled) {
      // Shuffle ON: Keep current track first, shuffle the rest
      const tracksToShuffle = originalTracks.filter(
        t => t.id.toString() !== activeTrack.id.toString()
      );
      
      for (let i = tracksToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tracksToShuffle[i], tracksToShuffle[j]] = [tracksToShuffle[j], tracksToShuffle[i]];
      }
      
      newQueue = [activeTrack, ...tracksToShuffle];
    } else {
      // Shuffle OFF: Restore original order
      newQueue = [...originalTracks];
    }

    // Update activeQueue state atomically
    queueState.activeQueue = newQueue;

    const oldQueue = await TrackPlayer.getQueue();
    const newActiveIndex = newQueue.findIndex(t => t.id.toString() === activeTrack.id.toString());
    
    if (newActiveIndex === -1) return;

    const tracksBefore = newQueue.slice(0, newActiveIndex);
    const tracksAfter = newQueue.slice(newActiveIndex + 1);

    // 1. Remove all tracks EXCEPT the currently active one
    const indicesToRemove = oldQueue.map((_, i) => i).filter(i => i !== activeTrackIndex);
    if (indicesToRemove.length > 0) {
      await TrackPlayer.remove(indicesToRemove);
    }

    // 2. Add tracks that should come BEFORE the active track
    if (tracksBefore.length > 0) {
      await TrackPlayer.add(tracksBefore.map(formatTrack), 0);
    }

    // 3. Add tracks that should come AFTER the active track
    if (tracksAfter.length > 0) {
      await TrackPlayer.add(tracksAfter.map(formatTrack));
    }

  } catch (error) {
    console.error();
  }
};
