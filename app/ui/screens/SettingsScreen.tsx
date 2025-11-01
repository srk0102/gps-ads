import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const SettingsScreen: React.FC = () => {
  const [logsEnabled, setLogsEnabled] = React.useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Developer logs</Text>
        <Switch value={logsEnabled} onValueChange={setLogsEnabled} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#0D1628'
  },
  heading: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomColor: '#1F2F4B',
    borderBottomWidth: 1
  },
  label: {
    color: '#E0E8FF',
    fontSize: 18
  }
});

export default SettingsScreen;
