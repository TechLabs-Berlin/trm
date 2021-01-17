ALTER TABLE team_members ADD CONSTRAINT team_members_email UNIQUE (email);
ALTER TABLE team_members ALTER COLUMN description DROP NOT NULL;
