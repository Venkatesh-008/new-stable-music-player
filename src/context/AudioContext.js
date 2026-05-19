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
  const [progress, setProgress] = useState({ position: 0, duration: 230 });



  const loadMedia = async () => {
    try {
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
        return;
      }
      setPermissionStatus('granted');

const rawSongs = [
  {
    id: 1,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    artwork: null,
    year: 2020,
    composer: 'The Weeknd',
    dateAdded: Date.now(),
  },
  {
    id: 2,
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy',
    artwork: null,
    year: 2019,
    composer: 'Daft Punk',
    dateAdded: Date.now(),
  },
  {
    id: 3,
    title: 'Believer',
    artist: 'Imagine Dragons',
    album: 'Evolve',
    artwork: null,
    year: 2018,
    composer: 'Imagine Dragons',
    dateAdded: Date.now(),
  }
];console.log('RAW SONGS:', rawSongs.length);

if (!Array.isArray(rawSongs)) {
  console.log('Invalid media data');
  return;
}      
    
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
    } catch (error) {
      console.error('Error loading media:', error);
      setPermissionStatus('error');
    }
  };

useEffect(() => {
loadMedia();
}, []);

 const playSong = (song) => {
  if (!song) return;

  setCurrentSong(song);
  setIsPlaying(true);
};

  const togglePlayback = async () => {
setIsPlaying(prev => !prev);  };

  const skipToNext = async () => {};
  const skipToPrevious = async () => {};
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
        getSongs,
getFilteredSongs,
        isPlayerReady,
        currentSong,
        isPlaying,
        progress,
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

