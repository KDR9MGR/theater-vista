-- Add time_slots column to theater_screens table
ALTER TABLE theater_screens 
ADD COLUMN time_slots JSONB DEFAULT '[]'::jsonb;

-- Add comment to describe the column
COMMENT ON COLUMN theater_screens.time_slots IS 'JSON array containing time slot information with start_time, end_time, and is_available fields';