CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE techies (
  id UUID NOT NULL DEFAULT uuid_generate_v1(),
  location TEXT NOT NULL REFERENCES locations (value),
  state TEXT NOT NULL REFERENCES techie_lifecycle_states (value),
  semester_id UUID NOT NULL REFERENCES semesters (id),
  project_id UUID REFERENCES projects (id),
  techie_key TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  track TEXT REFERENCES tracks (value),
  application_track_choice TEXT REFERENCES tracks (value),
  notes TEXT,
  assigned_team_member_id UUID REFERENCES team_members (id),
  google_account TEXT,
  github_handle TEXT,
  edyoucated_handle TEXT,
  linkedin_profile_url TEXT,
  slack_member_id TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  age SMALLINT,
  edyoucated_imported_at TIMESTAMP WITHOUT TIME ZONE,
  edyoucated_next_import_after TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  edyoucated_user_id TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT techies_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX techies_id ON techies (id);
CREATE UNIQUE INDEX techies_techie_key ON techies (techie_key);
CREATE INDEX techies_location_state ON techies (location, state);
CREATE INDEX techies_location_techie_key ON techies (location, techie_key);
CREATE INDEX techies_location_semester_state ON techies (location, semester_id, state);
