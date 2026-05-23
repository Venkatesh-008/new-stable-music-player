import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import TrackPlayer, { useProgress } from 'react-native-track-player';

const { width } = Dimensions.get('window');
const SEEK_BAR_WIDTH = width - 150;

function ProgressSection() {
  const progress = useProgress(500);

  const seekToPosition = React.useCallback(async (event) => {
    try {
      const touchX = event.nativeEvent.locationX;
      let percentage = touchX / SEEK_BAR_WIDTH;

      if (percentage < 0) percentage = 0;
      if (percentage > 1) percentage = 1;

      const newPosition = percentage * progress.duration;
      await TrackPlayer.seekTo(newPosition);
    } catch (error) {
    }
}, [progress.duration]);

  const formatTime = React.useCallback((seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = String(Math.floor(seconds % 60)).padStart(2, '0');
    return `${mins}:${secs}`;
}, []);

  return (
    <View style={styles.container}>
      <View style={styles.sliderRow}>
        <View style={styles.timePill}>
          <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.95}
          onPress={seekToPosition}
          style={styles.progressBarTrackContainer}
        >
          <View pointerEvents="none" style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${
                    progress.duration > 0
                      ? (progress.position / progress.duration) * 100
                      : 0
                  }%`,
                },
              ]}
            />
            <View
              style={[
                styles.progressThumb,
                {
                  left: `${
                    progress.duration > 0
                      ? (progress.position / progress.duration) * 100
                      : 0
                  }%`,
                },
              ]}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.timePill}>
          <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
        </View>
      </View>

      <View style={styles.qualityChip}>
        <Text style={styles.qualityText}>44.1 KHZ   320 KBPS   MP3</Text>
      </View>
    </View>
  );
}

export default memo(ProgressSection);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timePill: {
    backgroundColor: '#111',
    borderRadius: 12,
    width: 45,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  progressBarTrackContainer: {
    width: SEEK_BAR_WIDTH,
    height: 30,
    justifyContent: 'center',
  },
  progressBarTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3 ,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
    marginLeft: -8,
  },
  qualityChip: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  qualityText: {
    color: '#aaa',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});