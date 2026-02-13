-- =============================================================================
-- Appointments: use user_id + auth.uid() so dashboard can fetch per-user data
-- Run in Supabase SQL Editor. Then "Recent requests" will show for logged-in users.
-- =============================================================================

-- Link each row to the auth user who created it
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS user_id UUID;

COMMENT ON COLUMN appointments.user_id IS 'Auth user id when submitted; RLS uses this so user sees only own appointments.';

-- Policy so users see rows where user_id matches (reliable; used for new inserts)
CREATE POLICY "Users can read own appointments by user_id"
  ON appointments FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND user_id IS NOT NULL
    AND user_id = auth.uid()
  );

-- Backfill: set user_id on existing rows so they show for the right user (run once)
UPDATE appointments a
SET user_id = u.id
FROM auth.users u
WHERE a.email = u.email AND (a.user_id IS NULL OR a.user_id <> u.id);
