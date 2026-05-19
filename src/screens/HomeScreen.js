import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cloud, ListMusic, Settings, MoreVertical, Shuffle, ArrowRight, Music } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

import { AudioContext } from '../context/AudioContext';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');


const FloatingMainArtwork = ({
  source,
  width,
  height,
  initialX,
  initialY,
  duration,
}) => {
  const translateY = useSharedValue(initialY);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(initialY - 20, {
          duration: duration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(initialY, {
          duration: duration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, []);
  const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [{ translateY: translateY.value }],
  };
});

  return (
    <Animated.View
style={[
  {
    position: 'absolute',
    left: initialX,
    width: width,
    height: height,
    borderRadius: 90,
    overflow: 'hidden',
    backgroundColor: '#222',
    transform: [{ rotate: '-20deg' }],
  },
  animatedStyle,
]}
    >
      <FastImage
        source={source}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        }
      }
        
      />
    </Animated.View>
  );
};




export default function HomeScreen() {
const { getSongs } = React.useContext(AudioContext);
const dailyMixSongs = React.useMemo(() => {
  return getSongs(0, 5);
}, [getSongs]);
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Area */}
        <View style={styles.header}>
          <View style={styles.betaBadge}>
            <Text style={styles.betaText}>β Beta</Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Cloud color="#fff" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <ListMusic color="#fff" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Settings color="#fff" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.mainHeading}>Your{'\n'}Mix</Text>
          <Text style={styles.subHeading}>Today's Mix for you</Text>
        </View>

        {/* Floating Artworks Area */}
        <View style={styles.floatingArea}>
          {/* Main Tilted Artwork (Center) */}
          <FloatingMainArtwork 
            source={{ uri: 'https://via.placeholder.com/300/111/fff?text=ICE+BOY' }}
            width={180}
            height={240}
            initialX={width / 2 - 90}
            initialY={20}
            duration={7000}
          />
          
      
     

          {/* Tilted Square Artwork Bottom-Left */}
         

          {/* Orange Blob Bottom-Right */}
       

          {/* Purple Action Button Upper-Right */}
          <Animated.View style={[styles.purpleActionButtonWrapper, { top: 10, right: 24 }]}>
            <TouchableOpacity style={styles.purpleActionButton}>
              <Shuffle color="#fff" size={26} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Daily Mix Card */}
        <View style={styles.dailyMixCard}>
          <View style={styles.dailyMixHeader}>
            <View>
              <Text style={styles.dailyMixTitle}>DAILY MIX</Text>
              <Text style={styles.dailyMixSubtitle}>Based on History</Text>
            </View>
            <View style={styles.dailyMixHeaderChips}>
              <View style={[styles.chipArtwork, { zIndex: 3 }]}><FastImage source={{ uri: 'https://via.placeholder.com/50/FF5A00/fff?text=R' }} style={styles.chipImage} /></View>
              <View style={[styles.chipArtwork, { zIndex: 2, marginLeft: -12 }]}><FastImage source={{ uri: 'https://via.placeholder.com/50/555/fff?text=M' }} style={styles.chipImage} /></View>
              <View style={[styles.chipIcon, { zIndex: 1, marginLeft: -12 }]}>
                <Music color="#fff" size={16} />
              </View>
            </View>
          </View>

          <View style={styles.songListContainer}>
            {dailyMixSongs.map((song) => (
              <TouchableOpacity key={song.id} style={styles.songItem}>
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                  <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreVertical color="#888" size={20} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity style={styles.checkAllButton}>
              <Text style={styles.checkAllText}>Check all of Daily Mix</Text>
              <ArrowRight color="#aaa" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Listening Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <View>
              <Text style={styles.statsTitle}>Listening stats</Text>
              <Text style={styles.statsSubtitle}>This Week</Text>
            </View>
            <TouchableOpacity style={styles.statsArrowButton}>
              <ArrowRight color="#fff" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsNumbersRow}>
            <View style={styles.statsNumberCol}>
              <Text style={styles.statsNumberBig}>0 s</Text>
              <View style={styles.statsLabelsRow}>
                <View>
                  <Text style={styles.statsLabel}>Total plays</Text>
                  <Text style={styles.statsValue}>0</Text>
                </View>
                <View style={{marginLeft: 60}}>
                  <Text style={styles.statsLabel}>Avg per day</Text>
                  <Text style={styles.statsValue}>0s</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Minimal Graph */}
          <View style={styles.graphContainer}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <View key={day} style={styles.graphBarCol}>
                <View style={styles.graphBar} />
                <Text style={styles.graphDayText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingBottom: 80, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  betaBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  betaText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  heroSection: {
    paddingHorizontal: 24,
    marginTop: 4,
    paddingRight: 60, 
    zIndex: 10,
  },
  mainHeading: {
    color: '#ffffff',
    fontSize: 64,
    fontWeight: '900',
    lineHeight: 64,
    letterSpacing: -1.5,
  },
  subHeading: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  floatingArea: {
    height: 350, 
    position: 'relative',
    marginTop: -30, 
    zIndex: 1,
  },
  purpleActionButtonWrapper: {
    position: 'absolute',
    zIndex: 10,
  },
  purpleActionButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#602B7A', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#602B7A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  dailyMixCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: '#131313', 
    overflow: 'hidden',
  },
  dailyMixHeader: {
    backgroundColor: '#E5C9FA', 
    paddingHorizontal: 24,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyMixTitle: {
    color: '#000',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  dailyMixSubtitle: {
    color: '#444',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  dailyMixHeaderChips: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipArtwork: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5C9FA',
    overflow: 'hidden',
  },
  chipImage: {
    width: '100%',
    height: '100%',
  },
  chipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#222',
    borderWidth: 2,
    borderColor: '#E5C9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songListContainer: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  songInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  songArtist: {
    color: '#888',
    fontSize: 14,
  },
  moreButton: {
    padding: 8,
    marginRight: -8,
  },
  checkAllButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginTop: 8,
  },
  checkAllText: {
    color: '#aaa',
    fontSize: 15,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: '#131313',
    borderRadius: 30,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 24,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  statsSubtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  statsArrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#38285C', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsNumbersRow: {
    marginBottom: 32,
  },
  statsNumberCol: {
    flex: 1,
  },
  statsNumberBig: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 16,
  },
  statsLabelsRow: {
    flexDirection: 'row',
  },
  statsLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  statsValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 40,
    paddingHorizontal: 8,
  },
  graphBarCol: {
    alignItems: 'center',
  },
  graphBar: {
    width: 28,
    height: 6, 
    backgroundColor: '#38285C',
    borderRadius: 3,
    marginBottom: 8,
  },
  graphDayText: {
    color: '#666',
    fontSize: 11,
    fontWeight: '600',
  },

});

