import { supabase } from '../lib/supabase';
import Constants from 'expo-constants';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey;

class ApiService {
  // Auth related API calls
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string, firstName: string) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
        },
      },
    });
  }

  async signOut() {
    return await supabase.auth.signOut();
  }

  // User related API calls
  async deleteUser(userId: string) {
    const response = await fetch(
      `https://soqcvpfsjubmlotakpyg.functions.supabase.co/delete-user`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete account');
    }
    
    return response.json();
  }

  // Transcription related API calls
  async transcribeAudio(audioUri: string) {
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'audio.m4a'
    } as any);
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Add these two methods
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  async transformToTasks(text: string) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: 'You are a helpful assistant that transforms text into actionable tasks in JSON format. Each task should have a title and description. example: [{"title": "Call Brian", "description": "Call Brian to discuss the project"}, {"title": "Take out the trash", "description": "Take out the trash before 10:00 AM"}]'
        }, {
          role: "user",
          content: `Transform this text into tasks: ${text}`
        }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Response:', response);

    const result = await response.json();
    console.log('Result:', result);
    return result.choices[0].message.content;
  }
}

export const apiService = new ApiService(); 