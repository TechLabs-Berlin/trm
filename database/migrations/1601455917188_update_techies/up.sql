ALTER TABLE techies ADD COLUMN receives_certificate BOOLEAN;
ALTER TABLE techies ADD COLUMN project_id UUID REFERENCES projects (id);
