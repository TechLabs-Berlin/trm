CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE techies (
  id UUID NOT NULL DEFAULT uuid_generate_v1(),
  location TEXT NOT NULL REFERENCES locations (value),
  state TEXT NOT NULL REFERENCES techie_lifecycle_states (value),
  semester_id UUID NOT NULL REFERENCES semesters (id),
  techie_key TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT techies_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX techies_id ON techies (id);
CREATE UNIQUE INDEX techies_techie_key ON techies (techie_key);
CREATE INDEX techies_location_state ON techies (location, state);
CREATE INDEX techies_location_techie_key ON techies (location, techie_key);
CREATE INDEX techies_location_semester_state ON techies (location, semester_id, state);
