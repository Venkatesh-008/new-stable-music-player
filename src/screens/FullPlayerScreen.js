import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, 
  ChevronDown, MoreVertical, LayoutGrid, Music, Infinity, SlidersHorizontal, Heart 
} from 'lucide-react-native';
import { AudioContext } from '../context/AudioContext';
import FastImage from 'react-native-fast-image';
import ProgressSection from '../components/ProgressSection';

const { width } = Dimensions.get('window');

export default function FullPlayerScreen() {
 const {
  currentSong,
  isPlaying,
  togglePlayback,
  setIsFullPlayerOpen,
  skipToNext,
  skipToPrevious
} = useContext(AudioContext);

  if (!currentSong) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsFullPlayerOpen(false)} style={styles.headerButton}>
          <ChevronDown color="#fff" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NOW PLAYING</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MoreVertical color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Album Artwork */}
      <View style={styles.artworkContainer}>
      <View style={styles.artworkPlaceholder}>
  {currentSong?.artwork ? (
    <FastImage
      source={{
        uri: currentSong.artwork,
        priority: FastImage.priority.high,
      }}
  style={styles.artworkImage}
    />
  ) : (
    <Music color="#1f1f1f" size={100} />
  )}
</View>

      </View>

      {/* Song Info */}
   <View style={styles.infoContainer}>
  <Text style={styles.title} numberOfLines={1}>
    {currentSong?.title || 'Unknown Song'}
  </Text>

  <Text style={styles.artist} numberOfLines={1}>
    {currentSong?.artist || 'Unknown Artist'}
  </Text>
</View>

      {/* Feature Icons Row */}
      <View style={styles.featureRow}>
        <TouchableOpacity style={styles.featureButton}>
          <LayoutGrid color="#666" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureButton}>
          <Music color="#fff" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureButton}>
          <Infinity color="#666" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureButton}>
          <SlidersHorizontal color="#666" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureButton}>
          <Heart color="#666" size={24} />
        </TouchableOpacity>
      </View>


<ProgressSection />

      {/* Playback Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.secondaryControl}>
          <Shuffle color="#fff" size={24} />
        </TouchableOpacity>
        
<TouchableOpacity
  style={styles.primaryControl}
  onPress={skipToPrevious}
>
  <SkipBack color="#fff" size={36} fill="#fff" />
</TouchableOpacity>
        
        <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
          {isPlaying ? (
            <Pause color="#8b5cf6" size={32} fill="#8b5cf6" />
          ) : (
            <Play color="#8b5cf6" size={32} fill="#8b5cf6" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.primaryControl} onPress={skipToNext}>
          <SkipForward color="#fff" size={36} fill="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryControl}>
          <Repeat color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Bottom decorative bar space (to match screenshot) */}
      <View style={styles.bottomBarContainer}>
        <View style={styles.bottomBar} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  artworkImage: {
  width: '100%',
  height: '100%',
  borderRadius: 30,
},
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  artworkContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  artworkPlaceholder: {
    width: width - 80,
    height: width - 80,
    borderRadius: 30,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  infoContainer: {
    paddingHorizontal: 30,
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  artist: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  featureButton: {
    padding: 10,
  },

  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  primaryControl: {
    padding: 10,
  },
  secondaryControl: {
    padding: 10,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#2a2a2a', // Just to make it stand out a bit if needed, but in screenshot it's empty background with large purple icon
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomBar: {
    height: 60,
    backgroundColor: '#7c3aed',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  }
});
