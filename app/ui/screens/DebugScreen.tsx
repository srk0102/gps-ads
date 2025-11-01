import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { configService } from '../../core/config/ConfigService';
import { storage } from '../../data/kv/AppStorage';

const DebugScreen: React.FC = () => {
  const config = configService.getConfig();

  const exportLogs = () => {
    // Placeholder for exporting logs
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Debug</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Config</Text>
        <Text style={styles.mono}>{JSON.stringify(config, null, 2)}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage keys</Text>
        <Text style={styles.mono}>{JSON.stringify(storage.getAllKeys())}</Text>
      </View>
      <Button title="Export Logs" onPress={exportLogs} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#020914'
  },
  heading: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    color: '#8DB4FF',
    marginBottom: 8
  },
  mono: {
    color: '#E0E0E0',
    fontFamily: 'Courier'
  }
});

export default DebugScreen;
