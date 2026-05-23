import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  queueState,
} from '../player/queueState';
import { Play, MoreVertical, ChevronLeft } from 'lucide-react-native';
import FastImage from 'react-native-fast-image';
import { playQueue } from '../player/queueManager';
import {
  useQueueHistory,
} from '../context/QueueHistoryContext';
import {
  AudioContext,
} from '../context/AudioContext';
export default function FolderScreen({ route, navigation }) {
const {
  getFilteredSongs,
  setIsFullPlayerOpen,
} = React.useContext(AudioContext);

const {
  saveQueue,
} = useQueueHistory();

 const folder = route?.params?.folder;
 if (!folder) {

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >

      <Text
        style={{
          color: '#fff',
          fontSize: 18,
        }}
      >
        Folder not found
      </Text>

    </SafeAreaView>
  );
}


const filteredSongs =
React.useMemo(() => {

  // PLAYLIST SONGS
  if (folder.songs) {

    return folder.songs;

  }

  // NORMAL LIBRARY SONGS
  return getFilteredSongs(
    folder.id,
    0,
    200
  );

}, [
  folder,
  getFilteredSongs,
]);
  


const renderSongItem = React.useCallback(({ item, index }) => (
  <View>
   <TouchableOpacity
  style={styles.songItem}
  activeOpacity={0.7}
onPress={async () => {

await playQueue(
  filteredSongs,
  index,
  folder.id
);

saveQueue(
  folder.title,
  queueState.activeQueue
);

setTimeout(() => {
  setIsFullPlayerOpen(true);
}, 80);
}}
>
      <View style={styles.songIconPlaceholder}>
        {item.artwork ? (
          <FastImage
            source={{
              uri: item.artwork,
              priority: FastImage.priority.low,
                cache: FastImage.cacheControl.immutable,
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

{item.playCount && (
  <Text
    style={{
      color: '#1DB954',
      fontSize: 12,
      marginTop: 4,
      fontWeight: '600',
    }}
  >
    {item.playCount} Plays
  </Text>
)}
      </View>

      <TouchableOpacity style={styles.moreButton}>
        <MoreVertical color="#666" size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  </View>
), [filteredSongs, folder.id]);
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronLeft color="#ffffff" size={28} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{folder.title}</Text>
          <Text style={styles.headerSubtitle}>{folder.count} {folder.id === 'all' ? 'total' : 'items'}</Text>
        </View>
      </View>

     
<FlatList
  data={filteredSongs}
  renderItem={renderSongItem}
  keyExtractor={(item) => item.id.toString()}
  contentContainerStyle={styles.scrollContent}
  showsVerticalScrollIndicator={false}
  removeClippedSubviews={true}
  initialNumToRender={12}
  maxToRenderPerBatch={10}
  windowSize={7}
  updateCellsBatchingPeriod={50}
/>
   

       </SafeAreaView>
     
     
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 120, 
  },

  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#0A0A0A',
    borderRadius: 16,
    marginBottom: 8,
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
  


});
