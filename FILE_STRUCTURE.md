# Final VetLab – File Structure

```
Final VetLab/
├── index.html
├── index.tsx
├── App.tsx
├── constants.tsx          # TRANSLATIONS (EN, KZ, RU), NAV_ITEMS, other config
├── types.ts
├── vite.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
├── .env
├── .env.example
├── .env.local
├── .gitignore
├── README.md
├── metadata.json
├── Landing Page 1.jpg
│
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Assistant.tsx
│   ├── VoiceAssistant.tsx
│   └── AppointmentModal.tsx
│
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   ├── ServiceDetail.tsx
│   ├── Solutions.tsx
│   ├── Technology.tsx
│   ├── InnovationPage.tsx
│   ├── LearningHubPage.tsx
│   ├── VirtualLabPage.tsx
│   ├── Doctors.tsx
│   ├── Patients.tsx
│   ├── News.tsx
│   ├── NewsDetail.tsx
│   ├── Gallery.tsx
│   ├── Reviews.tsx
│   ├── FAQ.tsx
│   ├── Contacts.tsx
│   ├── Cabinet.tsx
│   └── CabinetDashboard.tsx
│
├── lib/
│   ├── supabase.ts
│   ├── AuthContext.tsx
│   ├── appointmentsCache.ts
│   ├── geminiApi.ts
│   ├── apiKey.ts
│   ├── aiModels.ts
│   └── audioUtils.ts
│
├── BG/                     # Image assets
│   └── (many .jpeg, .jpg, .png)
│
├── dist/                   # Vite build output (generated)
│   ├── index.html
│   └── assets/
│
└── supabase/
    ├── README.md
    └── migrations/
        ├── 001_vetlab_schema.sql
        ├── 002_vetlab_rls_and_seed.sql
        ├── 003_appointments_pet_friendly.sql
        ├── 004_appointments_user_visibility.sql
        └── 005_appointments_user_id_visible.sql
```

## Translation system

- **constants.tsx** exports `TRANSLATIONS` with three languages: **EN**, **KZ**, **RU**.
- Each language is an object of keys (e.g. `home`, `about`, `appointment`) and string values.
- Components/pages get the current language from `localStorage.getItem('vetlab_lang')` or default `'EN'`, then use `const t = TRANSLATIONS[lang]` and render `t.someKey` (or `t[someKey]`) for all user-visible text.
- The Header language switcher (KZ / EN / RU) sets `vetlab_lang` and dispatches `languageChange` so the app re-renders in the chosen language.
