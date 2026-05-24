import React, {
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {
  Search,
  Music,
} from 'lucide-react-native';

import FastImage
from 'react-native-fast-image';

import { AudioContext }
from '../context/AudioContext';

export default function SearchScreen() {

  const {
    songs,
    playSong,
    setIsFullPlayerOpen,
  } = useContext(AudioContext);

  const [query, setQuery] =
    useState('');

  const [debouncedQuery,
    setDebouncedQuery] =
    useState('');

  useEffect(() => {

    const handler =
      setTimeout(() => {

        setDebouncedQuery(query);

      }, 300);

    return () => {

      clearTimeout(handler);

    };

  }, [query]);

  const filteredSongs =
    useMemo(() => {

      if (
        !debouncedQuery.trim()
      ) {

        return [];

      }

      const lowerQuery =
        debouncedQuery
          .toLowerCase();

      return songs.filter(song => {

        return (

          song.title
            ?.toLowerCase()
            .includes(lowerQuery)

          ||

          song.artist
            ?.toLowerCase()
            .includes(lowerQuery)

          ||

          song.album
            ?.toLowerCase()
            .includes(lowerQuery)

          ||

          song.folderName
            ?.toLowerCase()
            .includes(lowerQuery)

        );

      });

    }, [
      debouncedQuery,
      songs,
    ]);

  const renderSong =
    React.useCallback(
      ({ item }) => {

      return (

        <TouchableOpacity
          style={styles.songCard}
          activeOpacity={0.7}
          onPress={async () => {

            await playSong(item);

            setIsFullPlayerOpen(
              true
            );

          }}
        >

          {
            item.artwork ? (

              <FastImage
                source={{
                  uri:
                    item.artwork,
                }}
                style={
                  styles.artwork
                }
              />

            ) : (

              <View
                style={
                  styles.placeholder
                }
              >

                <Music
                  color="#777"
                  size={20}
                />

              </View>

            )
          }

          <View
            style={styles.songInfo}
          >

            <Text
              style={styles.title}
              numberOfLines={1}
            >

              {
                String(
                  item.title ||
                  'Unknown Song'
                )
              }

            </Text>

            <Text
              style={styles.subtitle}
              numberOfLines={1}
            >

              {
                String(
                  item.artist ||
                  'Unknown Artist'
                )
              }

            </Text>

          </View>

        </TouchableOpacity>

      );

    }, [
      playSong,
      setIsFullPlayerOpen,
    ]);

  return (

    <View style={styles.container}>

      <View
        style={
          styles.searchContainer
        }
      >

        <Search
          color="#888"
          size={20}
        />

        <TextInput
          placeholder="Search songs..."
          placeholderTextColor="#666"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />

      </View>

      {

        query.trim() === ''

        ? (

          <View
            style={
              styles.emptyContainer
            }
          >

            <Search
              color="#333"
              size={70}
            />

            <Text
              style={
                styles.emptyText
              }
            >

              Search Songs,
              Artists,
              Albums

            </Text>

          </View>

        )

        : (

          <FlatList
            data={filteredSongs}
            renderItem={renderSong}
            keyExtractor={item =>
              item.id.toString()
            }
            contentContainerStyle={{
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={
              false
            }
            removeClippedSubviews={
              true
            }
            initialNumToRender={12}
            maxToRenderPerBatch={10}
            windowSize={5}
          />

        )

      }

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
    paddingHorizontal: 16,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    color: '#fff',
    marginLeft: 12,
    fontSize: 16,
  },

  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },

  artwork: {
    width: 58,
    height: 58,
    borderRadius: 14,
  },

  placeholder: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  songInfo: {
    flex: 1,
    marginLeft: 14,
  },

  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  subtitle: {
    color: '#888',
    fontSize: 13,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -80,
  },

  emptyText: {
    color: '#444',
    fontSize: 16,
    marginTop: 20,
  },

});