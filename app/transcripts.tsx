import React, { useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TranscriptsList from '../components/TranscriptsList';

interface TranscriptItem {
  text: string;
  timestamp: string;
}

export default function Transcripts() {
  const [savedTranscripts, setSavedTranscripts] = useState<TranscriptItem[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadSavedTranscripts();
    }, [])
  );

  const loadSavedTranscripts = async () => {
    try {
      const saved = await AsyncStorage.getItem('transcripts');
      if (saved) {
        console.log('Saved transcripts:', saved);
        const parsedTranscripts = JSON.parse(saved);
        console.log('Loaded transcripts:', parsedTranscripts);
        setSavedTranscripts(parsedTranscripts);
      }
    } catch (error) {
      console.error('Failed to load transcripts:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <TranscriptsList 
        savedTranscripts={savedTranscripts}
        setSavedTranscripts={setSavedTranscripts}
      />
    </View>
  );
} 