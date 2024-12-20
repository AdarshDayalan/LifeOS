import React, { useState } from 'react';
import { View, TouchableOpacity, Text, useColorScheme } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TranscriptsList from '../components/TranscriptsList';
import TaskList from '../components/TaskList';
import { TranscriptItem, TaskItem } from '../types';

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState<'transcripts' | 'tasks'>('transcripts');
  const [savedTranscripts, setSavedTranscripts] = useState<TranscriptItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadSavedData();
    }, [])
  );

  const loadSavedData = async () => {
    try {
      const [savedTranscriptsData, savedTasksData] = await Promise.all([
        AsyncStorage.getItem('transcripts'),
        AsyncStorage.getItem('tasks')
      ]);

      if (savedTranscriptsData) {
        setSavedTranscripts(JSON.parse(savedTranscriptsData));
      }
      if (savedTasksData) {
        setTasks(JSON.parse(savedTasksData));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }}>
      <View style={{ 
        flexDirection: 'row', 
        padding: 12,
        gap: 12,
      }}>
        <TouchableOpacity
          onPress={() => setActiveTab('transcripts')}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            backgroundColor: activeTab === 'transcripts' 
              ? (isDark ? '#3B82F6' : '#60A5FA') 
              : (isDark ? '#374151' : '#F3F4F6'),
            alignItems: 'center',
          }}
        >
          <Text style={{ 
            color: activeTab === 'transcripts' 
              ? '#ffffff' 
              : (isDark ? '#9CA3AF' : '#6B7280'),
            fontWeight: '600',
          }}>
            Transcripts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('tasks')}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            backgroundColor: activeTab === 'tasks' 
              ? (isDark ? '#3B82F6' : '#60A5FA') 
              : (isDark ? '#374151' : '#F3F4F6'),
            alignItems: 'center',
          }}
        >
          <Text style={{ 
            color: activeTab === 'tasks' 
              ? '#ffffff' 
              : (isDark ? '#9CA3AF' : '#6B7280'),
            fontWeight: '600',
          }}>
            Tasks
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'transcripts' ? (
        <TranscriptsList
          savedTranscripts={savedTranscripts}
          setSavedTranscripts={setSavedTranscripts}
          isDark={isDark}
        />
      ) : (
        <TaskList
          tasks={tasks}
          setTasks={setTasks}
          isDark={isDark}
        />
      )}
    </View>
  );
} 