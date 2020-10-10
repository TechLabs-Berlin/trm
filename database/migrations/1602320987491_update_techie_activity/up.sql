CREATE UNIQUE INDEX techie_activity_unique ON techie_activity (techie_id, year, week, type);
ALTER TABLE techie_activity ADD CONSTRAINT techie_activity_unique UNIQUE USING INDEX techie_activity_unique;
