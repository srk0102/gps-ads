import { formatISO } from 'date-fns';
import { SlotPlan } from '../../models/Slot';
import { Device } from '../../models/Device';
import { DecisionService } from '../decision/DecisionService';
import { LocationService } from '../location/LocationService';
import { SlotsRepository } from '../../../data/repo/SlotsRepository';
import { CreativeCacheService } from '../playback/CreativeCacheService';
import { v4 as uuid } from 'uuid';
import { Logger } from '../../../core/logger/Logger';

export interface SlotSchedulerOptions {
  slotLenSec: number;
  scheduleHorizonSec: number;
}

export class SlotScheduler {
  private timer?: ReturnType<typeof setInterval>;
  private readonly slotLenSec: number;

  constructor(
    private readonly device: Device,
    private readonly decisionService: DecisionService,
    private readonly locationService: LocationService,
    private readonly slotsRepository: SlotsRepository,
    private readonly creativeCache: CreativeCacheService,
    options: SlotSchedulerOptions
  ) {
    this.slotLenSec = options.slotLenSec;
  }

  public start(): void {
    if (this.timer) {
      return;
    }

    Logger.info('DECISION', 'Slot scheduler started', { slotLenSec: this.slotLenSec });
    void this.runSlot();
    this.timer = setInterval(async () => {
      await this.runSlot();
    }, this.slotLenSec * 1000);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
      Logger.info('DECISION', 'Slot scheduler stopped');
    }
  }

  private async runSlot(): Promise<void> {
    const location = await this.locationService.getCurrentLocation();
    const prevSlot = await this.slotsRepository.getLastSlotPlan();
    const decision = await this.decisionService.requestDecision({
      deviceId: this.device.id,
      ts: new Date().toISOString(),
      lat: location.lat,
      lon: location.lon,
      speedMps: location.speedMps,
      h3: location.h3,
      slotLenSec: this.slotLenSec,
      deviceClass: this.device.class,
      prevAdId: prevSlot?.adId ?? null
    });

    await this.creativeCache.ensureCreativeCached(decision);

    const slotPlan: SlotPlan = {
      id: uuid(),
      adId: decision.adId,
      campaignId: decision.campaignId,
      slotStart: formatISO(new Date()),
      slotLenSec: decision.slotLenSec,
      decisionToken: decision.decisionToken,
      h3: location.h3,
      lat: location.lat,
      lon: location.lon,
      source: 'decided'
    };

    await this.slotsRepository.insertSlotPlan(slotPlan);
    await this.slotsRepository.recordSlotScheduled(slotPlan, decision.pricePerSlot);
    await this.creativeCache.playCreative(slotPlan, decision);
  }
}
