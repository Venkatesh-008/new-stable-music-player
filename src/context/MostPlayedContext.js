import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import { storage }
from '../store/mmkv';

const MostPlayedContext =
  createContext();

export const MostPlayedProvider =
({ children }) => {

  const [playCounts, setPlayCounts] =
    useState({});

  const hasLoadedPlayCounts =
    useRef(false);

  useEffect(() => {

    const savedPlayCounts =
      storage.getString('playCounts');

    if (savedPlayCounts) {

      const parsed =
        JSON.parse(savedPlayCounts);

      setPlayCounts(parsed);

      console.log(
        'Most Played Loaded:',
        Object.keys(parsed).length
      );

    }

    hasLoadedPlayCounts.current =
      true;

  }, []);

  useEffect(() => {

    if (!hasLoadedPlayCounts.current) {
      return;
    }

    try {

      storage.set(
        'playCounts',
        JSON.stringify(playCounts)
      );

      console.log(
        'Most Played Saved:',
        Object.keys(playCounts).length
      );

    } catch (error) {

      console.log(
        'MOST PLAYED SAVE ERROR:',
        error
      );

    }

  }, [playCounts]);

  const increasePlayCount =
  (song) => {

    if (!song?.id) return;

    setPlayCounts(prev => {

      const updated = {
        ...prev,
        [song.id]: {
          song,
          count: prev[song.id]?.count
            ? prev[song.id].count + 1
            : 1,
        },
      };

      return updated;

    });

  };

  const getMostPlayedSongs =
  () => {

    return Object.values(playCounts)
      .sort((a, b) =>
        b.count - a.count
      )
      .map(item => ({
        ...item.song,
        playCount: item.count,
      }));

  };

  return (

    <MostPlayedContext.Provider
      value={{
        playCounts,
        increasePlayCount,
        getMostPlayedSongs,
      }}
    >

      {children}

    </MostPlayedContext.Provider>

  );

};

export const useMostPlayed =
() => useContext(MostPlayedContext);