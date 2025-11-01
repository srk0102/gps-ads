import { AppStateStatus } from 'react-native';
import { create } from 'zustand';
import { SlotSummary } from '../../domain/models/Slot';
import { WalletSummary } from '../../domain/models/Wallet';
import { HealthStatus } from '../../domain/models/Health';

interface AppState {
  appState: AppStateStatus;
  slotSummary: SlotSummary | null;
  walletSummary: WalletSummary | null;
  healthStatus: HealthStatus | null;
  setAppState: (state: AppStateStatus) => void;
  setSlotSummary: (summary: SlotSummary) => void;
  setWalletSummary: (summary: WalletSummary) => void;
  setHealthStatus: (status: HealthStatus) => void;
}

export const useAppStore = create<AppState>((set) => ({
  appState: 'active',
  slotSummary: null,
  walletSummary: null,
  healthStatus: null,
  setAppState: (state) => set({ appState: state }),
  setSlotSummary: (summary) => set({ slotSummary: summary }),
  setWalletSummary: (summary) => set({ walletSummary: summary }),
  setHealthStatus: (status) => set({ healthStatus: status })
}));
