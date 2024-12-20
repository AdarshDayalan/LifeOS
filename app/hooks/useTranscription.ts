import { useState } from 'react';
import { apiService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TranscriptItem {
  text: string;
  timestamp: string;
}

export const useTranscription = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribeAudio = async (audioUri: string) => {
    try {
      setIsTranscribing(true);
      setError(null);
      const result = await apiService.transcribeAudio(audioUri);
      
      // Save transcript with timestamp
      const newTranscript: TranscriptItem = {
        text: result.text,
        timestamp: new Date().toISOString(),
      };

      // Get existing transcripts
      const existingTranscripts = await AsyncStorage.getItem('transcripts');
      const transcripts: TranscriptItem[] = existingTranscripts 
        ? JSON.parse(existingTranscripts) 
        : [];

      // Add new transcript and save
      transcripts.unshift(newTranscript);
      await AsyncStorage.setItem('transcripts', JSON.stringify(transcripts));

      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsTranscribing(false);
    }
  };

  return {
    transcribeAudio,
    isTranscribing,
    error,
  };
}; 