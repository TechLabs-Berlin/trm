CREATE TABLE techie_activity (
  techie_id UUID NOT NULL REFERENCES techies (id),
  year SMALLINT NOT NULL,
  week SMALLINT NOT NULL,
  type TEXT NOT NULL,
  value INTEGER NOT NULL
);

CREATE INDEX techie_activity_techie ON techie_activity (techie_id)
