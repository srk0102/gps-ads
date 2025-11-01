import { AppState } from 'react-native';
import { Logger } from '../../core/logger/Logger';

export class ForegroundService {
  private started = false;

  public start(): void {
    if (this.started) {
      return;
    }
    this.started = true;
    Logger.info('APP', 'Foreground service started', { state: AppState.currentState });
  }

  public stop(): void {
    if (!this.started) {
      return;
    }
    this.started = false;
    Logger.info('APP', 'Foreground service stopped');
  }
}
