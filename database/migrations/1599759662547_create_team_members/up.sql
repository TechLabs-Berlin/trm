CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE team_members (
  id UUID NOT NULL DEFAULT uuid_generate_v1(),
  location TEXT NOT NULL REFERENCES locations (value),
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT team_members_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX team_members_id ON team_members (id);
CREATE INDEX team_members_location ON team_members (location);
