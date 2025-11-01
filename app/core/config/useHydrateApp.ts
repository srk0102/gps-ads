import { useEffect } from 'react';
import { configService } from './ConfigService';
import { getAppEnv } from '../env/AppEnv';
import { Logger } from '../logger/Logger';
import { AttestationService } from '../../platform/attestation/AttestationService';

const attestationService = new AttestationService();

export const useHydrateApp = (): void => {
  useEffect(() => {
    const env = getAppEnv();
    attestationService
      .collect()
      .then((payload) =>
        configService.refresh({
          deviceId: env.deviceId,
          operatorId: 'unknown',
          class: 'default',
          firmwareVersion: '0.1.0',
          calibrationHash: 'not-set',
          buildFingerprint: payload.buildFingerprint
        })
      )
      .then((config) => {
        Logger.info('CONFIG', 'Hydrated app config', { config });
      })
      .catch((error) => {
        Logger.error('CONFIG', 'Failed to hydrate config', { error });
      });
  }, []);
};
