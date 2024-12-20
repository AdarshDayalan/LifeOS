import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { supabase } from '../lib/supabase';

export default function SignUpScreen({ route, navigation }: { route: any, navigation: any }) {
  const { firstName } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // First attempt signup
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
          },
        },
      });

      if (signUpError) throw signUpError;
      
      if (!data.user?.id) {
        throw new Error('Signup successful but user ID not received');
      }

      // Then attempt profile creation
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          first_name: firstName,
          updated_at: new Date(),
        });

      // Don't throw profile error, just log it
      if (profileError) {
        console.warn('Profile creation error:', profileError);
        // Still show success message since auth worked
        Alert.alert(
          'Account Created',
          'Please check your email for verification instructions',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
        return;
      }

      // If everything worked perfectly
      Alert.alert(
        'Success',
        'Please check your email for verification instructions',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

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
        Create Account
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
          marginBottom: 12,
          color: isDark ? '#ffffff' : '#000000'
        }}
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
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
        onPress={handleSignUp}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#93C5FD' : '#007AFF',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: '#ffffff', fontWeight: '600' }}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={{ marginTop: 16, alignItems: 'center' }}
      >
        <Text style={{ color: isDark ? '#60a5fa' : '#007AFF' }}>
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
} 