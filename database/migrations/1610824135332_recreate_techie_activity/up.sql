CREATE TABLE techie_activity (
  techie_id UUID NOT NULL REFERENCES techies (id) ON DELETE CASCADE,
  semester_id UUID NOT NULL REFERENCES semesters (id) ON DELETE SET NULL,
  semester_week SMALLINT NOT NULL,
  type TEXT NOT NULL,
  value INTEGER NOT NULL,

  CONSTRAINT techie_semester_week_type_unique UNIQUE (techie_id, semester_id, semester_week, type)
);

CREATE INDEX techie_activity_techie ON techie_activity (techie_id);
CREATE INDEX techie_activity_semester ON techie_activity (semester_id);
CREATE INDEX techie_activity_type ON techie_activity (type);
