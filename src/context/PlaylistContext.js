import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import { storage }
from '../store/mmkv';

const PlaylistContext =
  createContext();

export const PlaylistProvider =
({ children }) => {

  const [playlists, setPlaylists] =
    useState([]);

  const hasLoadedPlaylists =
    useRef(false);

  useEffect(() => {

    const savedPlaylists =
      storage.getString('playlists');

    if (savedPlaylists) {

      const parsed =
        JSON.parse(savedPlaylists);

      setPlaylists(parsed);



    }

    hasLoadedPlaylists.current =
      true;

  }, []);

  useEffect(() => {

    if (!hasLoadedPlaylists.current) {
      return;
    }

    storage.set(
      'playlists',
      JSON.stringify(playlists)
    );



  }, [playlists]);

  const createPlaylist =
  (name) => {

    const newPlaylist = {
      id: Date.now().toString(),
      name,
      songs: [],
      createdAt: Date.now(),
    };

    setPlaylists(prev => [
      ...prev,
      newPlaylist,
    ]);

  };

  return (

    <PlaylistContext.Provider
      value={{
        playlists,
        createPlaylist,
      }}
    >

      {children}

    </PlaylistContext.Provider>

  );

};

export const usePlaylists =
() => useContext(PlaylistContext);