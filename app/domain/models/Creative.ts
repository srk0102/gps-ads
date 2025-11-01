export type CreativeStatus = 'cached' | 'pending' | 'invalid';

export interface Creative {
  id: string;
  campaignId: string;
  mime: string;
  durationSec: number;
  url: string;
  sha256: string;
  sizeBytes: number;
  status: CreativeStatus;
  localPath?: string;
  ttlSec: number;
  updatedAt: string;
}

export interface CreativeManifestItem {
  id: string;
  campaignId: string;
  url: string;
  sha256: string;
  mime: string;
  durationSec: number;
  ttlSec: number;
}
