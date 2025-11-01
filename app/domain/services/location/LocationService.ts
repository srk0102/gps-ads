import Geolocation from '@react-native-community/geolocation';
import * as h3 from 'h3-js';
import Config from 'react-native-config';
import { Logger } from '../../../core/logger/Logger';

export interface LocationFix {
  lat: number;
  lon: number;
  speedMps: number;
  h3: string;
}

export class LocationService {
  private readonly h3Resolution: number;

  constructor() {
    this.h3Resolution = Number(Config.H3_RES ?? 9);
  }

  public async getCurrentLocation(): Promise<LocationFix> {
    try {
      const position = await new Promise<Geolocation.GeoPosition>((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 5000
        });
      });

      const { latitude, longitude, speed } = position.coords;
      return {
        lat: latitude,
        lon: longitude,
        speedMps: speed ?? 0,
        h3: h3.latLngToCell(latitude, longitude, this.h3Resolution)
      };
    } catch (error) {
      Logger.warn('DECISION', 'Falling back to zeroed location', { error });
      return {
        lat: 0,
        lon: 0,
        speedMps: 0,
        h3: h3.latLngToCell(0, 0, this.h3Resolution)
      };
    }
  }
}
