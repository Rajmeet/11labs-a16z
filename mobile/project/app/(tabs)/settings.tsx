import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { openAiKey, elevenLabsKey } = useStore();

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2a2a2a']}
      style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="key-outline" size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>API Keys</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="logo-github" size={20} color="#fff" />
              <Text style={styles.cardTitle}>OpenAI API Key</Text>
            </View>
            <Text style={styles.apiKey}>
              {openAiKey ? '••••' + openAiKey.slice(-4) : 'Not set'}
            </Text>
            <Text style={styles.status}>Status: Active</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="mic-outline" size={20} color="#fff" />
              <Text style={styles.cardTitle}>ElevenLabs API Key</Text>
            </View>
            <Text style={styles.apiKey}>
              {elevenLabsKey ? '••••' + elevenLabsKey.slice(-4) : 'Not set'}
            </Text>
            <Text style={styles.status}>Status: Active</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>Voice Settings</Text>
          </View>
          
          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Ionicons name="volume-high-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Test Voice</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.version}>Version 1.0.0</Text>
            <Text style={styles.buildInfo}>Build 2025.1.1</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  apiKey: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 8,
  },
  status: {
    color: '#4CAF50',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  version: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  buildInfo: {
    color: '#666',
    fontSize: 14,
  },
});