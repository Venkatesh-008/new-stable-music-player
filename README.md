import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { storage }
from '../store/mmkv';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  BackHandler,

} from 'react-native';
import {
  useQueueHistory,
} from '../context/QueueHistoryContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, 
  ChevronDown, MoreVertical, Heart, Timer, SlidersHorizontal, Music
} from 'lucide-react-native';
import { AudioContext } from '../context/AudioContext';
import FastImage
from 'react-native-fast-image';

import TrackPlayer
from 'react-native-track-player';
import { toggleShuffle } from '../player/shuffleManager';
import ProgressSection from '../components/ProgressSection';
import usePlaybackProgress
from '../hooks/usePlaybackProgress';

const { width } = Dimensions.get('window');


export default function FullPlayerScreen() {
const {
  currentSong,
  isPlaying,
  repeatMode,
  playbackSpeed,
  sleepTimerActive,
  togglePlayback,
  setIsFullPlayerOpen,
  skipToNext,
  skipToPrevious,
  handleToggleRepeat,
  handleSetSpeed,
  handleStartTimer,
  handleCancelTimer,
} = useContext(AudioContext);
  
const favorites = [];

const toggleFavorite = () => {};


const {
  queues,
  saveQueue,
} = useQueueHistory();

  const { position, duration } = usePlaybackProgress();
  const [
  isShuffled,
  setIsShuffled
] = useState(false);
useEffect(() => {

  const savedShuffle =
    storage.getString(
      'isShuffled'
    );

  if (savedShuffle === 'true') {

    setIsShuffled(true);

  }

}, []);


const [
  originalSongs,
  setOriginalSongs
] = useState([]);

const [
  currentQueueTitle,
  setCurrentQueueTitle
] = useState('');

const handleToggleShuffle = async () => {
  const newState = !isShuffled;
  setIsShuffled(newState);
  storage.set('isShuffled', String(newState));
  await toggleShuffle(newState);
};


  const isFavorite =
  favorites.some(
    item =>
      item.id === currentSong?.id
  );

  
  useEffect(() => {

  const backAction = () => {

    setIsFullPlayerOpen(false);

    return true;
  };

  const backHandler =
    BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

  return () =>
    backHandler.remove();

}, []);
if (!currentSong) {

  return null;

}

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Overlay */}
      {currentSong?.artwork && (
        <View style={StyleSheet.absoluteFillObject}>
          <FastImage
            source={{ uri: currentSong.artwork }}
            style={StyleSheet.absoluteFillObject}
            blurRadius={90}
          />
          {/* Faux Gradient Effect with overlapping views */}
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%', backgroundColor: 'rgba(0,0,0,0.6)' }} />
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', backgroundColor: 'rgba(0,0,0,0.85)' }} />
        </View>
      )}

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsFullPlayerOpen(false)} style={styles.glassButtonSmall}>
          <ChevronDown color="#fff" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NOW PLAYING</Text>
        <TouchableOpacity style={styles.glassButtonSmall}>
          <MoreVertical color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Album Artwork */}
      <View style={styles.artworkContainer}>
        {currentSong?.artwork ? (
          <FastImage
            source={{
              uri: currentSong.artwork,
              priority: FastImage.priority.high,
            }}
            style={styles.artworkImage}
          />
        ) : (
          <View style={styles.artworkPlaceholder}>
            <Music color="#444" size={80} />
          </View>
        )}
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
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
          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => toggleFavorite(currentSong)}
          >
            <Heart color={isFavorite ? '#7C3AED' : 'rgba(255,255,255,0.7)'} size={24} fill={isFavorite ? '#7C3AED' : 'transparent'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureButton} onPress={() => sleepTimerActive ? handleCancelTimer() : handleStartTimer(30)}>
            <Timer color={sleepTimerActive ? "#1DB954" : "rgba(255,255,255,0.7)"} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureButton} onPress={handleToggleRepeat}>
            <Repeat color={repeatMode !== 'off' ? "#1DB954" : "rgba(255,255,255,0.7)"} size={24} />
            {repeatMode === 'one' && <Text style={styles.featureSubText}>1</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureButton} onPress={handleToggleShuffle}>
            <Shuffle color={isShuffled ? '#1DB954' : 'rgba(255,255,255,0.7)'} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureButton} onPress={() => {
            let nextSpeed = 1.0;
            if (playbackSpeed === 1.0) nextSpeed = 1.25;
            else if (playbackSpeed === 1.25) nextSpeed = 1.5;
            else if (playbackSpeed === 1.5) nextSpeed = 0.75;
            else nextSpeed = 1.0;
            handleSetSpeed(nextSpeed);
          }}>
            <SlidersHorizontal color={playbackSpeed !== 1.0 ? "#1DB954" : "rgba(255,255,255,0.7)"} size={24} />
            {playbackSpeed !== 1.0 && <Text style={[styles.featureSubText, { bottom: -6 }]}>{playbackSpeed}x</Text>}
          </TouchableOpacity>
        </View>

        <ProgressSection />
        
        {/* Playback Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.mediumControl}
            onPress={skipToPrevious}
            activeOpacity={0.6}
          >
            <SkipBack color="#fff" size={36} fill="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={togglePlayback}
            activeOpacity={0.8}
          >
            {isPlaying ? (
              <Pause color="#000" size={38} fill="#000" />
            ) : (
              <Play color="#000" size={38} fill="#000" style={{ marginLeft: 6 }} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.mediumControl} 
            onPress={skipToNext}
            activeOpacity={0.6}
          >
            <SkipForward color="#fff" size={36} fill="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: height > 800 ? 16 : 8,
    paddingBottom: height > 800 ? 20 : 10,
  },
  glassButtonSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  artworkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.8,
    shadowRadius: 32,
    elevation: 20,
  },
  artworkImage: {
    width: width - 64,
    height: width - 64,
    maxWidth: 400,
    maxHeight: 400,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  artworkPlaceholder: {
    width: width - 64,
    height: width - 64,
    maxWidth: 400,
    maxHeight: 400,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    paddingBottom: height > 800 ? 32 : 16,
  },
  infoContainer: {
    paddingHorizontal: 32,
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  artist: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  featureButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureSubText: {
    color: '#1DB954',
    position: 'absolute',
    fontSize: 10,
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 32,
  },
  mediumControl: {
    padding: 12,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
});