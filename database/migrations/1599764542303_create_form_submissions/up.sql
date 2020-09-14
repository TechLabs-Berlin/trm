CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE form_submissions (
  uuid UUID NOT NULL DEFAULT uuid_generate_v1(),
  form_uuid UUID NOT NULL REFERENCES forms (uuid),
  techie_uuid UUID REFERENCES techies (uuid),
  typeform_response_token TEXT NOT NULL,
  answers jsonb NOT NULL,
  typeform_event jsonb NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT form_submissions_pkey PRIMARY KEY (uuid)
);

CREATE UNIQUE INDEX form_submissions_uuid ON form_submissions (uuid);
CREATE INDEX form_submissions_typeform_response_token ON form_submissions (form_uuid, typeform_response_token);
CREATE INDEX form_submissions_form_uuid ON form_submissions (form_uuid, techie_uuid);
