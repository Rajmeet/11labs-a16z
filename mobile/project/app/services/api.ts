import OpenAI from 'openai';
import * as FileSystem from 'expo-file-system';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const transcribeAudio = async (base64Audio: string, openAiKey: string): Promise<string> => {
  console.log('🎤 Starting audio transcription...');
  try {
    if (!base64Audio || !openAiKey) {
      throw new Error('Missing required parameters: base64Audio or openAiKey');
    }

    // Create a temporary file path
    const tempUri = FileSystem.documentDirectory + 'temp_audio.wav';
    
    // Write the base64 audio to a file
    await FileSystem.writeAsStringAsync(tempUri, base64Audio, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('📤 Sending audio to Whisper API...');
    const response = await FileSystem.uploadAsync(
      'https://api.openai.com/v1/audio/transcriptions',
      tempUri,
      {
        headers: {
          Authorization: `Bearer ${openAiKey}`,
        },
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        mimeType: 'audio/wav',
        parameters: {
          model: 'whisper-1',
        },
      }
    );

    // Clean up the temporary file
    await FileSystem.deleteAsync(tempUri, { idempotent: true }).catch(err => 
      console.warn('Failed to delete temporary file:', err)
    );

    if (!response.status || response.status !== 200) {
      throw new Error(`Transcription failed with status ${response.status}: ${response.body}`);
    }

    const result = JSON.parse(response.body);
    if (!result.text) {
      throw new Error('No transcription text received from Whisper API');
    }

    console.log('✅ Transcription successful:', result.text);
    return result.text;
  } catch (error) {
    console.error('❌ Transcription error:', error);
    throw error;
  }
};

export const getChatResponse = async (messages: ChatMessage[], openAiKey: string) => {
  console.log('💭 Getting chat response for:', messages[messages.length - 1].content);
  try {
    const openai = new OpenAI({
      apiKey: openAiKey,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const response = completion.choices[0].message.content;
    if (!response) throw new Error('No response from ChatGPT');
    
    console.log('✅ Chat response received:', response);
    return response;
  } catch (error) {
    console.error('❌ Chat response error:', error);
    throw error;
  }
};

export const getVoiceResponse = async (text: string, elevenLabsKey: string) => {
  console.log('🔊 Getting voice response for:', text);
  try {
    const voiceResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
      }),
    });

    if (!voiceResponse.ok) {
      console.error('❌ Voice response failed:', await voiceResponse.text());
      throw new Error('Voice response failed');
    }

    console.log('✅ Voice response received successfully');
    return voiceResponse.arrayBuffer();
  } catch (error) {
    console.error('❌ Voice response error:', error);
    throw error;
  }
};
