ALTER TABLE techies ADD COLUMN google_account TEXT;
ALTER TABLE techies ADD COLUMN github_handle TEXT;
ALTER TABLE techies ADD COLUMN edyoucated_handle TEXT;
ALTER TABLE techies ADD COLUMN linkedin_profile_url TEXT;
ALTER TABLE techies ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female'));
ALTER TABLE techies ADD COLUMN age SMALLINT;
