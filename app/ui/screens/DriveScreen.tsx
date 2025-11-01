import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppStore } from '../state/useAppStore';
import { SlotScheduler } from '../../domain/services/scheduler/SlotScheduler';
import { configService } from '../../core/config/ConfigService';
import { Database } from '../../data/db/Database';
import { SlotsRepository } from '../../data/repo/SlotsRepository';
import { DecisionService, DecisionRequest, DecisionResponse } from '../../domain/services/decision/DecisionService';
import { LocationService } from '../../domain/services/location/LocationService';
import { CreativeCacheService } from '../../domain/services/playback/CreativeCacheService';
import { Device, RemoteConfig } from '../../domain/models/Device';
import { getAppEnv } from '../../core/env/AppEnv';
import { AdCanvas } from '../components/AdCanvas';
import { KPICard } from '../components/KPICard';

type Props = NativeStackScreenProps<RootStackParamList, 'Drive'>;

const database = new Database();
const slotsRepository = new SlotsRepository(database);
const locationService = new LocationService();

class DriveDecisionService extends DecisionService {
  constructor(
    config: RemoteConfig,
    private readonly onStatus: (state: 'idle' | 'loading' | 'playing', adId?: string) => void
  ) {
    super(config);
  }

  public async requestDecision(payload: DecisionRequest): Promise<DecisionResponse> {
    this.onStatus('loading');
    const decision = await super.requestDecision(payload);
    this.onStatus('playing', decision.adId);
    return decision;
  }
}

const DriveScreen: React.FC<Props> = ({ navigation }) => {
  const slotSummary = useAppStore((state) => state.slotSummary);
  const setSlotSummary = useAppStore((state) => state.setSlotSummary);
  const [scheduler, setScheduler] = useState<SlotScheduler>();
  const [currentAd, setCurrentAd] = useState<string>();
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle');

  useEffect(() => {
    const env = getAppEnv();
    const config = configService.getConfig();
    const decisionService = new DriveDecisionService(config, (next, ad) => {
      setStatus(next);
      if (ad) {
        setCurrentAd(ad);
        const current = useAppStore.getState().slotSummary;
        setSlotSummary({
          totalSlots: (current?.totalSlots ?? 0) + 1,
          completedSlots: (current?.completedSlots ?? 0) + 1,
          facesDetected: current?.facesDetected ?? 0,
          averageDwellSec: current?.averageDwellSec ?? 0
        });
      }
    });
    const creativeCache = new CreativeCacheService();
    const device: Device = {
      id: env.deviceId,
      operatorId: 'unknown',
      class: 'default',
      firmwareVersion: '0.1.0',
      calibrationHash: 'not-set',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      token: ''
    };

    const slotScheduler = new SlotScheduler(
      device,
      decisionService,
      locationService,
      slotsRepository,
      creativeCache,
      {
        slotLenSec: config.slotLenSec,
        scheduleHorizonSec: config.slotLenSec * 6
      }
    );
    slotScheduler.start();
    setScheduler(slotScheduler);

    return () => {
      slotScheduler.stop();
    };
  }, [setSlotSummary]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Drive Mode</Text>
      <AdCanvas creativeId={currentAd} status={status} />
      <KPICard
        label="Slots Completed"
        value={String(slotSummary?.completedSlots ?? 0)}
        caption="Total completed today"
      />
      <KPICard
        label="Faces Seen"
        value={String(slotSummary?.facesDetected ?? 0)}
        caption="Unique viewers this session"
      />
      <Button title="View Wallet" onPress={() => navigation.navigate('Wallet')} />
      <Button title="Health" onPress={() => navigation.navigate('Health')} />
      <Button title="Stop" onPress={() => scheduler?.stop()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F1C',
    padding: 24,
    justifyContent: 'center'
  },
  heading: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center'
  }
});

export default DriveScreen;
