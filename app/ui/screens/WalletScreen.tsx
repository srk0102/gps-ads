import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import Config from 'react-native-config';
import { RootStackParamList } from '../../App';
import { WalletTxn } from '../../domain/models/Wallet';
import { useAppStore } from '../state/useAppStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

const WalletScreen: React.FC<Props> = () => {
  const setWalletSummary = useAppStore((state) => state.setWalletSummary);
  const walletSummary = useAppStore((state) => state.walletSummary);
  const [transactions, setTransactions] = useState<WalletTxn[]>([]);

  useEffect(() => {
    const fetchSummary = async () => {
      const response = await axios.get(`${Config.BASE_URL}/v1/wallet/summary`);
      setWalletSummary(response.data);
    };
    fetchSummary().catch(() => {
      // ignore errors in MVP scaffold
    });
  }, [setWalletSummary]);

  useEffect(() => {
    setTransactions([
      {
        id: 'demo-1',
        kind: 'play_payout',
        amountCents: 1250,
        ref: 'slot-complete',
        ts: new Date().toISOString(),
        notes: 'Demo payout'
      }
    ]);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Wallet</Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Balance</Text>
        <Text style={styles.cardValue}>${((walletSummary?.balanceCents ?? 0) / 100).toFixed(2)}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Last 30 days plays</Text>
        <Text style={styles.cardValue}>{walletSummary?.last30d?.plays ?? 0}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent transactions</Text>
        {transactions.map((txn) => (
          <View key={txn.id} style={styles.txnRow}>
            <Text style={styles.txnType}>{txn.kind}</Text>
            <Text style={styles.txnAmount}>${(txn.amountCents / 100).toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#050A15'
  },
  heading: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16
  },
  card: {
    backgroundColor: '#111A2F',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16
  },
  cardLabel: {
    color: '#B0C4FF',
    marginBottom: 8
  },
  cardValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600'
  },
  section: {
    marginTop: 24
  },
  sectionTitle: {
    color: '#B0C4FF',
    fontSize: 18,
    marginBottom: 12
  },
  txnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1D2A44'
  },
  txnType: {
    color: '#E0E8FF'
  },
  txnAmount: {
    color: '#7CFF6B',
    fontWeight: '600'
  }
});

export default WalletScreen;
