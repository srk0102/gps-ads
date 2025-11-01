import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  creativeId?: string;
  status: 'idle' | 'loading' | 'playing';
}

export const AdCanvas: React.FC<Props> = ({ creativeId, status }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status.toUpperCase()}</Text>
      {creativeId ? <Text style={styles.creative}>Creative: {creativeId}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1C2A44',
    backgroundColor: '#060F21',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  status: {
    color: '#7CFF6B',
    fontSize: 18,
    fontWeight: '700'
  },
  creative: {
    color: '#B0C4FF',
    marginTop: 8
  }
});
