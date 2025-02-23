import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const { messages, clearMessages } = useStore();

  const conversations = messages.reduce((acc: any[], message) => {
    if (message.role === 'user') {
      acc.push({
        question: message.content,
        timestamp: new Date().toLocaleString(),
      });
    }
    return acc;
  }, []);

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2a2a2a']}
      style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat History</Text>
        <TouchableOpacity
          onPress={clearMessages}
          style={styles.clearButton}
          activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={24} color="#ff3b30" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={conversations}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <View style={styles.questionContainer}>
              <Ionicons name="chatbubble-outline" size={20} color="#007AFF" style={styles.icon} />
              <Text style={styles.questionText} numberOfLines={2}>
                {item.question}
              </Text>
            </View>
            <View style={styles.timestampContainer}>
              <Ionicons name="time-outline" size={16} color="#666" style={styles.icon} />
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  clearButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  historyItem: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  questionText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  timestamp: {
    color: '#666',
    fontSize: 14,
  },
});