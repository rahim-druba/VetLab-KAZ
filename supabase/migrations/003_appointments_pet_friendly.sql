-- =============================================================================
-- Appointments: pet-friendly fields (owner, pet name, pet details)
-- Keeps full_name, contact_phone, department for backward compatibility.
-- =============================================================================

ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS owner_name TEXT,
  ADD COLUMN IF NOT EXISTS pet_name TEXT,
  ADD COLUMN IF NOT EXISTS pet_details TEXT;

COMMENT ON COLUMN appointments.owner_name IS 'Pet owner full name';
COMMENT ON COLUMN appointments.pet_name IS 'Pet name';
COMMENT ON COLUMN appointments.pet_details IS 'Pet species, breed, age, or other notes';
