import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { NativeModules } from 'react-native';

const { MediaScanner } = NativeModules;

const MostPlayedContext = createContext();

export const MostPlayedProvider = ({ children }) => {
  const [mostPlayedSongs, setMostPlayedSongs] = useState([]);

  const loadMostPlayed = async () => {
    try {
      const songs = await MediaScanner.getFilteredSongs('mostplayed', 0, 50);
      setMostPlayedSongs(songs);
    } catch (e) {
      console.log('Error loading most played', e);
    }
  };

  useEffect(() => {
    loadMostPlayed();
  }, []);

  const increasePlayCount = async (song) => {
    if (!song?.id) return;
    try {
      await MediaScanner.incrementPlayCount(song.id);
      loadMostPlayed();
    } catch (e) {
      console.log('Error incrementing play count', e);
    }
  };

  const getMostPlayedSongs = () => mostPlayedSongs;

  return (
    <MostPlayedContext.Provider
      value={{
        increasePlayCount,
        getMostPlayedSongs,
      }}
    >
      {children}
    </MostPlayedContext.Provider>
  );
};

export const useMostPlayed = () => useContext(MostPlayedContext);