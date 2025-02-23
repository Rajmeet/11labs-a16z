import { StyleSheet } from 'react-native';

export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    transform: [{ scale: 1.0 }],
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30',
    transform: [{ scale: 1.1 }],
  },
  transcribedText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 30,
    maxWidth: '90%',
    fontWeight: '300',
  },
  assistantText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 30,
    maxWidth: '90%',
    fontWeight: '300',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  pulsingContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  processingText: {
    color: '#666',
    fontSize: 18,
    marginRight: 10,
  },
  processingDot: {
    color: '#666',
    fontSize: 24,
    opacity: 0.7,
  },
});
