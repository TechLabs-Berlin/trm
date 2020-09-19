CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE forms (
  id UUID NOT NULL DEFAULT uuid_generate_v1(),
  location TEXT NOT NULL REFERENCES locations (value),
  form_type TEXT NOT NULL REFERENCES form_types (value),
  semester_id UUID NOT NULL REFERENCES semesters (id),
  typeform_id TEXT NOT NULL,
  typeform_secret UUID NOT NULL DEFAULT uuid_generate_v1(),
  description TEXT,
  webhook_installed_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT forms_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX forms_id ON forms (id);
CREATE UNIQUE INDEX forms_typeform_id ON forms (typeform_id);
CREATE INDEX forms_location ON forms (location, semester_id);
