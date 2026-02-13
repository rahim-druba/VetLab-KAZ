# VetLab Supabase Database

This folder contains the SQL schema and seed data for the **VetLab** website, to be used with a Supabase project named **VetLab**.

## Tables created

| Table | Purpose |
|-------|--------|
| `appointments` | Intake / appointment modal submissions (full_name, contact_phone, department) |
| `contact_inquiries` | Contact form submissions (patient_name, contact_phone, message) |
| `departments` | Appointment dropdown options (e.g. Hemodialysis Almaty) |
| `doctors` | Team / Medical Board members |
| `news_articles` | News feed and article detail pages |
| `services` | Services list and service detail pages |
| `solutions` | Solutions page cards (Reference Lab, Clinic Connectivity, Logistics) |
| `instruments` | Technology page instruments |
| `reviews` | Testimonials / reviews |
| `faq_items` | FAQ page items |
| `gallery_images` | Gallery page images |
| `branches` | Regional hubs (Almaty, Astana) |
| `clinic_info` | Global contact info (address, phone, email, hours) |
| `partners` | Partner logos (B.BRAUN, FRESENIUS, etc.) |
| `patient_sections` | Patients page sections (Sample Collection, etc.) |
| `patient_resource_items` | Patients page diet/tips items |
| `learning_resources` | Academy / Learning Hub resources |
| `translations` | Optional EN/KZ/RU copy (CMS) |
| `site_settings` | Key-value site config |

## How to run in Supabase

1. Create a new project at [supabase.com](https://supabase.com) and name it **VetLab** (or any name; the DB name is per-project).

2. In the Supabase dashboard, open **SQL Editor**.

3. Run the migrations in order:
   - First: **`migrations/001_vetlab_schema.sql`** (creates all tables, indexes, triggers).
   - Second: **`migrations/002_vetlab_rls_and_seed.sql`** (enables RLS, adds policies, inserts seed data).

4. Copy each file’s contents into the SQL Editor and click **Run**.

## Row Level Security (RLS)

- **appointments** and **contact_inquiries**: anyone can **INSERT** (form submissions). Only the **service_role** key can SELECT/UPDATE/DELETE (use from your backend or Supabase dashboard).
- All other tables: **SELECT** is allowed for everyone (public read). Writes require the **service_role** key or authenticated admin.

## Connecting the website

1. In the project root, copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. In Supabase Dashboard go to **Project Settings → API**. Copy:
   - **Project URL** → put it in `.env` as `VITE_SUPABASE_URL`
   - **anon public** key → put it in `.env` as `VITE_SUPABASE_ANON_KEY`
3. Save `.env` and restart the dev server (`npm run dev`). The site uses the anon key for form submissions (appointments, contact inquiries).
4. Use the **service_role** key only on a secure backend or in the Supabase Dashboard to view and manage submissions.

## Seed data

The second migration seeds data that matches your current `constants.tsx`: doctors, news, services, solutions, instruments, FAQ, reviews, gallery, branches, clinic info, partners, patient sections, patient resources, and learning resources. Run it once; re-running may create duplicates for tables without unique constraints.
