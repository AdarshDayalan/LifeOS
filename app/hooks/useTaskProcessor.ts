import { useState } from 'react';
import { apiService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskItem } from '../types';

export const useTaskProcessor = () => {
  const [isProcessingTasks, setIsProcessingTasks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processTranscriptToTasks = async (transcriptText: string) => {
    try {
      setIsProcessingTasks(true);
      setError(null);

      const tasksJson = await apiService.transformToTasks(transcriptText);
      console.log('Tasks JSON:', tasksJson);
      const tasks: TaskItem[] = JSON.parse(tasksJson);

      const timestampedTasks = tasks.map(task => ({
        ...task,
        createdAt: new Date().toISOString()
      }));

      // Save tasks
      const existingTasks = await AsyncStorage.getItem('tasks');
      const allTasks: TaskItem[] = existingTasks 
        ? JSON.parse(existingTasks) 
        : [];

      allTasks.push(...timestampedTasks);
      await AsyncStorage.setItem('tasks', JSON.stringify(allTasks));

      return timestampedTasks;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessingTasks(false);
    }
  };

  return {
    processTranscriptToTasks,
    isProcessingTasks,
    taskProcessorError: error,
  };
}; 