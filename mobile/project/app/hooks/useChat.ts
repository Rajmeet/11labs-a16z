import { useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useStore } from '../../store';
import { transcribeAudio, getChatResponse, getVoiceResponse, ChatMessage } from '../services/api';

interface ChatError {
  type: 'transcription' | 'chat' | 'voice' | 'audio';
  message: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { openAiKey, elevenLabsKey } = useStore();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [error, setError] = useState<ChatError | null>(null);

  const cleanup = useCallback(async () => {
    if (sound) {
      try {
        await sound.unloadAsync();
        setSound(null);
      } catch (err) {
        console.error('Failed to cleanup sound:', err);
      }
    }
  }, [sound]);

  const playAudioResponse = async (arrayBuffer: ArrayBuffer): Promise<void> => {
    try {
      await cleanup();

      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('Invalid audio buffer received');
      }

      // Create a temporary file to store the audio
      const tempUri = FileSystem.documentDirectory + 'temp_response.mp3';
      
      // Convert ArrayBuffer to Base64
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = '';
      uint8Array.forEach(byte => {
        binary += String.fromCharCode(byte);
      });
      const base64Audio = btoa(binary);

      // Write the audio data to a temporary file
      await FileSystem.writeAsStringAsync(tempUri, base64Audio, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Load and play the audio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: tempUri },
        { shouldPlay: true }
      );
      setSound(newSound);

      // Wait for playback to finish
      await new Promise((resolve, reject) => {
        newSound.setOnPlaybackStatusUpdate(status => {
          if (status.isLoaded && status.didJustFinish) {
            resolve(true);
          }
        });
      });

      // Clean up the temporary file
      await FileSystem.deleteAsync(tempUri, { idempotent: true });
    } catch (error) {
      setError({ type: 'audio', message: 'Failed to play audio response' });
      console.error('Failed to play audio:', error);
    }
  };

  const handleVoiceInput = async (base64Audio: string): Promise<string | null> => {
    try {
      setError(null);
      
      if (!openAiKey || !elevenLabsKey) {
        throw new Error('API keys not configured');
      }

      // Transcribe audio
      const transcribedText = await transcribeAudio(base64Audio, openAiKey);
      
      // Get chat response
      const newMessage: ChatMessage = { role: 'user', content: transcribedText };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      
      const response = await getChatResponse(updatedMessages, openAiKey);
      if (!response) {
        throw new Error('No response received from chat API');
      }

      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);

      // Get voice response
      const audioBuffer = await getVoiceResponse(response, elevenLabsKey);
      await playAudioResponse(audioBuffer);

      return response;
    } catch (error) {
      const chatError: ChatError = {
        type: error instanceof Error && error.message.includes('transcribe') ? 'transcription' :
              error instanceof Error && error.message.includes('chat') ? 'chat' : 'voice',
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      };
      setError(chatError);
      console.error('Error in voice chat:', error);
      return null;
    }
  };

  return {
    messages,
    handleVoiceInput,
    cleanup,
    error,
  };
};
