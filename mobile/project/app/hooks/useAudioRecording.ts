import { useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface RecordingError {
  message: string;
}

export const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<RecordingError | null>(null);
  const recording = useRef<Audio.Recording | null>(null);

  const cleanup = useCallback(async () => {
    try {
      if (recording.current) {
        await recording.current.stopAndUnloadAsync();
        recording.current = null;
      }
    } catch (err) {
      console.warn('Warning during cleanup:', err);
    }
    setIsRecording(false);
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      await cleanup();

      // Request permissions
      console.log('📱 Requesting audio permissions...');
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        throw new Error('Audio recording permission not granted');
      }

      // Prepare recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create and start recording with WAV format
      console.log('🎙 Starting recording...');
      const { recording: newRecording } = await Audio.Recording.createAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/wav',
          bitsPerSecond: 128000,
        },
      });
      
      recording.current = newRecording;
      setIsRecording(true);

      // Haptic feedback
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      console.log('✅ Recording started');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start recording';
      setError({ message });
      console.error('❌ Failed to start recording:', err);
      await cleanup();
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording.current) {
        throw new Error('No recording in progress');
      }

      console.log('🛑 Stopping recording...');
      await recording.current.stopAndUnloadAsync();
      const uri = recording.current.getURI();
      
      if (!uri) {
        throw new Error('No recording URI available');
      }

      console.log('📁 Reading audio file...');
      const audioData = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Clean up
      await FileSystem.deleteAsync(uri, { idempotent: true });
      await cleanup();

      console.log('✅ Recording processed successfully');
      return audioData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to stop recording';
      setError({ message });
      console.error('❌ Failed to stop recording:', err);
      await cleanup();
      return null;
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    cleanup,
    error,
  };
};
