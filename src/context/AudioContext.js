import React, {
  createContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  useQueueHistory,
} from './QueueHistoryContext';
import { useMostPlayed } from './MostPlayedContext';
import {
  NativeModules,
  PermissionsAndroid,
  Platform, 
} from 'react-native';
import { storage } from '../store/mmkv';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Music, Folder } from 'lucide-react-native';
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { playQueue } from '../player/queueManager';
import { toggleRepeatMode, REPEAT_OFF } from '../player/repeatManager';
import { startSleepTimer, cancelSleepTimer } from '../player/timerManager';
import { setPlaybackSpeed as setSpeedManager, skipForward as skipForwardManager, skipBackward as skipBackwardManager } from '../player/playbackManager';
import { savePlaybackState } from '../player/persistenceManager';
import { usePlayerStore } from '../store/playerStore';
const { MediaScanner } = NativeModules;

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const { saveQueue } = useQueueHistory();
  const { increasePlayCount } = useMostPlayed();
  
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [folders, setFolders] = useState([]);
  const [permissionStatus, setPermissionStatus] = useState('undetermined');
  const [currentSong, setCurrentSong] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [repeatMode, setRepeatModeState] = useState(storage.getString('repeatMode') || REPEAT_OFF);
  const [playbackSpeed, setPlaybackSpeedState] = useState(storage.getNumber('playbackSpeed') || 1.0);
  const [sleepTimerActive, setSleepTimerActive] = useState(false);

  const handleToggleRepeat = async () => {
    const nextMode = await toggleRepeatMode(repeatMode);
    setRepeatModeState(nextMode);
  };

  const handleSetSpeed = async (speed) => {
    await setSpeedManager(speed);
    setPlaybackSpeedState(speed);
  };

  const handleStartTimer = (minutes) => {
    startSleepTimer(minutes, () => {
      setSleepTimerActive(false);
      setIsPlaying(false);
    });
    setSleepTimerActive(true);
  };

  const handleCancelTimer = () => {
    cancelSleepTimer();
    setSleepTimerActive(false);
  };

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async event => {
    try {
      const activeTrack = await TrackPlayer.getActiveTrack();
      if (!activeTrack) return;
      
      setCurrentSong(activeTrack);
      increasePlayCount(activeTrack);
      
      await MediaScanner.addRecent(activeTrack.id);
      loadFavoritesAndRecent();
    } catch (error) {
      console.log('Error handling track change', error);
    }
  });

  useTrackPlayerEvents([Event.PlaybackState], async () => {
    const playbackState = await TrackPlayer.getPlaybackState();
    setIsPlaying(playbackState.state === 'playing');
    if (currentSong) {
      const store = usePlayerStore.getState();
      await savePlaybackState(currentSong, store.isShuffleEnabled, store.currentQueueId);
    }
  });

  const loadFavoritesAndRecent = async () => {
    try {
      const favs = await MediaScanner.getFilteredSongs('favorites', 0, 50);
      setFavorites(favs);
      const recents = await MediaScanner.getFilteredSongs('recent', 0, 30);
      setRecentSongs(recents);
    } catch (error) {
      console.log('Error loading favorites/recent', error);
    }
  };

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      let granted = false;
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const result = await request(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO);
          granted = result === RESULTS.GRANTED;
        } else {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
          granted = result === PermissionsAndroid.RESULTS.GRANTED;
        }
      }

      if (!granted) {
        setPermissionStatus('denied');
        setIsLoading(false);
        return;
      }
      setPermissionStatus('granted');

      // Native scanning process directly populates SQLite
      await MediaScanner.scanMedia();
      
      const nativeFolders = await MediaScanner.getFolders();
      
      let allSongsCount = 0;
      const dynamicFolders = nativeFolders.map(folder => {
        allSongsCount += folder.count;
        return {
          ...folder,
          icon: Folder,
        };
      });

      setFolders([
        {
          id: 'all',
          title: 'All Songs',
          icon: Music,
          count: allSongsCount,
        },
        ...dynamicFolders,
      ]);

      await loadFavoritesAndRecent();

      setIsPlayerReady(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setPermissionStatus('error');
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const playSong = useCallback(async (song) => {
    try {
      const queueSongs = await MediaScanner.getFilteredSongs(song.folderName, 0, 10000);
      const startIndex = queueSongs.findIndex(s => s.id === song.id);

      await playQueue(
        queueSongs,
        startIndex >= 0 ? startIndex : 0,
        song.folderName
      );

      setCurrentSong(song);
      setIsPlaying(true);

      saveQueue(song.folderName, queueSongs);  
    } catch (error) {
      console.log('Play song error', error);
    }
  }, [saveQueue]);

  const togglePlayback = useCallback(async () => {
    try {
      if (isPlaying) {
        await TrackPlayer.pause();
        setIsPlaying(false);
      } else {
        await TrackPlayer.play();
        setIsPlaying(true);
      }
    } catch (error) {}
  }, [isPlaying]);

  const skipToNext = useCallback(async () => {
    try {
      await TrackPlayer.skipToNext();
      const currentTrack = await TrackPlayer.getActiveTrack();
      setCurrentSong(currentTrack);
    } catch (error) {}
  }, []);

  const skipToPrevious = useCallback(async () => {
    try {
      await TrackPlayer.skipToPrevious();
      const currentTrack = await TrackPlayer.getActiveTrack();
      setCurrentSong(currentTrack);
    } catch (error) {}
  }, []);

  const toggleFavorite = useCallback(async (song) => {
    try {
      await MediaScanner.toggleFavorite(song.id);
      await loadFavoritesAndRecent();
    } catch (e) {}
  }, []);

  const getSongs = useCallback(async (offset = 0, limit = 50) => {
    return await MediaScanner.getSongs(offset, limit);
  }, []);

  const getFilteredSongs = useCallback(async (folderId, offset = 0, limit = 50) => {
    return await MediaScanner.getFilteredSongs(folderId, offset, limit);
  }, []);

  const contextValue = useMemo(() => ({
    favorites,
    recentSongs,
    toggleFavorite,
    isLoading,
    getSongs,
    getFilteredSongs,
    isPlayerReady,
    currentSong,
    setCurrentSong,
    isPlaying,
    playSong,
    togglePlayback,
    skipToNext,
    skipToPrevious,
    isFullPlayerOpen,
    setIsFullPlayerOpen,
    folders,
    permissionStatus,
    loadMedia,
    repeatMode,
    handleToggleRepeat,
    playbackSpeed,
    handleSetSpeed,
    sleepTimerActive,
    handleStartTimer,
    handleCancelTimer,
    skipForward: skipForwardManager,
    skipBackward: skipBackwardManager,
  }), [
    favorites,
    recentSongs,
    isLoading,
    isPlayerReady,
    currentSong,
    setCurrentSong,
    isPlaying,
    isFullPlayerOpen,
    folders,
    permissionStatus,
    repeatMode,
    playbackSpeed,
    sleepTimerActive,
  ]);

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};
