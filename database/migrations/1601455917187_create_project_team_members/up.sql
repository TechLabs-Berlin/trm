CREATE TABLE project_team_members (
  project_id UUID NOT NULL REFERENCES projects (id),
  team_member_id UUID NOT NULL REFERENCES team_members (id)
);

CREATE INDEX project_team_members_project ON project_team_members (project_id);
