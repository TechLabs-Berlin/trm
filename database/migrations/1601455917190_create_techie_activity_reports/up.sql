CREATE FUNCTION techie_activity_reports(startdate text, enddate text)
  RETURNS SETOF techie_activity
AS
$body$
  WITH days AS (
    SElECT generate_series(TO_DATE($1, 'YYYY-MM-DD'), TO_DATE($2, 'YYYY-MM-DD'), '1 day'::INTERVAL) AS day
  ), years_and_weeks AS (
    SELECT distinct extract(year from days.day) AS year, extract(week from days.day) AS week FROM days
  ), types AS (
    SELECT DISTINCT type AS type FROM techie_activity WHERE year >= extract(year from TO_DATE($1, 'YYYY-MM-DD')) AND year <= extract(year FROM TO_DATE($2, 'YYYY-MM-DD'))
  ), techies AS (
    SELECT DISTINCT techie_id AS techie_id from techie_activity WHERE year >= extract(year from TO_DATE($1, 'YYYY-MM-DD')) AND year <= extract(year FROM TO_DATE($2, 'YYYY-MM-DD'))
  ), yearly_combinations AS (
    SELECT * FROM years_and_weeks CROSS JOIN types CROSS JOIN techies
  )
  SELECT y.techie_id, y.year::SMALLINT, y.week::SMALLINT, y.type, COALESCE(SUM(t.value), 0)::INTEGER AS value
  FROM yearly_combinations y LEFT JOIN techie_activity t ON y.year = t.year AND y.week = t.week AND y.techie_id = t.techie_id AND y.type = t.type
  GROUP BY y.year, y.week, y.type, y.techie_id
  ORDER BY year ASC, week ASC;
$body$
LANGUAGE SQL STABLE;


