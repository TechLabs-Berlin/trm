CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE techies (
  uuid UUID NOT NULL DEFAULT uuid_generate_v1(),
  location TEXT NOT NULL REFERENCES locations (value),
  semester TEXT NOT NULL REFERENCES semesters (value),
  state TEXT NOT NULL REFERENCES techie_lifecycle_states (value),
  techie_key TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT techies_pkey PRIMARY KEY (uuid)
);

CREATE UNIQUE INDEX techies_uuid ON techies (uuid);
CREATE UNIQUE INDEX techies_techie_key ON techies (techie_key);
CREATE INDEX techies_location_semester_state ON techies (location, semester, state);
