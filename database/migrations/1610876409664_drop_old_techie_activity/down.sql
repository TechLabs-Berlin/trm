CREATE TABLE old_techie_activity (
  techie_id UUID NOT NULL REFERENCES techies (id) ON DELETE CASCADE,
  year SMALLINT NOT NULL,
  week SMALLINT NOT NULL,
  type TEXT NOT NULL,
  value INTEGER NOT NULL,

  CONSTRAINT old_techie_year_week_type_unique UNIQUE (techie_id, year, week, type)
);

CREATE INDEX old_techie_activity_techie ON old_techie_activity (techie_id);
CREATE INDEX old_techie_activity_year ON old_techie_activity (year);
CREATE INDEX old_techie_activity_type ON old_techie_activity (type);
