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
import { toggleShuffle } from '../player/queueManager';
import ProgressSection from '../components/ProgressSection';
import usePlaybackProgress from '../hooks/usePlaybackProgress';

const { width } = Dimensions.get('window');

export default function FullPlayerScreen() {
  const {
    currentSong,
    favorites,
toggleFavorite,
    isPlaying,
    togglePlayback,
    setIsFullPlayerOpen,
    skipToNext,
    skipToPrevious
  } = useContext(AudioContext);

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
            blurRadius={80}
          />
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
        </View>
      )}

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
  onPress={() =>
    toggleFavorite(currentSong)
  }
>

  <Heart
    color={
      isFavorite
        ? '#7C3AED'
        : '#999'
    }
    size={22}
    fill={
      isFavorite
        ? '#7C3AED'
        : 'transparent'
    }
  />

</TouchableOpacity>
        <TouchableOpacity style={styles.featureButton}>
          <Timer color="#999" size={22} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureButton}>
          <Repeat color="#999" size={22} />
        </TouchableOpacity>
 <TouchableOpacity
  style={styles.featureButton}
  onPress={handleToggleShuffle}
>

<Shuffle
  color={
    isShuffled
      ? '#1DB954'
      : '#999'
  }
  size={22}
/>

</TouchableOpacity>
        <TouchableOpacity style={styles.featureButton}>
          <SlidersHorizontal color="#999" size={22} />
        </TouchableOpacity>
      </View>

      <ProgressSection />

<Text
  style={{
    color: '#ffffff',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  }}
>
  {Math.floor(position)} / {Math.floor(duration)}
</Text>
      {/* Playback Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.smallControl}>
          <Shuffle color="#999" size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.mediumControl}
          onPress={skipToPrevious}
        >
          <SkipBack color="#fff" size={32} fill="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
          {isPlaying ? (
            <Pause color="#fff" size={36} fill="#fff" />
          ) : (
            <Play color="#fff" size={36} fill="#fff" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mediumControl} onPress={skipToNext}>
          <SkipForward color="#fff" size={32} fill="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.smallControl}>
          <Repeat color="#999" size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  artworkContainer: {
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  artworkImage: {
    width: width - 50,
    height: width - 50,
    borderRadius: 30,
  },
  artworkPlaceholder: {
    width: width - 50,
    height: width - 50,
    borderRadius: 30,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    paddingHorizontal: 25,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  artist: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '500',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  featureButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 40,
    marginTop: 10,
  },
  smallControl: {
    padding: 10,
  },
  mediumControl: {
    padding: 10,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
});
