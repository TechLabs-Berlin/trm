ALTER TABLE projects ADD assigned_team_member_id UUID REFERENCES team_members (id) ON DELETE SET NULL;
