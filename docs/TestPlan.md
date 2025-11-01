# Test Plan

## Offline Driving
- Simulate a drive session while toggling device network off.
- Verify slot events continue to enqueue and playback loop remains uninterrupted.
- Restore connectivity and confirm sync worker uploads all pending events within five minutes.

## No GPS Fix
- Launch drive mode indoors with GPS disabled.
- Confirm Health screen surfaces GPS pill as not OK and Drive mode displays fallback status.

## No Camera Access
- Deny camera permission during onboarding.
- Ensure Drive mode shows privacy toggle and slot events mark `vision` metrics as zero without crashing.

## Network Flapping
- Alternate device connection between Wi-Fi and airplane mode every minute during a drive session.
- Confirm outbox retry/backoff maintains events without duplication and sync resumes upon reconnection.

## Hot Device Scenario
- Place device in warm environment or use thermal emulator.
- Confirm battery service reduces capture FPS when thermal threshold reached and Health screen displays elevated temperature.
