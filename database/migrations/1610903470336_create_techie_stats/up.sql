CREATE VIEW techie_stats AS
  SELECT concat_ws('-', location, state) AS id, location, state, COUNT(state) FROM techies GROUP BY location, state;
