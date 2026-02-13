-- =============================================================================
-- Appointments: let logged-in users see their own requests
-- Add email column and RLS policy so dashboard can show recent appointments.
-- =============================================================================

-- Link appointments to user (when submitted while logged in)
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS email TEXT;

COMMENT ON COLUMN appointments.email IS 'Logged-in user email when request was submitted; used so user can see own appointments.';

-- Allow authenticated users to SELECT only their own rows (where email matches)
CREATE POLICY "Users can read own appointments"
  ON appointments FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND email IS NOT NULL
    AND email = (auth.jwt() ->> 'email')
  );
