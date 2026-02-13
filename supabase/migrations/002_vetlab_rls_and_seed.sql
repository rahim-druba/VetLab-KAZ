-- =============================================================================
-- VetLab: Row Level Security (RLS) and Seed Data
-- Run after 001_vetlab_schema.sql
-- =============================================================================

-- =============================================================================
-- ROW LEVEL SECURITY
-- Public read for content tables; only service role / auth can write.
-- =============================================================================

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_resource_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Appointments: anyone can insert (form submit); only service_role can read/update/delete
CREATE POLICY "Allow insert appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role full access appointments" ON appointments FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Contact inquiries: anyone can insert; only service_role can read/update/delete
CREATE POLICY "Allow insert contact_inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role full access contact_inquiries" ON contact_inquiries FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Content tables: public read (SELECT) for active content, full access for service role
CREATE POLICY "Public read doctors" ON doctors FOR SELECT USING (is_active = true);
CREATE POLICY "Public read news_articles" ON news_articles FOR SELECT USING (is_published = true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read solutions" ON solutions FOR SELECT USING (is_active = true);
CREATE POLICY "Public read instruments" ON instruments FOR SELECT USING (is_active = true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public read faq_items" ON faq_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public read gallery_images" ON gallery_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public read branches" ON branches FOR SELECT USING (is_active = true);
CREATE POLICY "Public read clinic_info" ON clinic_info FOR SELECT USING (true);
CREATE POLICY "Public read partners" ON partners FOR SELECT USING (is_active = true);
CREATE POLICY "Public read patient_sections" ON patient_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Public read patient_resource_items" ON patient_resource_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public read learning_resources" ON learning_resources FOR SELECT USING (is_active = true);
CREATE POLICY "Public read translations" ON translations FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read departments" ON departments FOR SELECT USING (is_active = true);

-- =============================================================================
-- SEED DATA (optional – matches your current constants)
-- =============================================================================

-- Departments (appointment dropdown)
INSERT INTO departments (name, sort_order) VALUES
  ('Hemodialysis Almaty', 1),
  ('Hemodialysis Astana', 2),
  ('Nephrology Consultation', 3)
ON CONFLICT (name) DO NOTHING;

-- Partners
INSERT INTO partners (name, sort_order) VALUES
  ('B.BRAUN', 1),
  ('FRESENIUS', 2),
  ('BAXTER', 3),
  ('NIKKISO', 4)
ON CONFLICT (name) DO NOTHING;

-- Clinic info (single row; run once)
INSERT INTO clinic_info (id, address, phone, email, hours) VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Almaty, 230 Rozybakiyeva St.', '+7 (700) 123-4567', 'info@vetlab.kz', 'Mon-Sat: 08:00 - 20:00')
ON CONFLICT (id) DO UPDATE SET address = EXCLUDED.address, phone = EXCLUDED.phone, email = EXCLUDED.email, hours = EXCLUDED.hours, updated_at = NOW();

-- Branches (no unique on name in schema; insert once)
INSERT INTO branches (name, address, phone, sort_order)
SELECT 'VetLab Kaz Almaty', 'Rozybakiyeva St. 230', '+7 (700) 123-4567', 1
WHERE NOT EXISTS (SELECT 1 FROM branches WHERE name = 'VetLab Kaz Almaty');
INSERT INTO branches (name, address, phone, sort_order)
SELECT 'VetLab Kaz Astana', 'Mangilik El Ave. 55', '+7 (701) 987-6543', 2
WHERE NOT EXISTS (SELECT 1 FROM branches WHERE name = 'VetLab Kaz Astana');

-- FAQ (no unique key; run seed once or use application to manage)
INSERT INTO faq_items (question, answer, sort_order) VALUES
  ('How do I submit a sample for testing?', 'You can submit samples via our authorized couriers or visit our Almaty central intake office. Please ensure samples are labeled correctly according to our protocol.', 1),
  ('Are you certified for international exports?', 'Yes, our laboratory is OIE-compliant and our results are accepted for international veterinary certificates.', 2),
  ('What technology do you use for analysis?', 'We exclusively use the latest generation of B.Braun and Bio-Rad diagnostic equipment.', 3);

-- Reviews
INSERT INTO reviews (name, text, rating, date, is_approved) VALUES
  ('Askar M.', 'Best veterinary lab in Kazakhstan. The results are extremely precise and delivered fast. Very professional.', 5, 'February 2024', true),
  ('Gulnara T.', 'Thank you Dr. Alibi for his expert analysis. The accuracy of the diagnostic report saved my pet.', 5, 'January 2024', true),
  ('Vadim K.', 'Clean, sterile, and professional. The specimen logistics are perfect.', 5, 'March 2024', true);

-- Gallery (URLs from your constants)
INSERT INTO gallery_images (url, title, sort_order) VALUES
  ('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200', 'Molecular Diagnostics Wing', 1),
  ('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200', 'Sample Processing Center', 2),
  ('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200', 'Main Research Lab', 3),
  ('https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200', 'Sterile Intake Room', 4);

-- News articles
INSERT INTO news_articles (slug, title, date, summary, image, is_published) VALUES
  ('oie-accreditation', 'VetLab Kaz Achieves OIE Accreditation', '2024-04-20', 'Our Almaty center has officially received world-class certification for veterinary pathology research.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', true),
  ('genetic-testing-purebred', 'New Genetic Testing for Purebred Animals', '2024-04-12', 'VetLab launches its most advanced DNA panel for screening hereditary diseases in livestock and pets.', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800', true),
  ('partnership-regional-clinics', 'Partnership with Regional Clinics Expands Diagnostic Access', '2024-03-28', 'VetLab Kaz signs agreements with 15 partner clinics across Kazakhstan to provide centralized pathology and biochemistry services with same-day courier logistics.', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800', true)
ON CONFLICT (slug) DO NOTHING;

-- Doctors (Team)
INSERT INTO doctors (name, specialty, experience, education, image, sort_order) VALUES
  ('Dr. Alibi Kuanyshuly', 'Lab Director / Chief Pathologist', '18 years', 'Almaty Veterinary Institute, International Vet-Path Association Member', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=500', 1),
  ('Dr. Saule Ahmetova', 'Head of Molecular Diagnostics', '15 years', 'Astana Agricultural University, Specialization in Genomic Science (Germany)', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=500', 2),
  ('Dr. Serik Omarov', 'Clinical Biochemist', '12 years', 'Kazakh National Veterinary University', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400&h=500', 3),
  ('Dr. Aigerim Nurlanova', 'Senior Veterinary Pathologist', '14 years', 'Karaganda Medical University, OIE Pathology Certification', NULL, 4),
  ('Dr. Daniyar Zhakypov', 'Immunology & Serology Lead', '10 years', 'Nazarbayev University, PhD in Veterinary Immunology', NULL, 5),
  ('Dr. Madina Sarsenova', 'Histology & Cytology Specialist', '11 years', 'Al-Farabi University, European Board Certified', NULL, 6);

-- Solutions
INSERT INTO solutions (title, description, icon, features, sort_order) VALUES
  ('Reference Lab Services', 'Over 500 specialized diagnostic tests with expert veterinary pathologist interpretation.', 'FlaskConical', '["Biochemistry", "Histopathology", "Endocrinology", "Immunology"]'::jsonb, 1),
  ('Clinic Connectivity', 'Digital integration of your clinic management system with our lab for seamless data transfer.', 'Share2', '["API Integration", "Online Portal", "Secure PDF Reports", "Historical Trending"]'::jsonb, 2),
  ('Logistics Network', 'Temperature-controlled specimen transport across Kazakhstan regions.', 'Truck', '["Cold-chain assurance", "Daily pickups", "Satellite hubs", "24h Turnaround"]'::jsonb, 3);

-- Instruments (Technology)
INSERT INTO instruments (name, type, specs, description, image, sort_order) VALUES
  ('Bio-Rad CFX Opus', 'Real-Time PCR System', '["96-well detection", "Multiplex capability", "Thermal gradient accuracy"]'::jsonb, 'The gold standard in molecular detection of infectious diseases and genetic markers.', 'https://images.unsplash.com/photo-1579165466541-71822477c056?auto=format&fit=crop&q=80&w=800', 1),
  ('B.Braun Dialog+', 'Hemodialysis System', '["Continuous monitoring", "Sterile ultrafiltration", "Automated data logging"]'::jsonb, 'Advanced blood purification system utilized for acute renal failure management in small animals.', 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800', 2),
  ('Abaxis V-Smart', 'Biochemical Analyzer', '["Rapid results < 12min", "Micro-sample technology", "Full diagnostic panels"]'::jsonb, 'High-speed biochemistry processing for critical care and emergency triage.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', 3);

-- Services
INSERT INTO services (slug, title, description, icon, details, features, full_content, sort_order) VALUES
  ('diagnostics', 'Veterinary Diagnostics', 'High-tech lab purification and analysis using modern diagnostic equipment for complex animal cases.', 'Activity', '["Biochemical Analysis", "Hematology", "Molecular Diagnostics", "Cytology"]'::jsonb, '["High-flux automated analysis systems", "Real-time sample monitoring", "Disposable sterile consumables", "Individual selection of diagnostic protocols"]'::jsonb, 'Our laboratory provides comprehensive diagnostic services using the latest generation of veterinary equipment. We ensure a high degree of accuracy thanks to modern processing systems that meet international OIE standards.', 1),
  ('research', 'Advanced Research', 'Specialized methods for investigating rare veterinary pathologies.', 'Layers', '["Genetic Testing", "Viral Loads", "Cycle Sequencing", "24/7 Monitoring"]'::jsonb, '["Initial training for research partners", "Selection of individual study regimens", "Regular laboratory monitoring of data adequacy", "Remote monitoring for automated sequencing"]'::jsonb, 'Our research division focuses on emerging zoonotic threats and chronic veterinary conditions, offering both manual and automated analysis support.', 2),
  ('consultation', 'Expert Consultation', 'Diagnosis and management of complex pathology across multiple animal species.', 'HeartPulse', '["Expert Pathologists", "Chronic Disease Mapping", "Specimen Logistics", "Dietary Science"]'::jsonb, '["Comprehensive diagnosis of primary pathologies", "Preparation of specimens for international review", "Management of rare veterinary cases", "Treatment of secondary complications"]'::jsonb, 'Our pathologists are experts in managing complex cases of infectious diseases and metabolic disorders in animals.', 3),
  ('laboratory', 'Laboratory Services', 'Full range of clinical laboratory and instrumental examinations.', 'Clipboard', '["USG Support", "Biochemistry", "Clinical Tests", "Endocrinology"]'::jsonb, '["High-precision molecular analysis", "Dopplerography for small and large animals", "Complete range of biochemical markers", "Hormonal and immunological studies"]'::jsonb, 'Accurate diagnosis is the foundation of effective veterinary treatment. Our laboratory equipment ensures rapid and precise results for critical markers.', 4)
ON CONFLICT (slug) DO NOTHING;

-- Patient sections
INSERT INTO patient_sections (slug, title, description, icon, content, sort_order) VALUES
  ('prep', 'Sample Collection', 'Protocol for collecting various veterinary specimens.', 'Info', 'Ensure sterile collection containers are used and transport temperature is maintained as per diagnostic type.', 1),
  ('rights', 'Provider Rights', 'Confidentiality and ethical standards for data management.', 'Shield', 'Full compliance with data protection laws and international veterinary ethics.', 2),
  ('diet', 'Special Protocols', 'Requirements for fasting or specific pre-testing conditions.', 'Utensils', 'Certain biochemical tests require 12-hour fasting for accurate metabolic baseline readings.', 3)
ON CONFLICT (slug) DO NOTHING;

-- Patient resource items (diet + tips)
INSERT INTO patient_resource_items (category, title, description, sort_order) VALUES
  ('diet', 'Fasting Requirements', '12-hour fasting required for glucose and lipid profiles.', 1),
  ('diet', 'Temperature Control', 'Specimens must be stored at 2-8°C during transit.', 2),
  ('diet', 'Labeling Standard', 'All vials must have species, age, and owner information.', 3),
  ('diet', 'Turnaround Time', 'Standard clinical results delivered within 24 hours.', 4);

INSERT INTO patient_resource_items (category, tip_text, sort_order) VALUES
  ('tips', 'Use only provided VetLab sterile containers.', 1),
  ('tips', 'Double-bag all hazardous bio-specimens.', 2),
  ('tips', 'Include complete clinical history with submission form.', 3),
  ('tips', 'Schedule courier pickup before 14:00 for same-day processing.', 4);

-- Learning resources (Academy)
INSERT INTO learning_resources (type, title, duration, date, sort_order) VALUES
  ('Webinar', 'Molecular Diagnostics in Renal Failure', '45 mins', 'March 2024', 1),
  ('White Paper', 'Advances in Canine Genomic Screening', '12 pages', 'Feb 2024', 2),
  ('Guide', 'Sample Collection Protocol: Avian Pathology', 'Digital Doc', 'Jan 2024', 3),
  ('Case Study', 'Rare Zoonotic Outbreak: Almaty Region', '8 mins read', 'Dec 2023', 4);
