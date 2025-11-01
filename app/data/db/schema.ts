export const SCHEMA_VERSION = 1;

export const CREATE_TABLES_SQL: string[] = [
  `CREATE TABLE IF NOT EXISTS device (
    id TEXT PRIMARY KEY,
    operator_id TEXT,
    class TEXT,
    fw_version TEXT,
    calib_hash TEXT,
    created_at TEXT,
    updated_at TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS creative (
    id TEXT PRIMARY KEY,
    campaign_id TEXT,
    mime TEXT,
    duration_sec INTEGER,
    url TEXT,
    sha256 TEXT,
    size_bytes INTEGER,
    status TEXT,
    local_path TEXT,
    ttl_sec INTEGER,
    updated_at TEXT
  );`,
  `CREATE INDEX IF NOT EXISTS idx_creative_status ON creative(status);`,
  `CREATE TABLE IF NOT EXISTS slot_plan (
    id TEXT PRIMARY KEY,
    ad_id TEXT,
    campaign_id TEXT,
    slot_start TEXT,
    slot_len_sec INTEGER,
    decision_token TEXT,
    h3 TEXT,
    lat REAL,
    lon REAL,
    source TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS slot_event (
    id TEXT PRIMARY KEY,
    slot_id TEXT,
    event TEXT,
    ts TEXT,
    lat REAL,
    lon REAL,
    h3 TEXT,
    speed_mps REAL,
    frames_processed INTEGER,
    frames_skipped INTEGER,
    faces_seen INTEGER,
    avg_dwell_sec REAL,
    lighting_ok_ratio REAL,
    median_distance_m REAL,
    conf_avg REAL,
    sys_fps REAL,
    therm_c REAL,
    battery_mv INTEGER,
    sync_state TEXT,
    retry_count INTEGER DEFAULT 0
  );`,
  `CREATE INDEX IF NOT EXISTS idx_slot_event_slot_ts ON slot_event(slot_id, ts);`,
  `CREATE INDEX IF NOT EXISTS idx_slot_event_sync_state ON slot_event(sync_state);`,
  `CREATE TABLE IF NOT EXISTS sync_outbox (
    id TEXT PRIMARY KEY,
    endpoint TEXT,
    payload TEXT,
    ts_enqueued TEXT,
    last_attempt TEXT,
    attempts INTEGER,
    status TEXT,
    error TEXT
  );`,
  `CREATE INDEX IF NOT EXISTS idx_sync_outbox_status_attempt ON sync_outbox(status, last_attempt);`,
  `CREATE TABLE IF NOT EXISTS wallet_txn (
    id TEXT PRIMARY KEY,
    kind TEXT,
    amount_cents INTEGER,
    ref TEXT,
    ts TEXT,
    notes TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS health_sample (
    id TEXT PRIMARY KEY,
    ts TEXT,
    cpu_pct REAL,
    mem_mb REAL,
    therm_c REAL,
    net TEXT,
    gps_fix INTEGER,
    errors TEXT
  );`
];
