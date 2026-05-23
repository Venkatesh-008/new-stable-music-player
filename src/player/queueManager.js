import TrackPlayer from 'react-native-track-player';

import {
  queueState,
} from './queueState';

export const playQueue = async (
  songs,
  startIndex,
  queueId
) => {

  try {

    // SAVE ORIGINAL QUEUE
    queueState.originalQueue.length = 0;

    queueState.originalQueue.push(
      ...songs
    );

    // If shuffle is enabled, we should shuffle the queue before playing
    // For now, we'll assume playQueue plays the exact array given and we set activeQueue
    queueState.activeQueue.length = 0;

    let tracksToPlay = [...songs];

    if (queueState.isShuffleEnabled) {
      // If shuffle is already ON when user clicks a folder, play the clicked song first, then shuffle the rest
      const clickedSong = tracksToPlay[startIndex];
      const rest = tracksToPlay.filter((_, idx) => idx !== startIndex);
      
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      tracksToPlay = [clickedSong, ...rest];
      startIndex = 0; // Since clicked song is now at index 0
    }

    queueState.activeQueue.push(
      ...tracksToPlay
    );

    const queue =
      await TrackPlayer.getQueue();

    // CREATE NEW QUEUE
    if (

      queueState.currentQueueId !==
        queueId ||

      queue.length !== tracksToPlay.length

    ) {

      await TrackPlayer.reset();

      await TrackPlayer.add(

        tracksToPlay.map(song => ({

          id:
            song.id.toString(),

          url:
            song.url || song.path,

          title:
            song.title,

          artist:
            song.artist,

          artwork:
            song.artwork,

        }))

      );

      queueState.currentQueueId =
        queueId;

      console.log(
        'NEW QUEUE CREATED'
      );

    }

    // PLAY SONG
    await TrackPlayer.skip(
      startIndex
    );

    await TrackPlayer.play();

  } catch (error) {

    console.log(
      'QUEUE ERROR:',
      error
    );

  }

};

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

    // Update activeQueue state
    queueState.activeQueue.length = 0;
    queueState.activeQueue.push(...newQueue);

    const oldQueue = await TrackPlayer.getQueue();
    
    // Find active track index in old queue (should be activeTrackIndex)
    // Find active track index in new queue
    const newActiveIndex = newQueue.findIndex(t => t.id.toString() === activeTrack.id.toString());
    
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

    console.log(`SHUFFLE ${isShuffleEnabled ? 'ON' : 'OFF'} - QUEUE RECONSTRUCTED SEAMLESSLY`);

  } catch (error) {
    console.log('TOGGLE SHUFFLE ERROR:', error);
  }
};