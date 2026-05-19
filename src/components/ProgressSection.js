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

const SEEK_BAR_WIDTH = width - 80;

function ProgressSection() {
     const progress = useProgress(250);

  const seekToPosition = async (event) => {
    try {

      const touchX = event.nativeEvent.pageX - 30;

      let percentage = touchX / SEEK_BAR_WIDTH;

      if (percentage < 0) percentage = 0;
      if (percentage > 1) percentage = 1;

      const newPosition = percentage * progress.duration;

      await TrackPlayer.seekTo(newPosition);

    } catch (error) {
      console.log('SEEK ERROR:', error);
    }
  };

return (
  <View style={styles.progressContainer}>

    <TouchableOpacity
      activeOpacity={1}
      onPress={seekToPosition}
      style={styles.progressBarTrack}
    >

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

    </TouchableOpacity>

    <View style={styles.timeContainer}>

      <Text style={styles.timeText}>
        {Math.floor(progress.position / 60)}:
        {String(Math.floor(progress.position % 60)).padStart(2, '0')}
      </Text>

      <Text style={styles.timeText}>
        {Math.floor(progress.duration / 60)}:
        {String(Math.floor(progress.duration % 60)).padStart(2, '0')}
      </Text>

    </View>

  </View>
);
}

export default memo(ProgressSection);

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: 30,
    marginBottom: 40,
  },

  progressBarTrack: {
    height: 3,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 10,
    justifyContent: 'center',
  },

  progressBarFill: {
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },

  progressThumb: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },

  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  timeText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },
});