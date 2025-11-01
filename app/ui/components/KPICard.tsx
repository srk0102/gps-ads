import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  value: string;
  caption?: string;
}

export const KPICard: React.FC<Props> = ({ label, value, caption }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#101C33',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  label: {
    color: '#8DB4FF',
    marginBottom: 4
  },
  value: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700'
  },
  caption: {
    color: '#B0C4FF',
    marginTop: 8
  }
});
