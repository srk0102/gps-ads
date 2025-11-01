# GPS Ads React Native App

This project scaffolds the MVP for a kiosk-style React Native application that plays advertisement slots, counts anonymous viewers via on-device vision, stores telemetry offline, and syncs data when connectivity is available.

## Project Structure

```
app/
  core/             // configuration, environment, logging utilities
  data/             // SQLite schema, repositories, sync workers, MMKV helpers
  domain/           // models and service implementations for scheduling, vision, playback
  ui/               // navigation stack, screens, shared components, state store
  platform/         // platform-specific service stubs (future work)
```

Supporting documents and tooling live in the repository root and `docs/`.

## Getting Started

1. Install dependencies: `yarn install`.
2. Copy `.env.example` to `.env` and fill in backend endpoints and device identifiers.
3. Start the Metro bundler: `yarn start`.
4. In a separate terminal run `yarn android` or `yarn ios`.

Ensure the React Native CLI and platform SDKs are available locally.

## Tooling

- **TypeScript** for static typing.
- **SQLite** (`react-native-sqlite-storage`) for durable offline persistence.
- **MMKV** for fast key-value storage.
- **Zustand** for lightweight global state.
- **Axios** for REST integrations.

## Documentation

Refer to [`docs/TestPlan.md`](docs/TestPlan.md) for manual validation scenarios covering offline resilience, sensor failures, and thermal throttling behaviour.
