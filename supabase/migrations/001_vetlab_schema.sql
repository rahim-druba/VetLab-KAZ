-- =============================================================================
-- VetLab Database Schema for Supabase
-- Run this in your Supabase project (SQL Editor) after creating project "VetLab"
-- =============================================================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. APPOINTMENTS (Intake / Appointment modal submissions)
-- =============================================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  department TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_created_at ON appointments(created_at DESC);
CREATE INDEX idx_appointments_status ON appointments(status);

-- =============================================================================
-- 2. CONTACT_INQUIRIES (Contacts page form submissions)
-- =============================================================================
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX idx_contact_inquiries_status ON contact_inquiries(status);

-- =============================================================================
-- 3. DEPARTMENTS (for appointment dropdown: Hemodialysis Almaty, etc.)
-- =============================================================================
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 4. DOCTORS (Team / Medical Board)
-- =============================================================================
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  experience TEXT,
  education TEXT,
  image TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_doctors_sort_order ON doctors(sort_order);

-- =============================================================================
-- 5. NEWS_ARTICLES
-- =============================================================================
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  summary TEXT NOT NULL,
  body TEXT,
  image TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_news_articles_date ON news_articles(date DESC);
CREATE INDEX idx_news_articles_slug ON news_articles(slug);
CREATE INDEX idx_news_articles_published ON news_articles(is_published) WHERE is_published = true;

-- =============================================================================
-- 6. SERVICES (Veterinary Diagnostics, Advanced Research, etc.)
-- =============================================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  details JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  full_content TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_sort_order ON services(sort_order);
CREATE INDEX idx_services_slug ON services(slug);

-- =============================================================================
-- 7. SOLUTIONS (Reference Lab Services, Clinic Connectivity, Logistics)
-- =============================================================================
CREATE TABLE IF NOT EXISTS solutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  features JSONB DEFAULT '[]',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_solutions_sort_order ON solutions(sort_order);

-- =============================================================================
-- 8. INSTRUMENTS (Technology page: Bio-Rad, B.Braun, Abaxis, etc.)
-- =============================================================================
CREATE TABLE IF NOT EXISTS instruments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  specs JSONB DEFAULT '[]',
  description TEXT NOT NULL,
  image TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_instruments_sort_order ON instruments(sort_order);

-- =============================================================================
-- 9. REVIEWS (Testimonials)
-- =============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  date TEXT,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- =============================================================================
-- 10. FAQ_ITEMS
-- =============================================================================
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_faq_items_sort_order ON faq_items(sort_order);

-- =============================================================================
-- 11. GALLERY_IMAGES
-- =============================================================================
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  title TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gallery_images_sort_order ON gallery_images(sort_order);

-- =============================================================================
-- 12. BRANCHES (Regional hubs: VetLab Almaty, Astana)
-- =============================================================================
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_branches_sort_order ON branches(sort_order);

-- =============================================================================
-- 13. CLINIC_INFO (Global contact info: one row or key-value)
-- =============================================================================
CREATE TABLE IF NOT EXISTS clinic_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address TEXT,
  phone TEXT,
  email TEXT,
  hours TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 14. PARTNERS (B.BRAUN, FRESENIUS, BAXTER, NIKKISO)
-- =============================================================================
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_partners_sort_order ON partners(sort_order);

-- =============================================================================
-- 15. PATIENT_SECTIONS (Patients page: Sample Collection, Provider Rights, etc.)
-- =============================================================================
CREATE TABLE IF NOT EXISTS patient_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  content TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_patient_sections_sort_order ON patient_sections(sort_order);

-- =============================================================================
-- 16. PATIENT_RESOURCE_ITEMS (diet/tips for Patients page)
-- =============================================================================
CREATE TABLE IF NOT EXISTS patient_resource_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN ('diet', 'tips')),
  title TEXT,
  description TEXT,
  tip_text TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_patient_resource_items_category ON patient_resource_items(category);
CREATE INDEX idx_patient_resource_items_sort ON patient_resource_items(category, sort_order);

-- =============================================================================
-- 17. LEARNING_RESOURCES (Academy: Webinars, White Papers, Guides)
-- =============================================================================
CREATE TABLE IF NOT EXISTS learning_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  duration TEXT,
  date TEXT,
  url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_learning_resources_type ON learning_resources(type);
CREATE INDEX idx_learning_resources_sort_order ON learning_resources(sort_order);

-- =============================================================================
-- 18. TRANSLATIONS (optional CMS for EN/KZ/RU copy)
-- =============================================================================
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lang TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lang, key)
);

CREATE INDEX idx_translations_lang_key ON translations(lang, key);

-- =============================================================================
-- 19. SITE_SETTINGS (key-value for global config)
-- =============================================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- TRIGGERS: updated_at
-- =============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_appointments BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_updated_at_contact_inquiries BEFORE UPDATE ON contact_inquiries FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_updated_at_doctors BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_updated_at_news_articles BEFORE UPDATE ON news_articles FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_updated_at_services BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_updated_at_solutions BEFORE UPDATE ON solutions FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_updated_at_instruments BEFORE UPDATE ON instruments FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_updated_at_reviews BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_updated_at_faq_items BEFORE UPDATE ON faq_items FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_updated_at_branches BEFORE UPDATE ON branches FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_updated_at_clinic_info BEFORE UPDATE ON clinic_info FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_updated_at_patient_sections BEFORE UPDATE ON patient_sections FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_updated_at_learning_resources BEFORE UPDATE ON learning_resources FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_updated_at_translations BEFORE UPDATE ON translations FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_updated_at_site_settings BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
