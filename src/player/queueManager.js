import TrackPlayer from 'react-native-track-player';

import { usePlayerStore } from '../store/playerStore';
import { createShuffledQueue } from './shuffleManager';

export const playQueue = async (
  songs,
  startIndex,
  queueId
) => {

  try {

if (!songs?.length) {
  return;
}

if (
  startIndex < 0 ||
  startIndex >= songs.length
) {
  startIndex = 0;
}

    // SAVE ORIGINAL QUEUE
    const store = usePlayerStore.getState();
    const originalTracks = [...songs];

    // If shuffle is enabled, we should shuffle the queue before playing
    let activeTracks = [...originalTracks];
    let newStartIndex = startIndex;

    if (store.isShuffleEnabled) {
      const activeTrackId = originalTracks[startIndex].id;
      activeTracks = createShuffledQueue(originalTracks, activeTrackId);
      newStartIndex = 0; // The active track is now at index 0
    }

    store.setQueueState({ 
      originalQueue: originalTracks, 
      activeQueue: activeTracks,
      currentIndex: newStartIndex,
      currentQueueId: queueId 
    });

    const queue =
      await TrackPlayer.getQueue();

    // CREATE NEW QUEUE
    if (
      store.currentQueueId !==
        queueId ||
      queue.length !== activeTracks.length
    ) {
      await TrackPlayer.pause();

      await TrackPlayer.reset();

const formattedTracks =
activeTracks.map(song => ({
  id: song.id.toString(),
  url: song.url || song.path,
  title: song.title,
  artist: song.artist,
  artwork: song.artwork,
}));

await TrackPlayer.add(
  formattedTracks
);

       
      

    }

    // PLAY SONG
if (newStartIndex >= 0) {

  await TrackPlayer.skip(
    newStartIndex
  );

}
    await TrackPlayer.play();

  } catch (error) {


  }

};

export const toggleShuffle = async (isShuffleEnabled) => {
  try {
    const store = usePlayerStore.getState();
    store.setQueueState({ isShuffleEnabled });
    const activeTrackIndex = await TrackPlayer.getActiveTrackIndex();
    const activeTrack = await TrackPlayer.getActiveTrack();
    
    if (!activeTrack || activeTrackIndex === undefined) return;

    const originalTracks = [...store.originalQueue];
    let newQueue = [];
    let newActiveIndex = 0;

    if (isShuffleEnabled) {
      // Shuffle ON: Keep current track first, shuffle the rest
      newQueue = createShuffledQueue(originalTracks, activeTrack.id);
      newActiveIndex = 0; // Since active track is guaranteed at index 0
    } else {
      // Shuffle OFF: Restore original order
      newQueue = [...originalTracks];
      newActiveIndex = newQueue.findIndex(t => t.id.toString() === activeTrack.id.toString());
      if (newActiveIndex === -1) newActiveIndex = 0;
    }

    // Update activeQueue state
    store.setQueueState({ 
      activeQueue: newQueue,
      currentIndex: newActiveIndex 
    });

    const oldQueue = await TrackPlayer.getQueue();
    
    if (newActiveIndex === -1) return;

    // TrackPlayer queue reconstruction without reset() or skip()
    const tracksBefore = newQueue.slice(0, newActiveIndex);
    const tracksAfter = newQueue.slice(newActiveIndex + 1);

    // 1. Remove all tracks EXCEPT the currently active one
    const indicesToRemove = oldQueue.map((_, i) => i).filter(i => i !== activeTrackIndex);
    if (indicesToRemove.length > 0) {
      await TrackPlayer.remove(indicesToRemove);
    }

    // 2. Add tracks that should come BEFORE the active track
    if (tracksBefore.length > 0) {
      await TrackPlayer.add(
        tracksBefore.map(song => ({
          id: song.id.toString(),
          url: song.url || song.path,
          title: song.title,
          artist: song.artist,
          artwork: song.artwork,
        })),
        0 // Insert before index 0
      );
    }

    // 3. Add tracks that should come AFTER the active track
    if (tracksAfter.length > 0) {
      // The active track has shifted by tracksBefore.length
      await TrackPlayer.add(
        tracksAfter.map(song => ({
          id: song.id.toString(),
          url: song.url || song.path,
          title: song.title,
          artist: song.artist,
          artwork: song.artwork,
        }))
        // No index specified, appends to the end
      );
    }


  } catch (error) {
  }
};

export const addNext = async (song) => {
  try {
    const activeTrackIndex = await TrackPlayer.getActiveTrackIndex();
    if (activeTrackIndex === undefined) return;

    const store = usePlayerStore.getState();
    const newActive = [...store.activeQueue];
    const newOriginal = [...store.originalQueue];
    
    newActive.splice(activeTrackIndex + 1, 0, song);
    newOriginal.splice(activeTrackIndex + 1, 0, song);
    
    store.setQueueState({ activeQueue: newActive, originalQueue: newOriginal });

    await TrackPlayer.add({
      id: song.id.toString(),
      url: song.url || song.path,
      title: song.title,
      artist: song.artist,
      artwork: song.artwork,
    }, activeTrackIndex + 1);
    
  } catch (error) {
  }
};

export const addLast = async (song) => {
  try {
    const store = usePlayerStore.getState();
    store.setQueueState({ 
      activeQueue: [...store.activeQueue, song],
      originalQueue: [...store.originalQueue, song]
    });

    await TrackPlayer.add({
      id: song.id.toString(),
      url: song.url || song.path,
      title: song.title,
      artist: song.artist,
      artwork: song.artwork,
    });
    
  } catch (error) {
  }
};