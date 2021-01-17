CREATE FUNCTION techie_semester_activity_reports(semester_id uuid)
  RETURNS SETOF techie_activity
AS
$body$
  SELECT r.techie_id, r.year, r.week, r.type, r.value
  FROM semesters s
  LEFT JOIN LATERAL techie_activity_reports(s.starts_at::text, s.ends_at::text) r ON true
  WHERE s.id = semester_id AND s.starts_at IS NOT NULL and s.ends_at IS NOT NULL
$body$
LANGUAGE SQL STABLE;

CREATE FUNCTION techie_semester_activity_report_digest(semester_id uuid)
  RETURNS TEXT
AS
$body$
  SELECT encode(digest(array_to_json(ARRAY_AGG(row_to_json(t)))::text, 'md5'), 'hex')
  FROM (
    SELECT techie_semester_activity_reports(semester_id)
  ) t
$body$
LANGUAGE SQL STABLE;

CREATE FUNCTION techie_semester_activity_pending_exports()
  RETURNS SETOF exports
AS
$body$
WITH semester_export_base AS (
	SELECT 'techie_semester_activity' AS name, id AS type FROM semesters WHERE starts_at IS NOT NULL AND ends_at IS NOT NULL
), semester_digests AS (
	SELECT name, type, techie_semester_activity_report_digest(b.type) AS digest FROM semester_export_base b
), semester_existing_digests AS (
	SELECT name, type::text, digest FROM semester_digests WHERE digest IS NOT NULL
) SELECT d.name, d.type, d.digest, 'now()'::timestamp AS exported_at FROM semester_existing_digests d LEFT JOIN exports e ON d.name = e.name AND d.type = e.type AND d.digest = e.digest WHERE e.digest IS NULL;
$body$
LANGUAGE SQL STABLE;
