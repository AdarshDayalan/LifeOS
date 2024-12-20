import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

export default function FirstNameScreen({ navigation }: { navigation: any }) {
  const [firstName, setFirstName] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleContinue = () => {
    if (firstName.trim()) {
      navigation.navigate('SignUp', { firstName });
    }
  };

  return (
    <View style={{ 
      flex: 1, 
      padding: 20, 
      justifyContent: 'flex-start',
      paddingTop: '50%',
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff'
    }}>
      <Text style={{ 
        fontSize: 32, 
        fontWeight: '600',
        marginBottom: 24,
        color: isDark ? '#ffffff' : '#000000'
      }}>
        What's your name?
      </Text>
      
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        onSubmitEditing={handleContinue}
        style={{
          padding: 15,
          backgroundColor: isDark ? '#2d3748' : '#f7f7f7',
          borderRadius: 8,
          marginBottom: 24,
          color: isDark ? '#ffffff' : '#000000'
        }}
        autoFocus
        returnKeyType="done"
      />

      <TouchableOpacity
        onPress={handleContinue}
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
          opacity: firstName.trim() ? 1 : 0.5
        }}
        disabled={!firstName.trim()}
      >
        <Text style={{ color: '#ffffff', fontWeight: '600' }}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
} 