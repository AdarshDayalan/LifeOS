import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TranscriptItem {
  text: string;
  timestamp: string;
}

interface TranscriptsListProps {
  savedTranscripts: TranscriptItem[];
  setSavedTranscripts: (transcripts: TranscriptItem[]) => void;
}

export default function TranscriptsList({ savedTranscripts, setSavedTranscripts }: TranscriptsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const clearTranscripts = async () => {
    try {
      await AsyncStorage.removeItem('transcripts');
      setSavedTranscripts([]);
    } catch (error) {
      console.error('Failed to clear transcripts:', error);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <View style={{
          backgroundColor: '#ffffff',
          borderRadius: 15,
          overflow: 'hidden',
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 15,
            backgroundColor: '#f8f9fa',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#333',
            }}>Previous Recordings</Text>
            <TouchableOpacity
              onPress={clearTranscripts}
              style={{
                padding: 8,
                backgroundColor: '#ff4444',
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white', fontSize: 12 }}>Clear All</Text>
            </TouchableOpacity>
          </View>

          {savedTranscripts.slice().reverse().map((item, index) => (
            <View
              key={index}
              style={{
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
            >
              <Text style={{
                fontSize: 12,
                color: '#666',
                marginBottom: 5,
              }}>
                {formatDate(item.timestamp)}
              </Text>
              <Text style={{
                fontSize: 16,
                color: '#333',
                lineHeight: 24,
              }}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
} 