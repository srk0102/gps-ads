import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { PermissionsManager } from '../../platform/permissions/PermissionsManager';

const permissionsManager = new PermissionsManager();

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [cameraGranted, setCameraGranted] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  const requestPermissions = async () => {
    const camera = await permissionsManager.ensure('camera');
    const location = await permissionsManager.ensure('location');
    setCameraGranted(camera);
    setLocationGranted(location);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to GPS Ads</Text>
      <Text style={styles.subtitle}>Register your device and grant permissions to start.</Text>
      <Button title="Grant Permissions" onPress={requestPermissions} />
      <Text style={styles.permission}>Camera: {cameraGranted ? 'granted' : 'pending'}</Text>
      <Text style={styles.permission}>Location: {locationGranted ? 'granted' : 'pending'}</Text>
      <Button title="Start Drive" onPress={() => navigation.navigate('Drive')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#101820'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16
  },
  subtitle: {
    fontSize: 16,
    color: '#C0C0C0',
    textAlign: 'center',
    marginBottom: 24
  },
  permission: {
    color: '#E0E0E0',
    marginTop: 8
  }
});

export default OnboardingScreen;
