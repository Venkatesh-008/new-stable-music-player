import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Headphones, 
  SlidersHorizontal, 
  FolderSearch, 
  Moon, 
  Type, 
  Bell, 
  Clock, 
  PlayCircle, 
  HardDrive, 
  Info,
  ChevronRight
} from 'lucide-react-native';
const SETTINGS_OPTIONS = [
  { id: '1', title: 'Audio Quality', subtitle: 'Hi-Res & Lossless', icon: Headphones },
  { id: '2', title: 'Equalizer', subtitle: 'Custom presets', icon: SlidersHorizontal },
  { id: '3', title: 'Scan Music', subtitle: 'Update media library', icon: FolderSearch },
  { id: '4', title: 'Theme / AMOLED Mode', subtitle: 'True black mode enabled', icon: Moon },
  { id: '5', title: 'Lyrics', subtitle: 'Offline lyrics & syncing', icon: Type },
  { id: '6', title: 'Notifications', subtitle: 'Playback controls & alerts', icon: Bell },
  { id: '7', title: 'Sleep Timer', subtitle: 'Off', icon: Clock },
  { id: '8', title: 'Playback Settings', subtitle: 'Crossfade, Gapless', icon: PlayCircle },
  { id: '9', title: 'Storage & Cache', subtitle: 'Clear cache & manage storage', icon: HardDrive },
  { id: '10', title: 'About App', subtitle: 'Version 1.0.0', icon: Info },
];

export default function SettingsScreen() {
const renderSettingRow = (item, index) => {
      const IconComponent = item.icon;
    
    return (
    <View key={item.id}>
        <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
          <View style={styles.iconWrapper}>
            <IconComponent color="#ffffff" size={20} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle} numberOfLines={1}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle} numberOfLines={1}>{item.subtitle}</Text>
            )}
          </View>
          <ChevronRight color="#666" size={20} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your music experience</Text>
        </View>

<View style={styles.listContainer}>
  {SETTINGS_OPTIONS.map((item, index) =>
    renderSettingRow(item, index)
   )}     
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
    paddingBottom: 100, 
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#888888',
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(155, 81, 224, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSubtitle: {
    color: '#888888',
    fontSize: 13,
  },
});
