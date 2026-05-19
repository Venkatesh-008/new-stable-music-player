import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AudioContext } from '../context/AudioContext';
import { FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Play,
  MoreVertical,
  LayoutGrid,
  List,
  FolderHeart,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { Layout } from 'react-native-reanimated';

export default function LibraryScreen({ navigation }) {
const {
  folders,
  permissionStatus,
  loadMedia,
  getFilteredSongs,
  isPlayerReady,
  isLoading,
  playSong,
  currentSong,
} = React.useContext(AudioContext);
  const [activeFolderId, setActiveFolderId] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  



const filteredSongs = React.useMemo(() => {
  return getFilteredSongs(activeFolderId, 0, 200);
}, [activeFolderId, getFilteredSongs]);

const activeFolder = React.useMemo(() => {
  return folders.find(f => f.id === activeFolderId);
}, [folders, activeFolderId]);


const renderFolderGrid = React.useCallback((folder, index) => {
      const isActive = folder.id === activeFolderId;
    const IconComponent = folder.icon;

    return (
      <TouchableOpacity 
        key={folder.id}
        activeOpacity={0.8}
        onPress={() => setActiveFolderId(folder.id)}
      >
        <Animated.View 
          layout={Layout.springify()}
          style={[styles.folderCardGrid, isActive && styles.folderCardActive]}
        >
          <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
            <IconComponent color={isActive ? '#ffffff' : '#9b51e0'} size={24} />
          </View>
          <View>
            <Text style={[styles.folderTitle, isActive && styles.textActive]} numberOfLines={1}>{folder.title}</Text>
            <Text style={[styles.folderSubtitle, isActive && styles.textActiveSub]} numberOfLines={1}>{folder.count} {folder.id === 'all' ? 'total' : 'items'}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
}, [activeFolderId]);
const renderFolderList = React.useCallback((folder, index) => {
      const isActive = folder.id === activeFolderId;
    const IconComponent = folder.icon;



    return (
      <TouchableOpacity 
        key={folder.id}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('FolderScreen', { folder })}
      >
        <Animated.View 
      
          layout={Layout.springify()}
          style={[styles.folderCardList, isActive && styles.folderCardActive]}
        >
          <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive, { marginRight: 16 }]}>
            <IconComponent color={isActive ? '#ffffff' : '#9b51e0'} size={20} />
          </View>
          <View>
            <Text style={[styles.folderTitle, isActive && styles.textActive]} numberOfLines={1}>{folder.title}</Text>
            <Text style={[styles.folderSubtitle, isActive && styles.textActiveSub]} numberOfLines={1}>{folder.count} {folder.id === 'all' ? 'total' : 'items'}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }, [activeFolderId]);

const renderSongItem = React.useCallback(({ item }) => {
  return (
    <View>
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
    </View>
  );
}, []);
if (isLoading) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Scanning Music...</Text>

        <Text style={styles.errorSubtitle}>
          Loading your local songs
        </Text>
      </View>
    </SafeAreaView>
  );
}
  if (permissionStatus === 'denied') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <FolderHeart color="#602B7A" size={64} />
          <Text style={styles.errorTitle}>Storage Access Denied</Text>
          <Text style={styles.errorSubtitle}>We need storage permission to scan your real local music.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMedia}>
            <Text style={styles.retryText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

return (
  <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

    {/* HEADER */}
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Library</Text>

      <View style={styles.headerToggles}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            viewMode === 'grid' && styles.toggleBtnActive,
          ]}
          onPress={() => setViewMode('grid')}
        >
          <LayoutGrid
            color={viewMode === 'grid' ? '#fff' : '#666'}
            size={20}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleBtn,
            viewMode === 'list' && styles.toggleBtnActive,
          ]}
          onPress={() => setViewMode('list')}
        >
          <List
            color={viewMode === 'list' ? '#fff' : '#666'}
            size={20}
          />
        </TouchableOpacity>
      </View>
    </View>

    {/* FOLDER SECTION */}
    <View style={styles.folderSection}>

      {viewMode === 'grid' ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gridScrollContent}
        >
          {folders.map((folder, index) =>
            renderFolderGrid(folder, index)
          )}
        </ScrollView>
      ) : (
        <View style={styles.listScrollContent}>
          {folders.map((folder, index) =>
            renderFolderList(folder, index)
          )}
        </View>
      )}

    </View>

  {/* SONG SECTION */}
<View style={styles.songSection}>

  {filteredSongs.length > 0 ? (
    <FlatList
      data={filteredSongs}
      renderItem={renderSongItem}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.flashListContent}

      ListHeaderComponent={
        <Text style={styles.sectionTitle}>
          {activeFolder?.title || 'All Songs'}
        </Text>
      }
    />
  ) : (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconBg}>
        <FolderHeart color="#8B5CF6" size={42} />
      </View>

      <Text style={styles.emptyStateTitle}>
        No Songs Found
      </Text>

      <Text style={styles.emptyStateSubtitle}>
        Your local music files are still loading.
      </Text>
    </View>
  )}

</View>

  </SafeAreaView>
);
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#000000',
},
folderSection: {
  marginTop: 4,
},
songSection: {
  flex: 1,
  marginTop: -2,
},
flashListContent: {
  paddingHorizontal: 20,
  paddingBottom: 120,
  paddingTop: 4,
},
  scrollContent: {
    paddingBottom: 80, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1,
  },
headerToggles: {
  flexDirection: 'row',
  backgroundColor: '#0F0F0F',
  borderRadius: 30,
  padding: 4,
  borderWidth: 1,
  borderColor: '#1A1A1A',
},
  toggleBtn: {
    padding: 8,
    borderRadius: 20,
  },
toggleBtnActive: {
  backgroundColor: '#151515',
},
gridScrollContent: {
  paddingHorizontal: 24,
  paddingTop: 8,
  paddingBottom: 0,
},
  listScrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
 folderCardGrid: {
  width: 142,
  height: 122,
    backgroundColor: '#131313',
    borderRadius: 28,
    padding: 20,
    marginRight: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  folderCardList: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131313',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
folderCardActive: {
  backgroundColor: '#111111',
  borderColor: '#8B5CF6',
  shadowColor: '#8B5CF6',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 2,
},
 iconWrapper: {
  width: 42,
  height: 42,
    borderRadius: 22,
backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
  },
iconWrapperActive: {
  backgroundColor: '#8B5CF6',
},
  folderTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  folderSubtitle: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
  },
  textActive: {
    color: '#E5C9FA',
  },
  textActiveSub: {
    color: 'rgba(229, 201, 250, 0.7)',
  },
sectionTitle: {
  color: '#ffffff',
  fontSize: 22,
  fontWeight: '800',
  paddingHorizontal: 4,
  marginTop: 2,
  marginBottom: 12,
},
 
songItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 10,
  backgroundColor: '#0B0B0B',
  borderRadius: 18,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: '#111111',
},
 songIconPlaceholder: {
  width: 52,
  height: 52,
    borderRadius: 12,
backgroundColor: '#121212',
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
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(96, 43, 122, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(96, 43, 122, 0.3)',
  },
  emptyStateTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    color: '#888888',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },


  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 8,
  },
  errorSubtitle: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#602B7A',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  }
});
