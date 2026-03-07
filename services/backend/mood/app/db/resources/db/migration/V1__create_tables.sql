CREATE TABLE moodRecords(
    id UUID PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    moodLevel TEXT NOT NULL
);