import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AudioContext } from '../context/AudioContext';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react-native';
import FastImage from 'react-native-fast-image';

export default function MiniPlayer() {
  const { currentSong, isPlaying, togglePlayback, skipToNext, setIsFullPlayerOpen } = useContext(AudioContext);

  if (!currentSong) return null;

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9}
      onPress={() => setIsFullPlayerOpen(true)}
    >
      <View style={styles.content}>
      <FastImage
  source={{
    uri:
      currentSong.artwork ||
      'https://via.placeholder.com/150/111/fff?text=AMA',
    priority: FastImage.priority.low,
  }}
  style={styles.artwork}
/>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{currentSong.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentSong.artist}</Text>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button}>
            <SkipBack color="#fff" size={20} fill="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
            {isPlaying ? (
              <Pause color="#fff" size={20} fill="#fff" />
            ) : (
              <Play color="#fff" size={20} fill="#fff" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={skipToNext}>
            <SkipForward color="#fff" size={20} fill="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70, // Sit exactly above the 70px tall solid tab bar
    left: 8,
    right: 8,
    height: 60,
    backgroundColor: '#111111',
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 12,
  },
  artwork: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#000',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  artist: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 10,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  }
});
