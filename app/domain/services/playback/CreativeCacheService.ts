import RNFS from 'react-native-fs';
import Config from 'react-native-config';
import { DecisionResponse } from '../decision/DecisionService';
import { Logger } from '../../../core/logger/Logger';
import { CreativesRepository } from '../../../data/repo/CreativesRepository';
import { Database } from '../../../data/db/Database';
import { Creative } from '../../models/Creative';
import { v4 as uuid } from 'uuid';
import { EventsRepository } from '../../../data/repo/EventsRepository';
import { SlotPlan, SlotEventRecord } from '../../models/Slot';
import { VisionService } from '../vision/VisionService';
import { BatteryService } from '../battery/BatteryService';

const database = new Database();
const creativesRepository = new CreativesRepository(database);
const eventsRepository = new EventsRepository(database);
const visionService = new VisionService();
const batteryService = new BatteryService();

export class CreativeCacheService {
  public async ensureCreativeCached(decision: DecisionResponse): Promise<void> {
    const filePath = `${RNFS.CachesDirectoryPath}/${decision.adId}-${decision.creativeSha256}`;
    const exists = await RNFS.exists(filePath);
    if (!exists) {
      const downloadDest = `${filePath}`;
      Logger.info('PLAYBACK', 'Downloading creative', { id: decision.adId });
      await RNFS.downloadFile({
        fromUrl: `${Config.CDN_BASE}${decision.creativeUrl}`,
        toFile: downloadDest
      }).promise;
    }

    const creative: Creative = {
      id: decision.adId,
      campaignId: decision.campaignId,
      mime: decision.creativeUrl.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
      durationSec: decision.slotLenSec,
      url: decision.creativeUrl,
      sha256: decision.creativeSha256,
      sizeBytes: 0,
      status: 'cached',
      localPath: filePath,
      ttlSec: decision.ttlSec,
      updatedAt: new Date().toISOString()
    };

    await creativesRepository.upsertCreative(creative);
  }

  public async playCreative(slot: SlotPlan, decision: DecisionResponse): Promise<void> {
    const startEvent: SlotEventRecord = {
      id: uuid(),
      slotId: slot.id,
      event: 'start',
      ts: new Date().toISOString(),
      lat: slot.lat,
      lon: slot.lon,
      h3: slot.h3,
      speedMps: 0,
      vision: {
        framesProcessed: 0,
        framesSkipped: 0,
        facesSeen: 0,
        avgDwellSec: 0,
        lightingOkRatio: 0,
        medianDistanceM: 0,
        confAvg: 0
      },
      system: {
        sysFps: 0,
        thermC: 0,
        batteryMv: 0
      },
      syncState: 'pending',
      retryCount: 0
    };

    await eventsRepository.insertEvent(startEvent);

    const vision = await visionService.captureSlotAggregate(slot.id, decision.slotLenSec);
    const battery = await batteryService.sample();

    const completeEvent: SlotEventRecord = {
      id: uuid(),
      slotId: slot.id,
      event: 'complete',
      ts: new Date(Date.now() + decision.slotLenSec * 1000).toISOString(),
      lat: slot.lat,
      lon: slot.lon,
      h3: slot.h3,
      speedMps: 0,
      vision,
      system: {
        sysFps: vision.framesProcessed / Math.max(decision.slotLenSec, 1),
        thermC: battery.thermC,
        batteryMv: battery.batteryMv
      },
      syncState: 'pending',
      retryCount: 0
    };

    await eventsRepository.insertEvent(completeEvent);

    Logger.info('PLAYBACK', 'Playing creative', {
      slotId: slot.id,
      creative: decision.adId
    });
  }
}
