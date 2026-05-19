import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  NativeModules,
  PermissionsAndroid,
  Platform, 
} from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Music, Folder, Disc, Mic2, Calendar, UserCircle, ListMusic, ListOrdered, PlayCircle, Heart, Clock, History } from 'lucide-react-native';
import TrackPlayer from 'react-native-track-player';
const { MediaScanner } = NativeModules;

console.log('MEDIA SCANNER:', MediaScanner);

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [songs, setSongs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [permissionStatus, setPermissionStatus] = useState('undetermined');
 const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
 const [isLoading, setIsLoading] = useState(true);


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

 const folderName = song.album || 'Unknown';

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

      setFolders([
        { id: 'all', title: 'All Songs', icon: Music, count: processedSongs.length },
        { id: 'folders', title: 'Folders', icon: Folder, count: uniqueFolders },
        { id: 'albums', title: 'Albums', icon: Disc, count: uniqueAlbums },
        { id: 'artists', title: 'Artists', icon: Mic2, count: uniqueArtists },
        { id: 'years', title: 'Years', icon: Calendar, count: uniqueYears },
        { id: 'composers', title: 'Composers', icon: UserCircle, count: uniqueComposers },
        { id: 'playlists', title: 'Playlists', icon: ListMusic, count: 0 },
        { id: 'queue', title: 'Queue', icon: ListOrdered, count: 0 },
        { id: 'most_played', title: 'Most Played', icon: PlayCircle, count: 0 },
        { id: 'favorites', title: 'Favorites', icon: Heart, count: 0 },
        { id: 'recently_added', title: 'Recently Added', icon: Clock, count: Math.min(processedSongs.length, 50) },
        { id: 'recently_played', title: 'Recently Played', icon: History, count: 0 },
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

  const initializePlayer = async () => {
    try {

      await TrackPlayer.setupPlayer();

      console.log('TRACK PLAYER READY');

      loadMedia();

    } catch (error) {
      console.log('TRACK PLAYER ERROR:', error);
    }
  };

  initializePlayer();

}, []);

const playSong = async (song) => {
  try {
    console.log('PLAY SONG:', song.title);

    await TrackPlayer.reset();

    await TrackPlayer.add({
      id: song.id.toString(),
     url: song.url,
      title: song.title,
      artist: song.artist,
    });

    await TrackPlayer.play();

    setCurrentSong(song);
    setIsPlaying(true);

  } catch (error) {
    console.log('PLAY ERROR:', error);
  }
};

  const togglePlayback = async () => {
  try {

    if (isPlaying) {
      await TrackPlayer.pause();
      setIsPlaying(false);

    } else {
      await TrackPlayer.play();
      setIsPlaying(true);
    }

  } catch (error) {
    console.log('TOGGLE ERROR:', error);
  }
};

  const skipToNext = async () => {
  try {

    if (songs.length === 0) return;

    const currentIndex = songs.findIndex(
      song => song.id === currentSong?.id
    );

    const nextIndex =
      currentIndex < songs.length - 1
        ? currentIndex + 1
        : 0;

    const nextSong = songs[nextIndex];

    await playSong(nextSong);

  } catch (error) {
    console.log('NEXT ERROR:', error);
  }
};
const skipToPrevious = async () => {
  try {

    if (!currentSong) return;

    const currentIndex = songs.findIndex(
      song => song.id === currentSong.id
    );

    console.log('CURRENT INDEX:', currentIndex);

    let previousIndex = currentIndex - 1;

    if (previousIndex < 0) {
      previousIndex = songs.length - 1;
    }

    const previousSong = songs[previousIndex];

    console.log('PREVIOUS SONG:', previousSong.title);

    await playSong(previousSong);

  } catch (error) {
    console.log('PREVIOUS ERROR:', error);
  }
};
const getSongs = useCallback(
  (offset = 0, limit = 50) => {
    return songs.slice(offset, offset + limit);
  },
  [songs]
);

const getFilteredSongs = useCallback(
  (folderId, offset = 0, limit = 50) => {
    let filtered = songs;

    switch (folderId) {
      case 'albums':
        filtered = songs.filter(song => song.album);
        break;

      case 'artists':
        filtered = songs.filter(song => song.artist);
        break;

      case 'folders':
        filtered = songs.filter(song => song.folderName);
        break;

      case 'recently_added':
        filtered = [...songs]
          .filter(song => song.dateAdded)
          .reverse();
        break;

      default:
        filtered = songs;
        break;
    }

    return filtered.slice(offset, offset + limit);
  },
  [songs]
);


  return (
    <AudioContext.Provider
      value={{
        songs,
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
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

