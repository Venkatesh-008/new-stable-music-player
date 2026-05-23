import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from 'react-native';

import { SafeAreaView }
from 'react-native-safe-area-context';

import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  ChevronDown,
  MoreVertical,
  Heart,
  Timer,
  SlidersHorizontal,
  Music,
} from 'lucide-react-native';

import FastImage
from 'react-native-fast-image';

import { storage }
from '../store/mmkv';

import { AudioContext }
from '../context/AudioContext';

import { usePlayerStore } from '../store/playerStore';

import {
  toggleShuffle,
} from '../player/queueManager';

import ProgressSection
from '../components/ProgressSection';

const {
  width,
  height,
} = Dimensions.get('window');

function FullPlayerScreen() {

  const {
    currentSong,
    favorites,
    toggleFavorite,
    isPlaying,
    togglePlayback,
    setIsFullPlayerOpen,
    skipToNext,
    skipToPrevious,
    repeatMode,
    handleToggleRepeat,
    playbackSpeed,
    handleSetSpeed,
    sleepTimerActive,
    handleStartTimer,
    handleCancelTimer,
  } = useContext(AudioContext);

  const { isShuffleEnabled: isShuffled } = usePlayerStore();

  useEffect(() => {
    const savedShuffle = storage.getString('isShuffled');
    if (savedShuffle === 'true') {
      usePlayerStore.getState().setQueueState({ isShuffleEnabled: true });
    }
  }, []);

  const handleToggleShuffle = async () => {

    try {

      const newState = !isShuffled;
      storage.set('isShuffled', String(newState));

      await toggleShuffle(newState);

    } catch (error) {


    }
  };

  const isFavorite =
    favorites?.some(
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

      {/* Cinematic Background */}
      {currentSong?.artwork && (

        <View style={StyleSheet.absoluteFillObject}>

          <FastImage
            source={{
              uri: currentSong.artwork,
              priority: FastImage.priority.low,
              cache: FastImage.cacheControl.immutable,
            }}
            style={[StyleSheet.absoluteFillObject, { opacity: 0.6 }]}
            blurRadius={4}
          />

          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor:
                  'rgba(0,0,0,0.45)',
              },
            ]}
          />

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '70%',
              backgroundColor:
                'rgba(0,0,0,0.65)',
            }}
          />

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              backgroundColor:
                'rgba(0,0,0,0.9)',
            }}
          />

        </View>

      )}

      {/* Header */}
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.glassButtonSmall}
          onPress={() =>
            setIsFullPlayerOpen(false)
          }
          activeOpacity={0.7}
        >

          <ChevronDown
            color="#fff"
            size={26}
          />

        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          NOW PLAYING
        </Text>

        <TouchableOpacity
          style={styles.glassButtonSmall}
          activeOpacity={0.7}
        >

          <MoreVertical
            color="#fff"
            size={24}
          />

        </TouchableOpacity>

      </View>

      {/* Artwork */}
      <View style={styles.artworkContainer}>

        {currentSong?.artwork ? (

          <FastImage
            source={{
              uri: currentSong.artwork,
              priority:
                FastImage.priority.high,
                cache:
  FastImage.cacheControl.immutable,
            }}
            style={styles.artworkImage}
          />

        ) : (

          <View style={styles.artworkPlaceholder}>

            <Music
              color="#444"
              size={80}
            />

          </View>

        )}

      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>

        {/* Song Info */}
        <View style={styles.infoContainer}>

          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {currentSong?.title ||
              'Unknown Song'}
          </Text>

          <Text
            style={styles.artist}
            numberOfLines={1}
          >
            {currentSong?.artist ||
              'Unknown Artist'}
          </Text>

        </View>

        {/* Feature Row */}
        <View style={styles.featureRow}>

          {/* Favorite */}
          <TouchableOpacity
            style={styles.featureButton}
            onPress={() =>
              toggleFavorite(currentSong)
            }
            activeOpacity={0.7}
          >

            <Heart
              color={
                isFavorite
                  ? '#7C3AED'
                  : 'rgba(255,255,255,0.7)'
              }
              size={24}
              fill={
                isFavorite
                  ? '#7C3AED'
                  : 'transparent'
              }
            />

          </TouchableOpacity>

          {/* Timer */}
          <TouchableOpacity
            style={styles.featureButton}
            onPress={() =>

              sleepTimerActive
                ? handleCancelTimer()
                : handleStartTimer(30)

            }
            activeOpacity={0.7}
          >

            <Timer
              color={
                sleepTimerActive
                  ? '#1DB954'
                  : 'rgba(255,255,255,0.7)'
              }
              size={24}
            />

          </TouchableOpacity>

          {/* Repeat */}
          <TouchableOpacity
            style={styles.featureButton}
            onPress={handleToggleRepeat}
            activeOpacity={0.7}
          >

            <Repeat
              color={
                repeatMode !== 'off'
                  ? '#1DB954'
                  : 'rgba(255,255,255,0.7)'
              }
              size={24}
            />

          </TouchableOpacity>

          {/* Shuffle */}
          <TouchableOpacity
            style={styles.featureButton}
            onPress={handleToggleShuffle}
            activeOpacity={0.7}
          >

            <Shuffle
              color={
                isShuffled
                  ? '#1DB954'
                  : 'rgba(255,255,255,0.7)'
              }
              size={24}
            />

          </TouchableOpacity>

          {/* Speed */}
          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => {

              let nextSpeed = 1.0;

              if (playbackSpeed === 1.0)
                nextSpeed = 1.25;

              else if (
                playbackSpeed === 1.25
              )
                nextSpeed = 1.5;

              else if (
                playbackSpeed === 1.5
              )
                nextSpeed = 0.75;

              else
                nextSpeed = 1.0;

              handleSetSpeed(nextSpeed);

            }}
            activeOpacity={0.7}
          >

            <SlidersHorizontal
              color={
                playbackSpeed !== 1.0
                  ? '#1DB954'
                  : 'rgba(255,255,255,0.7)'
              }
              size={24}
            />

          </TouchableOpacity>

        </View>

        {/* Progress */}
        <ProgressSection />

        {/* Controls */}
        <View style={styles.controlsContainer}>

          <TouchableOpacity
            style={styles.mediumControl}
            onPress={skipToPrevious}
            activeOpacity={0.6}
          >

            <SkipBack
              color="#fff"
              size={36}
              fill="#fff"
            />

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayback}
            activeOpacity={0.8}
          >

            {isPlaying ? (

              <Pause
                color="#000"
                size={38}
                fill="#000"
              />

            ) : (

              <Play
                color="#000"
                size={38}
                fill="#000"
                style={{
                  marginLeft: 6,
                }}
              />

            )}

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediumControl}
            onPress={skipToNext}
            activeOpacity={0.6}
          >

            <SkipForward
              color="#fff"
              size={36}
              fill="#fff"
            />

          </TouchableOpacity>

        </View>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
featureSubText: {
  color: '#1DB954',
  position: 'absolute',
  fontSize: 10,
  fontWeight: 'bold',
},
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: height > 800 ? 16 : 8,
    paddingBottom:
      height > 800 ? 20 : 10,
  },

  glassButtonSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor:
      'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },

  artworkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  artworkImage: {
    width: width - 64,
    height: width - 64,
    maxWidth: 400,
    maxHeight: 400,
    borderRadius: 28,
    shadowColor: '#000',
shadowOffset: {
  width: 0,
  height: 12,
},
shadowOpacity: 0.45,
shadowRadius: 24,
elevation: 18,
  },

  artworkPlaceholder: {
    width: width - 64,
    height: width - 64,
    maxWidth: 400,
    maxHeight: 400,
    borderRadius: 32,
    backgroundColor:
      'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomSection: {
    paddingBottom:
      height > 800 ? 32 : 16,
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
    marginBottom: 18,
  },

  featureButton: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },

  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 24,
  },

  mediumControl: {
    padding: 12,
  },

  playButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

});
export default React.memo(FullPlayerScreen);