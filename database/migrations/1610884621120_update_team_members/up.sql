ALTER TABLE team_members ADD COLUMN functional_team TEXT REFERENCES functional_teams (value);
CREATE INDEX team_members_functional_team ON team_members (functional_team);
