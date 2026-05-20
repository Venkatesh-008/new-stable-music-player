import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Cloud,
  ListMusic,
  Settings,
  MoreVertical,
  ArrowRight,
  Music,
  Heart,
  Clock3,
} from 'lucide-react-native';import { AudioContext } from '../context/AudioContext';
import { Play } from 'lucide-react-native';
import FastImage from 'react-native-fast-image';


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
      <View style={styles.greetingSection}>

  <Text style={styles.helloText}>
    Hi <Text style={styles.nameText}>Venkatesh</Text>
  </Text>

 <Text style={styles.goodMorningText}>
  Good{'\n'}
  <Text style={styles.morningPurple}>
    Morning
  </Text>
</Text>

  <View style={styles.waveContainer}>

{[
  12, 18, 8, 22, 14, 26, 10,
  16, 20, 7, 24, 11, 18, 9,
  23, 15, 27, 12, 17, 8, 21,
  13, 25, 10, 19, 14, 22, 9,
].map((height, index) => (
  <View
    key={index}
    style={[
      styles.waveBar,
      { height },
    ]}
  />
))}

  </View>

</View>
        {/* Floating Artworks Area */}
        <View style={styles.floatingArea}>
          {/* Main Tilted Artwork (Center) */}
    <View style={styles.vibeContainer}>

  <View style={styles.leftSide}>
    <Text style={styles.imageStar1}>✦</Text>
<Text style={styles.imageStar2}>✦</Text>
<Text style={styles.imageStar3}>✦</Text>
<Text style={styles.imageStar4}>✦</Text>
<Text style={styles.imageStar5}>✦</Text>

    <Image
      source={require('../assets/luffy.png')}
      style={styles.animeImage}
    />

  </View>

  <View style={styles.inspireContainer}>
    <View style={styles.star1}>
  <Text style={styles.smallStar}>✦</Text>
</View>

<View style={styles.star2}>
  <Text style={styles.smallStar}>✦</Text>
</View>

<View style={styles.star3}>
  <Text style={styles.smallStar}>✦</Text>
</View>

    <View style={styles.sparkCircle}>
      <Text style={styles.sparkIcon}>✦</Text>
    </View>

    <Text style={styles.inspireTitle}>
      Daily Inspiration
    </Text>

    <Text style={styles.inspireText}>
      Music is the soundtrack{"\n"}
      of your life. Keep{"\n"}
      listening, keep growing.
    </Text>

    <TouchableOpacity style={styles.inspireBtn}>

      <Text style={styles.inspireBtnText}>
        Stay Inspired
      </Text>

      <ArrowRight
        color="#7C3AED"
        size={18}
      />

    </TouchableOpacity>

  </View>

</View>

</View>

        {/* count section */}

        <View style={styles.statsRow}>

  <View style={styles.statItem}>
    <Music
      size={28}
  color="#FACC15"
      strokeWidth={2.3}
    />

    <Text style={styles.statNumber}>
      436
    </Text>

    <Text style={styles.statLabel}>
      Total Songs
    </Text>
  </View>

  <View style={styles.statDivider} />

  <View style={styles.statItem}>
    <Heart
      size={28}
        color="#EC4899"
  fill="#EC4899"
      strokeWidth={2.3}
    />

    <Text style={styles.statNumber}>
      128
    </Text>

    <Text style={styles.statLabel}>
      Liked
    </Text>
  </View>

  <View style={styles.statDivider} />

  <View style={styles.statItem}>
    <Clock3
      size={28}
  color="#06B6D4"
      strokeWidth={2.3}
    />

    <Text style={styles.statNumber}>
      24
    </Text>

    <Text style={styles.statLabel}>
      Queues
    </Text>
  </View>

  <View style={styles.statDivider} />

  <View style={styles.statItem}>
    <ListMusic
      size={28}
  color="#F59E0B"
      strokeWidth={2.3}
    />

    <Text style={styles.statNumber}>
      12
    </Text>

    <Text style={styles.statLabel}>
      Playlists
    </Text>
  </View>

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
greetingSection: {
  paddingHorizontal: 24,
  marginTop: 18,
},
helloText: {
  color: '#aaa',
  fontSize: 22,
  fontWeight: '500',
},

nameText: {
  color: '#7C3AED',
  fontWeight: '700',
},

goodMorningText: {
  color: '#fff',
  fontSize: 46,
  fontWeight: '900',
  lineHeight: 48,
  marginTop: 4,
  letterSpacing: -2,
},
morningPurple: {
  color: '#7C3AED',
},

animeImage: {
  width: 410,
  height: 410,
  resizeMode: 'contain',
  marginLeft: -110,
  marginTop: 1,
},

imageStar1: {
  position: 'absolute',
  top: 30,
  left: 18,
  color: '#A855F7',
  fontSize: 12,
  opacity: 0.9,

  textShadowColor: '#7C3AED',
  textShadowOffset: {
    width: 0,
    height: 0,
  },
  textShadowRadius: 12,
},

imageStar2: {
  position: 'absolute',
  top: 70,
  right: 30,
  color: '#A855F7',
  fontSize: 10,
  opacity: 0.8,

  textShadowColor: '#7C3AED',
  textShadowOffset: {
    width: 0,
    height: 0,
  },
  textShadowRadius: 10,
},

imageStar3: {
  position: 'absolute',
  bottom: 35,
  left: 12,
  color: '#A855F7',
  fontSize: 11,
  opacity: 0.9,

  textShadowColor: '#7C3AED',
  textShadowOffset: {
    width: 0,
    height: 0,
  },
  textShadowRadius: 10,
},

imageStar4: {
  position: 'absolute',
  bottom: 70,
  right: 60,
  color: '#A855F7',
  fontSize: 9,
  opacity: 0.8,

  textShadowColor: '#7C3AED',
  textShadowOffset: {
    width: 0,
    height: 0,
  },
  textShadowRadius: 10,
},

imageStar5: {
  position: 'absolute',
  top: 120,
  left: 80,
  color: '#A855F7',
  fontSize: 8,
  opacity: 0.7,

  textShadowColor: '#7C3AED',
  textShadowOffset: {
    width: 0,
    height: 0,
  },
  textShadowRadius: 8,
},
vibeContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 18,
  marginTop: -28,
},
leftSide: {
  width: '65%',
  justifyContent: 'center',
  alignItems: 'flex-start',
},
inspireContainer: {
  width: '34%',
  marginTop: -5,
  alignItems: 'flex-start',
  paddingRight: 10,
  marginLeft: -3,
},
sparkCircle: {
  width: 46,
  height: 46,
  borderRadius: 40,
  borderWidth: 2,
  borderColor: '#7C3AED',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 18,
  backgroundColor: 'rgba(124, 58, 237, 0.08)',

  shadowColor: '#7C3AED',
  shadowOffset: {
    width: 0,
    height: 0,
  },
 shadowOpacity: 0.35,
shadowRadius: 6,
elevation: 6,
},
star1: {
  position: 'absolute',
  top: -18,
  right: 30,
},

star2: {
  position: 'absolute',
  top: 35,
  right: -8,
},

star3: {
  position: 'absolute',
  top: 70,
  right: 60,
},

smallStar: {
  color: '#7C3AED',
  fontSize: 10,
  opacity: 0.9,
},

sparkIcon: {
  color: '#A855F7',
  fontSize: 22,
  fontWeight: '700',

  textShadowColor: '#7C3AED',
  textShadowOffset: {
    width: 0,
    height: 0,
  },
  textShadowRadius: 10,
},

inspireTitle: {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: '800',
  marginBottom: 14,
},

inspireText: {
  color: '#7E7E7E',
  fontSize: 11,
  lineHeight: 20,
  fontWeight: '500',
},

inspireBtn: {
  marginTop: 12,
  height: 42,
  width: 143,
  marginLeft: -7,
  borderRadius: 30,
  borderWidth: 1.5,
  borderColor: '#7C3AED',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 22,
},

inspireBtnText: {
  color: '#7C3AED',
  fontSize: 15,
  fontWeight: '700',
},
paginationRow: {
  flexDirection: 'row',
  marginTop: 26,
},

waveContainer: {
  width: 265,
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 3,
},

waveBar: {
  width: 4,
  backgroundColor: '#6D28D9',
  borderRadius: 4,
  marginRight: 3,
},
floatingArea: {
   height: 270,
  marginTop: -2,
},
statsRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 18,
  marginTop: 25,
  marginBottom: 8,
},

statItem: {
  alignItems: 'center',
  flex: 1,
},
statNumber: {
  color: '#fff',
  fontSize: 24,
  fontWeight: '900',
  marginTop: 14,
},

statLabel: {
  color: '#777',
  fontSize: 11,
  marginTop: 6,
  fontWeight: '500',
},
statDivider: {
  width: 1,
  height: 70,
  backgroundColor: 'rgba(255,255,255,0.08)',
},


  dailyMixCard: {
    borderWidth: 1,
    borderColor: '#1A1A1A',
    marginHorizontal: 16,
    marginTop: 24,
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
    borderWidth: 1,
    borderColor: '#1A1A1A',
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

