import React, { useState } from 'react';
import { View, useColorScheme } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TranscriptsList from '../components/TranscriptsList';

interface TranscriptItem {
  text: string;
  timestamp: string;
}

export default function Transcripts() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
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
        const parsedTranscripts = JSON.parse(saved);
        setSavedTranscripts(parsedTranscripts);
      }
    } catch (error) {
      console.error('Failed to load transcripts:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }}>
      <TranscriptsList 
        savedTranscripts={savedTranscripts}
        setSavedTranscripts={setSavedTranscripts}
        isDark={isDark}
      />
    </View>
  );
} 