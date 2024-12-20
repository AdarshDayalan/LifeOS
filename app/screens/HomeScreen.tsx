import { Text, View, TouchableOpacity, Alert, useColorScheme } from "react-native";
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';
import { useTranscription } from '../hooks/useTranscription';

export default function HomeScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const { transcribeAudio, isTranscribing, error } = useTranscription();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (recording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      setTimer(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recording]);

  useEffect(() => {
    if (timeLeft <= 0 && recording) {
      stopRecording();
    }
  }, [timeLeft, recording]);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      setTimeLeft(10);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording');
    }
  }

  async function stopRecording() {
    if (!recording) return;

    try {
      if (timer) clearInterval(timer);
      setTimer(null);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        const result = await transcribeAudio(uri);
        Alert.alert('Success', 'Audio transcribed successfully!');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  }

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff'
    }}>
      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        style={{
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: recording ? '#ef4444' : '#007AFF',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: isTranscribing ? 0.7 : 1,
        }}
        disabled={isTranscribing}
      >
        <Text style={{ 
          color: '#ffffff', 
          fontSize: 18, 
          fontWeight: '600' 
        }}>
          {recording ? `Stop Recording (${timeLeft}s)` : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      {isTranscribing && (
        <Text style={{ 
          marginTop: 20,
          color: isDark ? '#ffffff' : '#000000'
        }}>
          Transcribing...
        </Text>
      )}
    </View>
  );
}
