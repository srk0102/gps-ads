import { Logger } from '../../../core/logger/Logger';

export interface VisionAggregate {
  framesProcessed: number;
  framesSkipped: number;
  facesSeen: number;
  avgDwellSec: number;
  lightingOkRatio: number;
  medianDistanceM: number;
  confAvg: number;
}

export class VisionService {
  public async captureSlotAggregate(slotId: string, durationSec: number): Promise<VisionAggregate> {
    Logger.debug('VISION', 'Capturing vision aggregate', { slotId, durationSec });
    return {
      framesProcessed: 0,
      framesSkipped: 0,
      facesSeen: 0,
      avgDwellSec: 0,
      lightingOkRatio: 0,
      medianDistanceM: 0,
      confAvg: 0
    };
  }
}
