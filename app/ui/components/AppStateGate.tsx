import React, { PropsWithChildren, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppStore } from '../state/useAppStore';

export const AppStateGate: React.FC<PropsWithChildren> = ({ children }) => {
  const setAppState = useAppStore((state) => state.setAppState);

  useEffect(() => {
    const handler = (status: AppStateStatus) => {
      setAppState(status);
    };

    const subscription = AppState.addEventListener('change', handler);
    setAppState(AppState.currentState);

    return () => {
      subscription.remove();
    };
  }, [setAppState]);

  return <>{children}</>;
};
