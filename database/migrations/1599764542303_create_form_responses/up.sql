CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE form_responses (
  id UUID NOT NULL DEFAULT uuid_generate_v1(),
  form_id UUID NOT NULL REFERENCES forms (id),
  techie_id UUID REFERENCES techies (id),
  typeform_response_token TEXT NOT NULL,
  answers jsonb NOT NULL,
  typeform_event jsonb NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT form_responses_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX form_responses_id ON form_responses (id);
CREATE INDEX form_responses_typeform_response_token ON form_responses (form_id, typeform_response_token);
CREATE INDEX form_responses_form_id ON form_responses (form_id, techie_id);
