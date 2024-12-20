import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from 'expo-status-bar';
import { View, useColorScheme } from 'react-native';
import Index from './screens/HomeScreen';
import Transcripts from './screens/HistoryScreen';
import AccountScreen from './screens/AccountScreen';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
            borderTopWidth: 1,
            borderTopColor: isDark ? '#333333' : '#f0f0f0',
            paddingBottom: 5,
            paddingTop: 5,
            height: 85,
          },
          tabBarActiveTintColor: isDark ? '#60a5fa' : '#007AFF',
          tabBarInactiveTintColor: isDark ? '#6b7280' : '#8E8E93',
          headerStyle: {
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: isDark ? '#ffffff' : '#000000',
          },
        }}
      >
        <Tab.Screen
          name="Record"
          component={Index}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "mic" : "mic-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="History"
          component={Transcripts}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "list" : "list-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
