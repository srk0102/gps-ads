import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { useAppStore } from '../state/useAppStore';
import { HealthStatusPill } from '../../domain/models/Health';
import { StatusPill } from '../components/StatusPill';

const HealthScreen: React.FC = () => {
  const healthStatus = useAppStore((state) => state.healthStatus);
  const setHealthStatus = useAppStore((state) => state.setHealthStatus);

  useEffect(() => {
    const pills: HealthStatusPill[] = [
      { label: 'GPS', ok: true, description: 'GPS fix acquired' },
      { label: 'Network', ok: false, description: 'Offline for demo' },
      { label: 'Camera', ok: true, description: 'Camera streaming' },
      { label: 'Storage', ok: true, description: 'Sufficient space' }
    ];
    setHealthStatus({ pills });
  }, [setHealthStatus]);

  const sendDiagnostics = async () => {
    await axios.post(`${Config.BASE_URL}/v1/health`, {
      device_id: Config.DEVICE_ID,
      ts: new Date().toISOString(),
      cpu_pct: 0,
      therm_c: 0,
      gps_ok: true,
      net: 'wifi',
      errors: []
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Health</Text>
      <View style={styles.pillsContainer}>
        {healthStatus?.pills.map((pill) => (
          <StatusPill key={pill.label} label={pill.label} ok={pill.ok} />
        ))}
      </View>
      <Button title="Send Diagnostics" onPress={sendDiagnostics} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#04101F'
  },
  heading: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24
  }
});

export default HealthScreen;
