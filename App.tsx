import React, { useEffect } from 'react';
import { MostPlayedProvider } from './src/context/MostPlayedContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { AudioProvider } from './src/context/AudioContext';
import { setupPlayer } from './src/player';
import {
  PlaylistProvider,
} from './src/context/PlaylistContext';
import {
  QueueHistoryProvider,
} from './src/context/QueueHistoryContext';

const App = () => {

useEffect(() => {

  const initializePlayer =
    async () => {

      try {

        setTimeout(async () => {

          await setupPlayer();

          console.log(
            'TrackPlayer initialized'
          );

        }, 1000);

      } catch (error) {

        console.log(
          'TrackPlayer setup error:',
          error
        );

      }

    };

  initializePlayer();

}, []);

  return (
    <QueueHistoryProvider>
   <PlaylistProvider>
  <MostPlayedProvider>
    <AudioProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </AudioProvider>
   </MostPlayedProvider>
</PlaylistProvider>
</QueueHistoryProvider>
  );
};

export default App;