import React from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { useMostPlayed }
from '../context/MostPlayedContext';

const MostPlayedScreen = () => {

  const {
    getMostPlayedSongs,
  } = useMostPlayed();

  const songs =
    getMostPlayedSongs();

  return (

    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
      }}
    >

      <Text
        style={{
          color: '#fff',
          fontSize: 28,
          fontWeight: 'bold',
          marginTop: 20,
          marginLeft: 20,
          marginBottom: 20,
        }}
      >
        Most Played
      </Text>

      <FlatList
        data={songs}
        keyExtractor={(item) =>
          item.id.toString()
        }

        renderItem={({ item, index }) => (

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#111',
            }}
          >

            <Text
              style={{
                color: '#888',
                width: 40,
                fontSize: 18,
              }}
            >
              #{index + 1}
            </Text>

            <View style={{ flex: 1 }}>

              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: '600',
                }}
                numberOfLines={1}
              >
                {item.title}
              </Text>

              <Text
                style={{
                  color: '#666',
                  marginTop: 4,
                }}
              >
                {item.artist}
              </Text>

            </View>

            <Text
              style={{
                color: '#1DB954',
                fontWeight: 'bold',
              }}
            >
              {item.playCount} Plays
            </Text>

          </TouchableOpacity>

        )}
      />

    </View>
  );
};

export default MostPlayedScreen;