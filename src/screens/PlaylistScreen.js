import React, {
  useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Swipeable
from 'react-native-gesture-handler/Swipeable';
import {
  AudioContext,
} from '../context/AudioContext';
import FastImage
from 'react-native-fast-image';

import {
  Music,
} from 'lucide-react-native';

import {
  useQueueHistory,
} from '../context/QueueHistoryContext';

export default function PlaylistScreen({
  navigation,
}) {

  const {
    queues,
    deleteQueue,
  } = useQueueHistory();
  const {
  setIsFullPlayerOpen,
} = useContext(AudioContext);

const renderQueue =
({ item }) => {

  const artwork =
    item.songs?.[0]?.artwork;

  return (

    <Swipeable

      renderRightActions={() => (

        <TouchableOpacity
          style={{
            backgroundColor: '#ff3b30',
            justifyContent: 'center',
            alignItems: 'center',
            width: 90,
            borderRadius: 22,
            marginBottom: 14,
          }}

          onPress={() =>
            deleteQueue(item.id)
          }
        >

          <Text
            style={{
              color: '#fff',
              fontWeight: '700',
            }}
          >
            Delete
          </Text>

        </TouchableOpacity>

      )}

    >

      <TouchableOpacity

        style={styles.card}

        activeOpacity={0.8}

        onPress={() => {

          navigation.navigate(
            'FolderScreen',
            {
              folder: {
                id: item.title,
                title: item.title,
                count:
                  item.songs.length,
                songs:
                  item.songs,
              },
            }
          );

        }}

      >

        {
          artwork ? (

            <FastImage
              source={{
                uri: artwork,
              }}
              style={styles.artwork}
            />

          ) : (

            <View
              style={styles.placeholder}
            >

              <Music
                color="#555"
                size={40}
              />

            </View>

          )
        }

        <View style={styles.info}>

          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <Text
            style={styles.subtitle}
          >
            {item.count ||
              item.songs.length} Songs
          </Text>

        </View>

      </TouchableOpacity>

    </Swipeable>

  );

};
return (

  <View style={styles.container}>

    <Text style={styles.header}>
      Queue Collections
    </Text>

    {
      queues.length === 0 ? (

        <View
          style={styles.emptyContainer}
        >

          <Music
            color="#333"
            size={80}
          />

          <Text
            style={styles.emptyText}
          >
            No Queue History
          </Text>

        </View>

      ) : (

        <FlatList
          data={queues}
          renderItem={renderQueue}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={
            false
          }
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

  header: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 25,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderRadius: 22,
    marginBottom: 14,
    padding: 12,
  },

  artwork: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#111',
  },

  placeholder: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },

  info: {
    marginLeft: 16,
    flex: 1,
  },

  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    color: '#777',
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -100,
  },

  emptyText: {
    color: '#444',
    fontSize: 18,
    marginTop: 18,
  },

});