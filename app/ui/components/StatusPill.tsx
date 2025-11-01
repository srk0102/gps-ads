import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  ok: boolean;
}

export const StatusPill: React.FC<Props> = ({ label, ok }) => {
  return (
    <View style={[styles.pill, { backgroundColor: ok ? '#6BFF95' : '#FF6B6B' }]}> 
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8
  },
  text: {
    color: '#04101F',
    fontWeight: '600'
  }
});
