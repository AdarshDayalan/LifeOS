import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  useColorScheme,
  Platform,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function EmailLoginScreen({ navigation }: { navigation: any }) {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const passwordInputRef = useRef<TextInput>(null);

  const backgroundColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const subtextColor = isDark ? '#ffffff99' : '#00000099';
  const inputBgColor = isDark ? '#2d3748' : '#f7f7f7';

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: backgroundColor,
      padding: 20,
    }}>
      {/* Back Button */}
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
          zIndex: 1,
        }}
      >
        <Ionicons 
          name="arrow-back" 
          size={24} 
          color={textColor}
        />
      </TouchableOpacity>

      {/* Header */}
      <View style={{ 
        marginTop: 100,
        marginBottom: 40,
      }}>
        <Text style={{
          fontSize: 32,
          fontWeight: '700',
          color: textColor,
          marginBottom: 10,
        }}>
          Welcome back
        </Text>
        <Text style={{
          fontSize: 16,
          color: subtextColor,
        }}>
          Sign in to continue
        </Text>
      </View>

      {/* Input Fields */}
      <View style={{ gap: 16 }}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            backgroundColor: inputBgColor,
            padding: 16,
            borderRadius: 12,
            fontSize: 16,
            color: textColor,
          }}
          placeholderTextColor={subtextColor}
        />

        <View>
          <TextInput
            ref={passwordInputRef}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={{
              backgroundColor: inputBgColor,
              padding: 16,
              borderRadius: 12,
              fontSize: 16,
              color: textColor,
              paddingRight: 50,
            }}
            placeholderTextColor={subtextColor}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 16,
              top: 16,
            }}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color={subtextColor}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity
        onPress={handleSignIn}
        disabled={isLoading}
        style={{
          backgroundColor: '#007AFF',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
          marginTop: 24,
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        <Text style={{
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: '600',
        }}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <TouchableOpacity
        onPress={() => navigation.navigate('FirstName')}
        style={{
          marginTop: 16,
          alignItems: 'center',
        }}
      >
        <Text style={{
          color: isDark ? '#60a5fa' : '#007AFF',
          fontSize: 16,
        }}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
} 