import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, useColorScheme, Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const { signIn, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // const handleAppleSignIn = async () => {
  //   try {
  //     const credential = await AppleAuthentication.signInAsync({
  //       requestedScopes: [
  //         AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
  //         AppleAuthentication.AppleAuthenticationScope.EMAIL,
  //       ],
  //     });

  //     if (credential.identityToken) {
  //       const { error, data: { user } } = await supabase.auth.signInWithIdToken({
  //         provider: 'apple',
  //         token: credential.identityToken,
  //       });
        
  //       if (error) throw error;
  //       // User is signed in successfully
  //     } else {
  //       throw new Error('No identityToken received');
  //     }
  //   } catch (error: any) {
  //     if (error.code === 'ERR_REQUEST_CANCELED') {
  //       // User canceled the sign-in flow
  //       return;
  //     }
  //     Alert.alert('Error', error.message);
  //   }
  // };

  return (
    <View style={{ 
      flex: 1, 
      padding: 20, 
      justifyContent: 'center',
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff'
    }}>
      <Text style={{ 
        fontSize: 32, 
        fontWeight: '600',
        marginBottom: 24,
        color: isDark ? '#ffffff' : '#000000'
      }}>
        Login
      </Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{
          padding: 15,
          backgroundColor: isDark ? '#2d3748' : '#f7f7f7',
          borderRadius: 8,
          marginBottom: 12,
          color: isDark ? '#ffffff' : '#000000'
        }}
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          padding: 15,
          backgroundColor: isDark ? '#2d3748' : '#f7f7f7',
          borderRadius: 8,
          marginBottom: 24,
          color: isDark ? '#ffffff' : '#000000'
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        <Text style={{ color: '#ffffff', fontWeight: '600' }}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      {/* {Platform.OS === 'ios' && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={{
            height: 50,
            marginTop: 12,
          }}
          onPress={handleAppleSignIn}
        />
      )} */}

      <TouchableOpacity
        onPress={() => navigation.navigate('FirstName')}
        style={{ marginTop: 16, alignItems: 'center' }}
      >
        <Text style={{ color: isDark ? '#60a5fa' : '#007AFF' }}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}