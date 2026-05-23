import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useMostPlayed } from '../context/MostPlayedContext';
import { AudioContext } from '../context/AudioContext';
import { FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import { playQueue } from '../player/queueManager';
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
  favorites,
  recentSongs,
  permissionStatus,
  loadMedia,
  getFilteredSongs,
  isPlayerReady,
  isLoading,
  currentSong,
} = React.useContext(AudioContext);

const {
  getMostPlayedSongs,
} = useMostPlayed();

const mostPlayedSongs =
  getMostPlayedSongs();

const [viewMode, setViewMode] = useState('list');  

const renderFolderGrid = React.useCallback((folder, index) => {
   const isActive = false;
    const IconComponent = folder.icon;

    return (
      <TouchableOpacity 
        key={folder.id}
        activeOpacity={0.8}
      onPress={() =>
navigation.navigate(
  'FolderScreen',
  {
    folder: {
      id: folder.id,
      title: folder.title,
      count: folder.count,
    },
  }
) 
}
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
}, []);
const renderFolderList = React.useCallback((folder, index) => {
      const isActive = false;
    const IconComponent = folder.icon;



    return (
      <TouchableOpacity 
        key={folder.id}
        activeOpacity={0.8}
onPress={() =>
navigation.navigate(
  'FolderScreen',
  {
    folder: {
      id: folder.id,
      title: folder.title,
      count: folder.count,
    },
  }
)
}
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

<TouchableOpacity
  activeOpacity={0.8}
  onPress={() =>
    navigation.navigate(
      'FolderScreen',
      {
        folder: {
          id: 'recent',
          title: 'Recently Played 🕒',
          count: recentSongs.length,
        },
      }
    )
  }
>
  <TouchableOpacity
  activeOpacity={0.8}
  onPress={() =>
    navigation.navigate(
      'FolderScreen',
      {
        folder: {
          id: 'mostplayed',
          title: 'Most Played 🔥',
          count: mostPlayedSongs.length,
        },
      }
    )
  }
>

  <View style={styles.folderCardList}>

    <View
      style={[
        styles.iconWrapper,
        { marginRight: 16 },
      ]}
    >

      <Play
        color="#9b51e0"
        size={20}
      />

    </View>

    <View>

      <Text style={styles.folderTitle}>
        Most Played 🔥
      </Text>

      <Text style={styles.folderSubtitle}>
        {mostPlayedSongs.length} songs
      </Text>

    </View>

  </View>

</TouchableOpacity>

  <View style={styles.folderCardList}>

    <View
      style={[
        styles.iconWrapper,
        { marginRight: 16 },
      ]}
    >

      <Play
        color="#9b51e0"
        size={20}
      />

    </View>

    <View>

      <Text style={styles.folderTitle}>
        Recently Played 🕒
      </Text>

      <Text style={styles.folderSubtitle}>
        {recentSongs.length} songs
      </Text>

    </View>

  </View>

</TouchableOpacity>
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() =>
      navigation.navigate(
        'FolderScreen',
        {
          folder: {
            id: 'favorites',
            title: 'Favorites ❤️',
            count: favorites.length,
          },
        }
      )
    }
  >

    <View style={styles.folderCardList}>

      <View
        style={[
          styles.iconWrapper,
          { marginRight: 16 },
        ]}
      >

        <FolderHeart
          color="#9b51e0"
          size={20}
        />

      </View>

      <View>

        <Text style={styles.folderTitle}>
          Favorites ❤️
        </Text>

        <Text style={styles.folderSubtitle}>
          {favorites.length} songs
        </Text>

      </View>

    </View>

  </TouchableOpacity>

  {folders.map((folder, index) =>
    renderFolderList(folder, index)
  )}

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
  paddingTop: 10,
  paddingBottom: 10,
},
headerTitle: {
  color: '#ffffff',
  fontSize: 44,
  fontWeight: '900',
  letterSpacing: -1.5,
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
  paddingTop: 0,
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
  paddingVertical: 14,
  paddingHorizontal: 0,
  backgroundColor: 'transparent',
  marginBottom: 4,
},
folderCardActive: {
  backgroundColor: 'transparent',
  borderColor: 'transparent',
},
iconWrapper: {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: '#0F0F0F',
  justifyContent: 'center',
  alignItems: 'center',
},
iconWrapperActive: {
  backgroundColor: '#8B5CF6',
},
folderTitle: {
  color: '#ffffff',
  fontSize: 19,
  fontWeight: '700',
  marginBottom: 2,
},
folderSubtitle: {
  color: '#7A7A7A',
  fontSize: 12,
  fontWeight: '500',
},
textActive: {
  color: '#E9D5FF',
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
