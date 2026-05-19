import React, { useState, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Play, MoreVertical } from 'lucide-react-native';
import { AudioContext } from '../context/AudioContext';
import { FlashList } from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';

const CATEGORIES = [
  { id: '1', title: 'Podcasts', color: '#E13300' },
  { id: '2', title: 'Live Events', color: '#7358FF' },
  { id: '3', title: 'Made For You', color: '#1E3264' },
  { id: '4', title: 'New Releases', color: '#E8115B' },
  { id: '5', title: 'Pop', color: '#148A08' },
  { id: '6', title: 'Hip-Hop', color: '#BC5900' },
  { id: '7', title: 'Rock', color: '#E91429' },
  { id: '8', title: 'Latin', color: '#E1118C' },
];

export default function SearchScreen() {
const { getSongs, playSong } = useContext(AudioContext);
  const [searchQuery, setSearchQuery] = useState('');
  const allSongs = useMemo(() => {
  return getSongs(0, 3000);
}, [getSongs]);

const filteredSongs = useMemo(() => {
  if (searchQuery.length < 2) return [];

  const query = searchQuery.toLowerCase();

  return allSongs
  .filter(song => {
  const title = song.title?.toLowerCase() || '';
  return title.includes(query);
})
    .slice(0, 100);
}, [searchQuery, allSongs]);
const renderSongItem = React.useCallback(({ item }) => (
    <TouchableOpacity
    style={styles.songItem}
    activeOpacity={0.7}
    onPress={() => playSong(item)}
  >
    <View style={styles.songIconPlaceholder}>
      {item.artwork ? (
        <FastImage
          source={{
            uri: item.artwork,
            priority: FastImage.priority.low,
          }}
          style={styles.songArtwork}
        />
      ) : (
        <Play color="#666" size={16} />
      )}
    </View>

    <View style={styles.songDetails}>
      <Text style={styles.songTitle} numberOfLines={1}>
        {item.title}
      </Text>

      <Text style={styles.songArtist} numberOfLines={1}>
        {item.artist} • {item.album}
      </Text>
    </View>

    <TouchableOpacity style={styles.moreButton}>
      <MoreVertical color="#666" size={20} />
    </TouchableOpacity>
  </TouchableOpacity>
), [playSong]);

const renderCategory = React.useCallback((cat) => (
  <TouchableOpacity
    key={cat.id}
    style={[styles.card, { backgroundColor: cat.color }]}
    activeOpacity={0.8}
  >
    <Text style={styles.cardTitle}>
      {cat.title}
    </Text>
  </TouchableOpacity>
), []);
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#121212" size={24} />
          <TextInput 
            style={styles.searchInput}
            placeholder="What do you want to listen to?"
            placeholderTextColor="#555"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

         {searchQuery.length > 0 ? (
        filteredSongs.length > 0 ? (
          <FlashList
            data={filteredSongs}
            renderItem={renderSongItem}
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={68}
            drawDistance={180}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsContainer}
          />
        ) : (
          <Text style={styles.emptyText}>
            No matching songs found.
          </Text>
        )
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
contentContainerStyle={styles.browseScrollContent}        >
          <Text style={styles.sectionTitle}>Browse all</Text>

          <View style={styles.grid}>
         {CATEGORIES.map(renderCategory)}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  browseScrollContent: {
  paddingBottom: 100,
},
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 52,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
 
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  card: {
    width: '45%',
    aspectRatio: 1.5,
    marginHorizontal: '2.5%',
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 80,
  },
  resultsContainer: {
    paddingHorizontal: 16,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#0A0A0A',
    borderRadius: 16,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  songIconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  songArtwork: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  songDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  songTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  songArtist: {
    color: '#888888',
    fontSize: 13,
  },
  moreButton: {
    padding: 10,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
    fontStyle: 'italic',
  }
});
