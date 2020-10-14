ALTER TABLE locations ADD COLUMN export_folder_id TEXT CHECK (export_folder_id <> '');
