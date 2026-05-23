export const createShuffledQueue = (originalQueue, activeTrackId) => {
  if (!originalQueue || originalQueue.length === 0) return [];

  // Clone array to never mutate originalQueue
  const tracksToShuffle = [...originalQueue];
  let activeTrack = null;

  if (activeTrackId) {
    const activeIndex = tracksToShuffle.findIndex(
      (t) => t.id.toString() === activeTrackId.toString()
    );

    if (activeIndex !== -1) {
      // Remove active track from the array to shuffle
      activeTrack = tracksToShuffle.splice(activeIndex, 1)[0];
    }
  }

  // Fisher-Yates Shuffle
  const random = Math.random;
  for (let i = tracksToShuffle.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [tracksToShuffle[i], tracksToShuffle[j]] = [
      tracksToShuffle[j],
      tracksToShuffle[i],
    ];
  }

  // If there's an active track, it must be the first track in the new active queue
  if (activeTrack) {
    return [activeTrack, ...tracksToShuffle];
  }

  return tracksToShuffle;
};
