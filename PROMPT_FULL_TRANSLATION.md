# Prompt: Full translation (EN / KZ / RU) for VetLab

Use this prompt to make sure **every** user-visible word in the web app is translatable and works in **English**, **Russian**, and **Kazakh**.

---

## Copy-paste prompt

```
This is a Vite + React + TypeScript app (VetLab) with three languages: EN (English), KZ (Kazakh), RU (Russian).

**Goal:** Ensure every user-visible string in the application is translatable. When the user switches language (KZ / EN / RU in the header), every piece of text on the site must change to that language — no hardcoded English, Russian, or Kazakh in components or pages.

**How translation works:**
- `constants.tsx` exports `TRANSLATIONS` with three keys: `EN`, `KZ`, `RU`. Each is an object of string keys and string values (e.g. `home: 'Home'`, `about: 'About'`).
- In each component/page that shows UI text:
  1. Get current language: `const lang = useState(localStorage.getItem('vetlab_lang') || 'EN')` and listen for `languageChange` to update it.
  2. Get strings: `const t = TRANSLATIONS[lang]`.
  3. Use only `t.someKey` or `t[someKey]` for every user-visible string (labels, buttons, headings, placeholders, table headers, messages, errors, success text, etc.). No raw English/Russian/Kazakh strings in JSX.

**What you must do:**
1. **Audit** every file under `components/` and `pages/` (and `App.tsx` if it has visible text). Find every hardcoded string that a user can see (including placeholders, aria-labels, button text, headings, table headers, form labels, error/success messages, empty states, "Back to Home", etc.).
2. **Add missing keys** to `constants.tsx`: for each such string, add a new key to all three objects `TRANSLATIONS.EN`, `TRANSLATIONS.KZ`, and `TRANSLATIONS.RU` with the correct translation. Use camelCase keys (e.g. `petOwnerName`, `requestReceived`, `sendRequest`).
3. **Replace hardcoded strings** in the codebase with `t.newKey` (and ensure the component has `lang`, `t` from TRANSLATIONS as above). If a component does not yet read `lang` or `t`, add the logic (useState for lang, useEffect for 'languageChange', and `const t = TRANSLATIONS[lang]`).
4. **Keep parity:** Every key that exists in `TRANSLATIONS.EN` must exist in `TRANSLATIONS.KZ` and `TRANSLATIONS.RU` with the proper translation. No missing keys in any language.

**Files to check (no exceptions):**
- components/Header.tsx, Footer.tsx, Assistant.tsx, VoiceAssistant.tsx, AppointmentModal.tsx
- pages/Home.tsx, About.tsx, Services.tsx, ServiceDetail.tsx, Solutions.tsx, Technology.tsx, InnovationPage.tsx, LearningHubPage.tsx, VirtualLabPage.tsx, Doctors.tsx, Patients.tsx, News.tsx, NewsDetail.tsx, Gallery.tsx, Reviews.tsx, FAQ.tsx, Contacts.tsx, Cabinet.tsx, CabinetDashboard.tsx
- App.tsx (if any visible text)

**Special cases:**
- Dropdown options (e.g. service types in AppointmentModal) must also be keys in TRANSLATIONS (e.g. `serviceGeneralCheckup`, `serviceVaccination`, …) and rendered as `t.serviceGeneralCheckup`, etc., with options built from those keys for the current language.
- Error or success messages (e.g. "Failed to submit. Please try again.", "Request Received") must be keys and translated.
- Table headers (e.g. "Owner", "Pet", "Service", "Date") must be keys (e.g. `owner`, `pet`, `service`, `date`) and translated.
- Placeholders (e.g. "Your full name", "Pet's name") must be keys and translated.
- Do not rename existing translation keys that are already used; only add new keys for strings that are currently hardcoded. Use existing keys where they already exist (e.g. `t.contactPhone`, `t.appointment`).

**Result:** After your changes, switching between KZ, EN, and RU in the header must change every visible word on the site to the selected language, with no strings left in only one language.
```

---

## Summary

- **One source of truth:** All UI copy lives in `constants.tsx` under `TRANSLATIONS.EN`, `TRANSLATIONS.KZ`, `TRANSLATIONS.RU`.
- **No hardcoded copy** in components or pages — only `t.keyName`.
- **Same keys in all three languages** — add any new key to EN, KZ, and RU with correct translations.
- Use this prompt whenever you add new UI text or discover strings that are still not translated.
