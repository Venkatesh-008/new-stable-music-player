import React from 'react';
import { View, StyleSheet, Modal, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import FolderScreen from '../screens/FolderScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Home, Library, Search, Settings } from 'lucide-react-native';

import MiniPlayer from '../components/MiniPlayer';
import FullPlayerScreen from '../screens/FullPlayerScreen';
import { AudioContext } from '../context/AudioContext';
import { useContext } from 'react';

const Tab = createBottomTabNavigator();
const LibraryStack = createNativeStackNavigator();

function LibraryStackScreen() {
  return (
    <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStack.Screen name="LibraryMain" component={LibraryScreen} />
      <LibraryStack.Screen 
        name="FolderScreen" 
        component={FolderScreen} 
        options={{ animation: 'slide_from_right' }}
      />
    </LibraryStack.Navigator>
  );
}

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: '#0a0a0a',
    text: '#ffffff',
    border: '#1f1f1f',
    primary: '#ffffff',
  },
};

export default function AppNavigator() {
const {
  isFullPlayerOpen,
  currentSong,
} = useContext(AudioContext);

  return (
    <NavigationContainer theme={MyDarkTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#666666',
          tabBarStyle: {
            backgroundColor: '#0D0D0D',
            height: 70,
            borderTopWidth: 1,
            borderTopColor: '#1a1a1a',
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
          tabBarIcon: ({ color, size, focused }) => {
            const iconSize = 24;
            
            if (route.name === 'Home') {
              return <Home color={color} size={iconSize} />;
            } else if (route.name === 'Search') {
              return <Search color={color} size={iconSize} />;
            } else if (route.name === 'Library') {
              return <Library color={color} size={iconSize} />;
            } else if (route.name === 'Settings') {
              return <Settings color={color} size={iconSize} />;
            }
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Library" component={LibraryStackScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      {currentSong && <MiniPlayer />}
      
      <Modal
        visible={isFullPlayerOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {}}
      >
        <FullPlayerScreen />
      </Modal>
    </NavigationContainer>
  );
};
