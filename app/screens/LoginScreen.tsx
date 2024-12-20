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
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const passwordInputRef = useRef<TextInput>(null);

  const accentColor = '#007AFF';
  const backgroundColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const subtextColor = isDark ? '#ffffff99' : '#00000099';

  const handleContinue = async () => {
    if (!showPassword) {
      setShowPassword(true);
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
      return;
    }
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });
        if (error) throw error;
      } else {
        throw new Error('No identityToken received');
      }
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') return;
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 40,
      backgroundColor: backgroundColor
    }}>

      {/* Header Section */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 48,
            fontWeight: '700',
            marginBottom: 10,
            color: accentColor,
            letterSpacing: 1,
          }}
        >
          LifeOS
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: subtextColor,
            letterSpacing: 0.5,
          }}
        >
          Your life, organized.
        </Text>
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Bottom Section */}

      <View style={{ width: '100%', marginBottom: 40 }}>
        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={
              isDark
                ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={8}
            style={{
              width: '100%',
              height: 50,
              marginBottom: 10,
            }}
            onPress={handleAppleSignIn}
          />
        )}

              {/* Email Sign-Up Button */}
      <TouchableOpacity
        style={{
          width: '100%',
          backgroundColor: '#2D2D2D',
          height: 50,
          borderRadius: 8,
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => navigation.navigate('EmailLogin')}

      >
        <Ionicons name="mail" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={{ color: '#FFFFFF', fontWeight: '400', fontSize: 20 }}>Continue with Email</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}
