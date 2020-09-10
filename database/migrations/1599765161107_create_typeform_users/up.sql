CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE typeform_users (
  uuid UUID NOT NULL DEFAULT uuid_generate_v1(),
  location TEXT NOT NULL REFERENCES locations (value),
  email TEXT NOT NULL,
  token TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT typeform_users_pkey PRIMARY KEY (uuid)
);

CREATE UNIQUE INDEX typeform_users_location_unique ON typeform_users (location);
