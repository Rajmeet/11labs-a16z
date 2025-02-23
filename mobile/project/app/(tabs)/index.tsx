import { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../hooks/useChat';
import { useAudioRecording } from '../hooks/useAudioRecording';

const { width, height } = Dimensions.get('window');

export default function ChatScreen() {
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [assistantResponse, setAssistantResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const processingDots = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const {
    handleVoiceInput,
    cleanup: cleanupChat,
  } = useChat();

  const {
    isRecording,
    startRecording,
    stopRecording,
    cleanup: cleanupRecording,
  } = useAudioRecording();

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  useEffect(() => {
    if (assistantResponse) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [assistantResponse]);

  useEffect(() => {
    if (isProcessing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(processingDots, {
            toValue: 3,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(processingDots, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      processingDots.setValue(0);
    }
  }, [isProcessing]);

  const handleRecordingToggle = async () => {
    try {
      console.log('🎙 Recording toggle pressed, current state:', isRecording);
      if (isRecording) {
        const base64Audio = await stopRecording();
        if (!base64Audio) {
          throw new Error('No audio data received from recording');
        }

        setIsProcessing(true);
        console.log('🔄 Processing audio...');
        const response = await handleVoiceInput(base64Audio);
        
        if (response) {
          setAssistantResponse(response);
        } else {
          setAssistantResponse('Sorry, I could not process your request. Please try again.');
        }
      } else {
        setTranscribedText('');
        setAssistantResponse('');
        await startRecording();
      }
    } catch (error) {
      console.error('❌ Error in recording toggle:', error);
      setAssistantResponse('Sorry, there was an error processing your request.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      cleanupChat();
      cleanupRecording();
    };
  }, [cleanupChat, cleanupRecording]);

  const renderProcessingDots = () => {
    const dots = '.'.repeat(Math.floor(processingDots.__getValue()));
    return dots;
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <BlurView intensity={20} style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.responseContainer,
            {
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            },
          ]}
        >
          {assistantResponse ? (
            <Text style={styles.responseText}>{assistantResponse}</Text>
          ) : (
            <Text style={styles.placeholderText}>
              {isProcessing ? `Processing${renderProcessingDots()}` : 'Tap the button and start speaking'}
            </Text>
          )}
        </Animated.View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleRecordingToggle}
            style={styles.recordButton}
          >
            <Animated.View
              style={[
                styles.buttonInner,
                {
                  transform: [{ scale: pulseAnim }],
                  backgroundColor: isRecording ? '#e94560' : '#0f3460',
                },
              ]}
            >
              <Ionicons
                name={isRecording ? 'stop' : 'mic'}
                size={32}
                color="#fff"
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </BlurView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  responseContainer: {
    width: width * 0.9,
    marginTop: height * 0.1,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  responseText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginBottom: height * 0.1,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
