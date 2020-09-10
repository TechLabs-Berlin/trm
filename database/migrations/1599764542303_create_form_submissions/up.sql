CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE form_submissions (
  uuid UUID NOT NULL DEFAULT uuid_generate_v1(),
  form_uuid UUID NOT NULL REFERENCES forms (uuid),
  techie_uuid UUID REFERENCES techies (uuid),
  answers jsonb NOT NULL,
  typeform_event jsonb NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT form_submissions_pkey PRIMARY KEY (uuid)
);
