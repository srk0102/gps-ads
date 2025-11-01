import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingScreen from './ui/screens/OnboardingScreen';
import DriveScreen from './ui/screens/DriveScreen';
import WalletScreen from './ui/screens/WalletScreen';
import HealthScreen from './ui/screens/HealthScreen';
import SettingsScreen from './ui/screens/SettingsScreen';
import DebugScreen from './ui/screens/DebugScreen';
import { useHydrateApp } from './core/config/useHydrateApp';
import { AppStateGate } from './ui/components/AppStateGate';

export type RootStackParamList = {
  Onboarding: undefined;
  Drive: undefined;
  Wallet: undefined;
  Health: undefined;
  Settings: undefined;
  Debug: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  useHydrateApp();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppStateGate>
          <Stack.Navigator
            initialRouteName="Onboarding"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Drive" component={DriveScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Screen name="Health" component={HealthScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Debug" component={DebugScreen} />
          </Stack.Navigator>
        </AppStateGate>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
