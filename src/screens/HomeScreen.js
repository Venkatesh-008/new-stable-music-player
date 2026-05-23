import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
} from 'lucide-react-native';

import { AudioContext } from '../context/AudioContext';
import FastImage from 'react-native-fast-image';

const waveData = [
  12, 18, 8, 22, 14, 26, 10,
  16, 20, 7, 24, 11, 18, 9,
  23, 15, 27, 12, 17, 8, 21,
  13, 25, 10, 19, 14, 22, 9,
];

export default function HomeScreen() {

  const { getSongs } = React.useContext(AudioContext);

  const dailyMixSongs = React.useMemo(() => {
    return getSongs(0, 5);
  }, [getSongs]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}
    >

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <View style={styles.betaBadge}>
            <Text style={styles.betaText}>
              β Beta
            </Text>
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

        {/* GREETING */}

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

          {/* WAVE */}

          <View style={styles.waveContainer}>

            {waveData.map((height, index) => (
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

        {/* STATS */}

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

        {/* DAILY MIX */}

        <View style={styles.dailyMixCard}>

          <View style={styles.dailyMixHeader}>

            <View>

              <Text style={styles.dailyMixTitle}>
                DAILY MIX
              </Text>

              <Text style={styles.dailyMixSubtitle}>
                Based on History
              </Text>

            </View>

            <View style={styles.dailyMixHeaderChips}>

              <View
                style={[
                  styles.chipArtwork,
                  { zIndex: 3 },
                ]}
              >
                <FastImage
                  source={{
                    uri: 'https://via.placeholder.com/50/FF5A00/fff?text=R'
                  }}
                  style={styles.chipImage}
                />
              </View>

              <View
                style={[
                  styles.chipArtwork,
                  {
                    zIndex: 2,
                    marginLeft: -12,
                  },
                ]}
              >
                <FastImage
                  source={{
                    uri: 'https://via.placeholder.com/50/555/fff?text=M'
                  }}
                  style={styles.chipImage}
                />
              </View>

              <View
                style={[
                  styles.chipIcon,
                  {
                    zIndex: 1,
                    marginLeft: -12,
                  },
                ]}
              >
                <Music color="#fff" size={16} />
              </View>

            </View>

          </View>

          <View style={styles.songListContainer}>

            {dailyMixSongs.map((song) => (

              <View
                key={song.id}
                style={styles.songItem}
              >

                <View style={styles.songInfo}>

                  <Text
                    style={styles.songTitle}
                    numberOfLines={1}
                  >
                    {song.title}
                  </Text>

                  <Text
                    style={styles.songArtist}
                    numberOfLines={1}
                  >
                    {song.artist}
                  </Text>

                </View>

                <TouchableOpacity style={styles.moreButton}>
                  <MoreVertical color="#888" size={20} />
                </TouchableOpacity>

              </View>

            ))}

            <TouchableOpacity style={styles.checkAllButton}>

              <Text style={styles.checkAllText}>
                Check all of Daily Mix
              </Text>

              <ArrowRight color="#aaa" size={20} />

            </TouchableOpacity>

          </View>

        </View>

        {/* LISTENING STATS */}

        <View style={styles.statsCard}>

          <View style={styles.statsHeader}>

            <View>

              <Text style={styles.statsTitle}>
                Listening stats
              </Text>

              <Text style={styles.statsSubtitle}>
                This Week
              </Text>

            </View>

            <TouchableOpacity style={styles.statsArrowButton}>
              <ArrowRight color="#fff" size={20} />
            </TouchableOpacity>

          </View>

          <View style={styles.statsNumbersRow}>

            <View style={styles.statsNumberCol}>

              <Text style={styles.statsNumberBig}>
                0 s
              </Text>

              <View style={styles.statsLabelsRow}>

                <View>

                  <Text style={styles.statsLabel}>
                    Total plays
                  </Text>

                  <Text style={styles.statsValue}>
                    0
                  </Text>

                </View>

                <View style={{ marginLeft: 60 }}>

                  <Text style={styles.statsLabel}>
                    Avg per day
                  </Text>

                  <Text style={styles.statsValue}>
                    0s
                  </Text>

                </View>

              </View>

            </View>

          </View>

          {/* GRAPH */}

          <View style={styles.graphContainer}>

            {[
              'Mon',
              'Tue',
              'Wed',
              'Thu',
              'Fri',
              'Sat',
              'Sun',
            ].map((day) => (

              <View
                key={day}
                style={styles.graphBarCol}
              >

                <View style={styles.graphBar} />

                <Text style={styles.graphDayText}>
                  {day}
                </Text>

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
    backgroundColor: '#000',
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
    backgroundColor: '#111',
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
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },

  greetingSection: {
    paddingHorizontal: 24,
    marginTop: 18,
  },

  helloText: {
    color: '#777',
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

  waveContainer: {
    width: 265,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
  },

  waveBar: {
    width: 4,
    backgroundColor: '#6D28D9',
    borderRadius: 4,
    marginRight: 3,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 30,
    marginBottom: 10,
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
    backgroundColor: '#151515',
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