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
import { storage }
from '../store/mmkv';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Music, Folder, Disc, Mic2, Calendar, UserCircle, ListMusic, ListOrdered, Heart, Clock, History } from 'lucide-react-native';
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { playQueue } from '../player/queueManager';
import { toggleRepeatMode, REPEAT_OFF } from '../player/repeatManager';
import { startSleepTimer, cancelSleepTimer } from '../player/timerManager';
import { setPlaybackSpeed as setSpeedManager, skipForward as skipForwardManager, skipBackward as skipBackwardManager } from '../player/playbackManager';
import { savePlaybackState } from '../player/persistenceManager';
import { queueState } from '../player/queueState';
const { MediaScanner } = NativeModules;


export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const {
  saveQueue,
} = useQueueHistory();
const {
  increasePlayCount,
  getMostPlayedSongs,
} = useMostPlayed();
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [songs, setSongs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [permissionStatus, setPermissionStatus] = useState('undetermined');
 const [currentSong, setCurrentSong] = useState(null);
  const [favorites, setFavorites] =
  useState([]);

const hasLoadedFavorites =
  useRef(false);

useEffect(() => {

  if (!hasLoadedFavorites.current) {
    return;
  }

  try {
setTimeout(() => {
    storage.set(
      'favorites',
      JSON.stringify(favorites)
    );
}, 200);


  } catch (error) {



  }

}, [favorites]);
  const [recentSongs, setRecentSongs] =
  useState([]);

  const hasLoadedRecentSongs =
  useRef(false);
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
useTrackPlayerEvents(
  [Event.PlaybackActiveTrackChanged],
  async event => {

    try {

      const activeTrack =
        await TrackPlayer.getActiveTrack();

      if (!activeTrack) {
        return;
      }

      setCurrentSong(activeTrack);

      increasePlayCount(
        activeTrack
      );



      setRecentSongs(prev => {

        const filtered =
          prev.filter(
            item =>
              item.id !== activeTrack.id
          );

      return [
  activeTrack,
  ...filtered,
].slice(0, 30);

      });

    } catch (error) {


    }

  }
);


useTrackPlayerEvents(
  [Event.PlaybackState],
  async () => {

    const playbackState =
      await TrackPlayer.getPlaybackState();

    setIsPlaying(
      playbackState.state === 'playing'
    );

    if (currentSong) {
      await savePlaybackState(currentSong, queueState.isShuffleEnabled, queueState.currentQueueId);
    }
  }
);


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

const rawSongs = await MediaScanner.getSongs();  

const processedSongs = [];

for (let i = 0; i < rawSongs.length; i++) {
  const song = rawSongs[i];

const fullPath =
  song.path || song.url || '';

const folderName =
  fullPath.split('/').slice(-2, -1)[0] || 'Unknown';

  processedSongs.push({
    ...song,
    folderName,
  });
}
setSongs(processedSongs);
      const uniqueAlbums = new Set(processedSongs.map(s => s.album)).size;
      const uniqueArtists = new Set(processedSongs.map(s => s.artist)).size;
      const uniqueFolders = new Set(processedSongs.map(s => s.folderName)).size;
      const uniqueYears = new Set(processedSongs.map(s => s.year).filter(y => y > 0)).size;
      const uniqueComposers = new Set(processedSongs.map(s => s.composer).filter(c => c && c !== 'Unknown Composer')).size;

      const folderMap = {};

processedSongs.forEach(song => {

 const fullPath =
  song.path || song.url || '';

const folderName =
  fullPath.split('/').slice(-2, -1)[0] || 'Unknown';

  if (!folderMap[folderName]) {
    folderMap[folderName] = [];
  }

  folderMap[folderName].push(song);
});

const dynamicFolders = Object.keys(folderMap).map(name => ({
  id: name,
  title: name,
  icon: Folder,
  count: folderMap[name].length,
}));

setFolders([
  {
    id: 'all',
    title: 'All Songs',
    icon: Music,
    count: processedSongs.length,
  },

  ...dynamicFolders,
]);

      setIsPlayerReady(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error loading media:', error);
      setPermissionStatus('error');
    }
  };

useEffect(() => {

  const initializeApp = async () => {

    try {

      const savedFavorites =
        storage.getString('favorites');
if (savedFavorites) {

  const parsedFavorites =
    JSON.parse(savedFavorites);

  setFavorites(parsedFavorites);



}

const savedRecentSongs =
  storage.getString('recentSongs');

if (savedRecentSongs) {

  const parsedRecent =
    JSON.parse(savedRecentSongs);

  setRecentSongs(parsedRecent);



}

      

      await loadMedia();
      hasLoadedFavorites.current = true;

      hasLoadedRecentSongs.current = true;

    } catch (error) {



    }

  };

  initializeApp();

},
[]);

useEffect(() => {

  if (!hasLoadedRecentSongs.current) {
    return;
  }
setTimeout(() => {
  storage.set(
    'recentSongs',
    JSON.stringify(recentSongs)
  );
}, 200);

}, [recentSongs]);
const playSong = useCallback(async (song) => {
  try {

    const queueSongs =
      songs.filter(item => {
        const fullPath =
          item.path || item.url || '';
        const folderName =
          fullPath
            .split('/')
            .slice(-2, -1)[0]
            || 'Unknown';
        return (
          folderName === song.folderName
        );
      });

    const startIndex = queueSongs.findIndex(s => s.id === song.id);

    await playQueue(
      queueSongs,
      startIndex >= 0 ? startIndex : 0,
      song.folderName
    );

    setCurrentSong(song);
    setIsPlaying(true);

    saveQueue(
      song.folderName,
      queueSongs
    );  

  } catch (error) {
  }
}, [songs, saveQueue]);

 const togglePlayback = useCallback(async () => {
  try {

    if (isPlaying) {
      await TrackPlayer.pause();
      setIsPlaying(false);

    } else {
      await TrackPlayer.play();
      setIsPlaying(true);
    }

  } catch (error) {
  }
}, [isPlaying]);

const skipToNext = useCallback(async () => {
  try {

    await TrackPlayer.skipToNext();

    const currentTrack = await TrackPlayer.getActiveTrack();

    setCurrentSong(currentTrack);

  } catch (error) {
  }
}, []);

const skipToPrevious = useCallback(async () => {
  try {

    await TrackPlayer.skipToPrevious();

    const currentTrack = await TrackPlayer.getActiveTrack();

    setCurrentSong(currentTrack);

  } catch (error) {
  }
}, []);

const toggleFavorite = useCallback((song) => {

  setFavorites(prev => {

    const exists = prev.find(
      item => item.id === song.id
    );

    let updatedFavorites;

    if (exists) {

      updatedFavorites =
        prev.filter(
          item => item.id !== song.id
        );

    } else {

      updatedFavorites = [
        ...prev,
        song,
      ];

    }



    return updatedFavorites;

  });

}, []);
const getSongs = useCallback(
  (offset = 0, limit = 50) => {
    return songs.slice(offset, offset + limit);
  },
  [songs]
);

const getFilteredSongs = useCallback(
  (folderId, offset = 0, limit = 50) => {
    let filtered = songs;
if (folderId === 'mostplayed') {

  filtered = getMostPlayedSongs();

}
    else if (folderId === 'recent') {

  filtered = recentSongs;

}
else if (folderId === 'favorites') {

  filtered = favorites;

}
else if (folderId === 'all') {

  filtered = songs;

} else {

  filtered = songs.filter(song => {

  const fullPath =
  song.path || song.url || '';

const folderName =
  fullPath.split('/').slice(-2, -1)[0] || 'Unknown';

    return folderName === folderId;
  });
}

    return filtered.slice(offset, offset + limit);
  },
[
  songs,
  favorites,
  recentSongs,
  getMostPlayedSongs,
]
);
const contextValue = useMemo(() => ({
 songs,
  favorites,
  recentSongs,
  toggleFavorite,
  isLoading,
  getSongs,
  getFilteredSongs,
  isPlayerReady,
  currentSong,
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
  songs,
  favorites,
  recentSongs,
  isLoading,
  isPlayerReady,
  currentSong,
  isPlaying,
  isFullPlayerOpen,
  folders,
  permissionStatus,
  repeatMode,
  playbackSpeed,
  sleepTimerActive,
]);

  return (
    <AudioContext.Provider
  value={contextValue}
>
      {children}
    </AudioContext.Provider>
  );
};

