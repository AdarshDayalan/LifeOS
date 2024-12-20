import { View, Text, TouchableOpacity, Alert, useColorScheme, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { supabase } from '../lib/supabase';

export default function AccountScreen() {
  const { signOut, user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              const { data: { user } } = await supabase.auth.getUser();
              if (!user?.id) throw new Error('No user found');
              
              await apiService.deleteUser(user.id);
              await signOut();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView 
      style={{ 
        flex: 1, 
        backgroundColor: isDark ? '#1a1a1a' : '#ffffff'
      }}
      contentContainerStyle={{
        padding: 20,
      }}
    >
      {/* Profile Header */}
      <View style={{
        backgroundColor: isDark ? '#2d3748' : 'white',
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.25 : 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: isDark ? '#4a5568' : '#e2e8f0',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}>
            <Ionicons 
              name="person" 
              size={40} 
              color={isDark ? '#a0aec0' : '#718096'}
            />
          </View>
          <Text style={{ 
            fontSize: 24,
            fontWeight: '600',
            color: isDark ? '#ffffff' : '#1a202c',
            marginBottom: 4,
            fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
          }}>
            {user?.user_metadata?.first_name || user?.user_metadata?.full_name || 'User'}
          </Text>
          <Text style={{ 
            fontSize: 16,
            color: isDark ? '#a0aec0' : '#718096',
          }}>
            {user?.email}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{ gap: 12 }}>
        <TouchableOpacity 
          onPress={handleSignOut}
          disabled={isSigningOut}
          style={{
            backgroundColor: isDark ? '#3182ce' : '#4299e1',
            opacity: isSigningOut ? 0.7 : 1,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.25 : 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons 
            name="log-out-outline" 
            size={24} 
            color="white" 
            style={{ marginRight: 8 }}
          />
          <Text style={{ 
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
          }}>
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          disabled={isDeleting}
          style={{
            backgroundColor: '#ef4444',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            opacity: isDeleting ? 0.7 : 1,
            flexDirection: 'row',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.25 : 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons 
            name="trash-outline" 
            size={24} 
            color="white" 
            style={{ marginRight: 8 }}
          />
          <Text style={{ 
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
          }}>
            {isDeleting ? 'Deleting Account...' : 'Delete Account'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}