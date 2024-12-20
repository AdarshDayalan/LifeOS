import { Text, View, Button, TextInput, ScrollView, Animated, TouchableOpacity, Vibration, Platform } from "react-native";
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';
import OpenAI from 'openai';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize OpenAI client
// const openai = new OpenAI({
// });

// Add interface for transcript items
interface TranscriptItem {
  text: string;
  timestamp: string;
}

export default function Index() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [timerId, setTimerId] = useState<number | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [savedTranscripts, setSavedTranscripts] = useState<TranscriptItem[]>([]);

  useEffect(() => {
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [timerId]);

  useEffect(() => {
    if (timeLeft <= 0 && recording) {
      stopRecording();
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
      }
    }
  }, [timeLeft, recording]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [transcription]);

  const saveTranscript = async (text: string) => {
    try {
      const newTranscript: TranscriptItem = {
        text,
        timestamp: new Date().toISOString(),
      };
      setSavedTranscripts(prev => [...prev, newTranscript]);
      
      // Load existing transcripts
      const existingTranscripts = JSON.parse(await AsyncStorage.getItem('transcripts') || '[]');
      // Append new transcript
      existingTranscripts.push(newTranscript);
      // Save updated array
      await AsyncStorage.setItem('transcripts', JSON.stringify(existingTranscripts));
    } catch (error) {
      console.error('Failed to save transcript:', error);
    }
  };

  const startRecording = async () => {
    try {
      Vibration.vibrate(100);
      console.log('Requesting audio permissions...');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Audio permissions granted, starting recording...');

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setTimeLeft(120);

      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      setTimerId(timer as unknown as number);

      console.log('Recording started successfully');
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    Vibration.vibrate([0, 100]);

    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }

    try {
      console.log('Stopping recording...');
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      
      // Create a sound object from the recording
      if (uri) {
        // Automatically start transcription
        await transcribeAudio(uri);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const transcribeAudio = async (uri: string) => {
    try {
      console.log('Starting transcription process...');
      setIsTranscribing(true);

      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'audio/m4a',
        name: 'audio.m4a'
      } as any);
      formData.append('model', 'whisper-1');

      // Make direct fetch request to OpenAI API
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openai.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Transcription received:', result.text);
      setTranscription(result.text);
      
      // Save the transcript
      if (result.text) {
        await saveTranscript(result.text);
      }
    } catch (error) {
      console.error('Failed to transcribe:', error);
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f7ff' }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{
          padding: 24,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 36,
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: 16,
            fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
          }}>
            Brain Dump
          </Text>
          
          <Text style={{
            fontSize: 16,
            color: '#4a5568',
            textAlign: 'center',
            marginBottom: 40,
            lineHeight: 22,
            paddingHorizontal: 20,
          }}>
            Take a moment to freely share your thoughts, goals, and to-dos.
            Nothing is too big or small – just let it flow.
          </Text>

          <TouchableOpacity
            onPress={recording ? stopRecording : startRecording}
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: recording ? '#fc8181' : '#4299e1',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 6,
              transform: [{ scale: recording ? 1.1 : 1 }],
            }}
          >
            <View style={{
              width: recording ? 24 : 34,
              height: recording ? 24 : 34,
              backgroundColor: 'white',
              borderRadius: recording ? 4 : 17,
            }} />
          </TouchableOpacity>

          {recording && (
            <Text style={{ 
              marginTop: 24,
              fontSize: 20,
              color: '#4a5568',
              fontWeight: '500'
            }}>
              {timeLeft}s remaining...
            </Text>
          )}

          {isTranscribing && (
            <Text style={{ 
              marginTop: 30,
              fontSize: 16,
              color: '#4a5568',
              fontWeight: '500'
            }}>
              ✨ Capturing your thoughts...
            </Text>
          )}

          {transcription && (
            <Animated.View 
              style={{ 
                opacity: fadeAnim,
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 20,
                marginTop: 40,
                width: '100%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Text style={{ 
                color: '#4a5568',
                marginBottom: 12,
                fontSize: 18,
                fontWeight: '500'
              }}>
                Your thoughts ✍️
              </Text>
              <Text style={{ 
                color: '#2d3748',
                fontSize: 16,
                lineHeight: 26,
                fontWeight: '400'
              }}>
                {transcription}
              </Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
