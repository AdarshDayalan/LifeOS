import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskItem } from '../types';

interface TaskListProps {
  tasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  isDark: boolean;
}

export default function TaskList({ tasks, setTasks, isDark }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<TaskItem | null>(null);

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTask = async (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const saveEdit = async (index: number) => {
    if (!editedTask) return;
    
    const newTasks = [...tasks];
    newTasks[index] = editedTask;
    setTasks(newTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    setEditingIndex(null);
    setEditedTask(null);
  };

  const deleteTask = async (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <TextInput
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            padding: 15,
            backgroundColor: isDark ? '#2d3748' : '#f7f7f7',
            borderRadius: 8,
            marginBottom: 20,
            color: isDark ? '#ffffff' : '#000000'
          }}
          placeholderTextColor={isDark ? '#718096' : '#a0aec0'}
        />

        {filteredTasks.map((task, index) => (
          <View
            key={index}
            style={{
              backgroundColor: isDark ? '#2d3748' : '#ffffff',
              borderRadius: 12,
              marginBottom: 12,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.25 : 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            {editingIndex === index ? (
              <View>
                <TextInput
                  value={editedTask?.title}
                  onChangeText={(text) => setEditedTask({ ...editedTask!, title: text })}
                  style={{
                    padding: 8,
                    backgroundColor: isDark ? '#374151' : '#f3f4f6',
                    borderRadius: 6,
                    marginBottom: 8,
                    color: isDark ? '#ffffff' : '#000000'
                  }}
                />
                <TextInput
                  value={editedTask?.description}
                  onChangeText={(text) => setEditedTask({ ...editedTask!, description: text })}
                  style={{
                    padding: 8,
                    backgroundColor: isDark ? '#374151' : '#f3f4f6',
                    borderRadius: 6,
                    marginBottom: 8,
                    color: isDark ? '#ffffff' : '#000000'
                  }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingIndex(null);
                      setEditedTask(null);
                    }}
                    style={{
                      padding: 8,
                      backgroundColor: isDark ? '#4B5563' : '#E5E7EB',
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ color: isDark ? '#ffffff' : '#000000' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => saveEdit(index)}
                    style={{
                      padding: 8,
                      backgroundColor: '#3B82F6',
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ color: '#ffffff' }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <TouchableOpacity onPress={() => toggleTask(index)}>
                    <Ionicons
                      name={task.completed ? "checkmark-circle" : "ellipse-outline"}
                      size={24}
                      color={task.completed ? "#10B981" : (isDark ? "#9CA3AF" : "#6B7280")}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 16,
                      fontWeight: '600',
                      color: isDark ? '#ffffff' : '#000000',
                      textDecorationLine: task.completed ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingIndex(index);
                        setEditedTask(task);
                      }}
                    >
                      <Ionicons
                        name="pencil"
                        size={20}
                        color={isDark ? "#9CA3AF" : "#6B7280"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTask(index)}>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text
                  style={{
                    marginLeft: 36,
                    color: isDark ? '#9CA3AF' : '#6B7280',
                    textDecorationLine: task.completed ? 'line-through' : 'none',
                  }}
                >
                  {task.description}
                </Text>
                <Text
                  style={{
                    marginLeft: 36,
                    fontSize: 12,
                    color: isDark ? '#6B7280' : '#9CA3AF',
                    marginTop: 4,
                  }}
                >
                  {new Date(task.createdAt).toLocaleDateString()} {new Date(task.createdAt).toLocaleTimeString()}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
} 