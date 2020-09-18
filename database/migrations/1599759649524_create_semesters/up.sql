CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE semesters (
  id UUID NOT NULL DEFAULT uuid_generate_v1(),
  location TEXT NOT NULL REFERENCES locations (value),
  description TEXT NOT NULL,
  starts_at TIMESTAMP WITHOUT TIME ZONE,
  ends_at TIMESTAMP WITHOUT TIME ZONE,
  application_period_ends_at TIMESTAMP WITHOUT TIME ZONE,
  academy_phase_ends_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT semesters_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX semesters_id ON semesters (id);
CREATE INDEX semesters_location ON semesters (location);
