CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE techies (
  uuid UUID NOT NULL DEFAULT uuid_generate_v1(),
  location TEXT NOT NULL REFERENCES locations (value),
  semester TEXT NOT NULL REFERENCES semesters (value),
  state TEXT NOT NULL REFERENCES techie_lifecycle_states (value),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pkey_tbl PRIMARY KEY (uuid)
);

CREATE INDEX techies_location_semester ON techies (location, semester);
