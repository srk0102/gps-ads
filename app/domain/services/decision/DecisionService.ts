import axios, { AxiosInstance } from 'axios';
import Config from 'react-native-config';
import { RemoteConfig } from '../../models/Device';

export interface DecisionRequest {
  deviceId: string;
  ts: string;
  lat: number;
  lon: number;
  speedMps: number;
  h3: string;
  slotLenSec?: number;
  deviceClass: string;
  prevAdId: string | null;
}

export interface DecisionResponse {
  adId: string;
  campaignId: string;
  creativeUrl: string;
  creativeSha256: string;
  slotLenSec: number;
  pricePerSlot: number;
  tracking: {
    start: string;
    quartiles: string[];
    complete: string;
  };
  ttlSec: number;
  decisionToken: string;
}

export class DecisionService {
  private readonly client: AxiosInstance;

  constructor(private readonly config: RemoteConfig) {
    this.client = axios.create({
      baseURL: Config.BASE_URL,
      timeout: 10000
    });
  }

  public async requestDecision(payload: DecisionRequest): Promise<DecisionResponse> {
    const normalized = {
      device_id: payload.deviceId,
      ts: payload.ts,
      lat: payload.lat,
      lon: payload.lon,
      speed_mps: payload.speedMps,
      h3: payload.h3,
      slot_len_sec: payload.slotLenSec ?? this.config.slotLenSec,
      device_class: payload.deviceClass,
      prev_ad_id: payload.prevAdId
    };

    const response = await this.client.post('/v1/decision', normalized);
    const data = response.data;
    return {
      adId: data.ad_id ?? data.adId,
      campaignId: data.campaign_id ?? data.campaignId,
      creativeUrl: data.creative_url ?? data.creativeUrl,
      creativeSha256: data.creative_sha256 ?? data.creativeSha256,
      slotLenSec: data.slot_len_sec ?? data.slotLenSec ?? this.config.slotLenSec,
      pricePerSlot: data.price_per_slot ?? data.pricePerSlot ?? 0,
      tracking: {
        start: data.tracking?.start ?? '',
        quartiles: data.tracking?.quartiles ?? [],
        complete: data.tracking?.complete ?? ''
      },
      ttlSec: data.ttl_sec ?? data.ttlSec ?? this.config.slotLenSec,
      decisionToken: data.decision_token ?? data.decisionToken ?? ''
    };
  }
}
