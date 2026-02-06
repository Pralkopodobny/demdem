CREATE TABLE users(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE moodRecords(
    id UUID PRIMARY KEY,
    userId UUID NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    moodLevel TEXT NOT NULL
);