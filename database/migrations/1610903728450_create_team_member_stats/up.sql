CREATE VIEW team_member_stats AS
  SELECT location AS id, COUNT(*) FROM team_members WHERE last_seen_at > current_date - interval '14' day GROUP BY location;
