ALTER TABLE team_members DROP CONSTRAINT team_members_email;
ALTER TABLE team_members ALTER COLUMN description SET NOT NULL;
