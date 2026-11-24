# 🎓 Masar — Smart Course Recommendation System
### Frontend — Graduation Project | 5th Year

> **Masar** is an intelligent course recommendation platform that helps students discover the most suitable Coursera courses based on their academic background, interests, and goals — powered by a machine learning backend and a modern Next.js frontend.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Font | Geist (via `next/font`) |
| Mock API | JSON Server (`db.json`) |
| Linting | ESLint |

---

## 📁 Project Structure

```
Graduation_project_5th/
├── public/               # Static assets (images, icons)
├── src/
│   ├── app/              # Next.js App Router pages & layouts
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions & API helpers
│   └── types/            # TypeScript type definitions
├── db.json               # Mock database for local API (JSON Server)
├── next.config.ts        # Next.js configuration
├── tailwind.config.*     # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── eslint.config.mjs     # ESLint configuration
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Sanako2003/Graduation_project_5th.git
cd Graduation_project_5th

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# 4. (Optional) Run the mock API server in a separate terminal
npx json-server --watch db.json --port 3001
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 🔗 Integration with Backend (Laravel)

The frontend communicates with the **Masar Laravel backend** via REST API.

- Set the backend base URL in your environment file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

- During development without the backend, `db.json` + JSON Server simulates API responses on port `3001`.

---

## 🚧 Challenges & Solutions

This section documents the real obstacles we faced during development and how we overcame them.

---

### ⚠️ Challenge 1 — TypeScript Strict Mode Errors

**Problem:** TypeScript's strict mode flagged many implicit `any` types and null-safety issues, causing build failures, especially when consuming API responses whose shape wasn't always guaranteed.

**Solution:**
- Defined dedicated TypeScript interfaces for all API response shapes inside `src/types/`.
- Used optional chaining (`?.`) and nullish coalescing (`??`) to handle undefined/null cases safely.
- Created a typed `fetchCourses()` wrapper so all API calls returned strongly-typed data.

---

### ⚠️ Challenge 2 — CORS Errors with Laravel Backend

**Problem:** When calling the Laravel API from the Next.js frontend in the browser, requests were blocked by CORS policy — the browser refused the response because the `Access-Control-Allow-Origin` header was missing or incorrect.

**Solution:**
- Configured Laravel's `config/cors.php` to allow `http://localhost:3000` as an allowed origin.
- As an alternative during frontend-only development, created a Next.js API Route (`/api/proxy`) that proxied requests to the backend server-side, bypassing browser CORS entirely.

---

### ⚠️ Challenge 3 — Hydration Mismatch (Server vs. Client Rendering)

**Problem:** Next.js App Router renders components on the server first, then "hydrates" them on the client. Some components (e.g., those reading `localStorage` for saved courses or auth tokens) caused hydration mismatch errors because the server-rendered HTML didn't match the client state.

**Solution:**
- Wrapped browser-only logic (localStorage, window) inside `useEffect` hooks so they only execute client-side.
- Used Next.js's `'use client'` directive explicitly at the top of components that require browser APIs.
- For persistent UI state (e.g., saved courses count), initialized with `null` and showed a loading skeleton until the client-side value was available.

---

### ⚠️ Challenge 4 — Recommendation Results Loading Slowly

**Problem:** Fetching course recommendations from the ML backend took several seconds, causing the UI to appear frozen with no user feedback.

**Solution:**
- Added a dedicated loading state with an animated skeleton UI while recommendations were being fetched.
- Implemented `React.Suspense` boundaries around heavy sections so the rest of the page remained interactive.
- Cached previously fetched recommendations in component state so re-visiting the results page felt instant.

---

### ⚠️ Challenge 5 — Tailwind CSS Classes Not Applying (JIT Purge Issue)

**Problem:** Some dynamically constructed Tailwind class names (e.g., `` `bg-${color}-500` ``) were not present in the final CSS bundle — Tailwind's JIT engine couldn't detect them at build time.

**Solution:**
- Replaced all dynamic class name construction with full, explicit class strings.
- Created a lookup map for color variants: `const colorMap = { red: 'bg-red-500', blue: 'bg-blue-500', ... }`.
- Added the `safelist` option in `tailwind.config` for any classes that genuinely needed to be dynamic.

---

### ⚠️ Challenge 6 — `next/image` Blocking External Course Images

**Problem:** Coursera course images and thumbnail URLs from the dataset couldn't be rendered via Next.js `<Image>` — it throws an error if the image host isn't whitelisted.

**Solution:**
- Added all external image hostnames to `next.config.ts` under `images.remotePatterns`:

```ts
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'd3njjcbhbojbot.cloudfront.net' }, // Coursera CDN
    ],
  },
};
```

---

### ⚠️ Challenge 7 — ESLint Failing CI Because of `any` Usage

**Problem:** The ESLint config (inherited from `create-next-app`) had `@typescript-eslint/no-explicit-any` set to `error`, which caused the build pipeline to fail whenever `any` was used as a quick workaround.

**Solution:**
- Systematically replaced `any` usages with proper types or `unknown`.
- For cases where `any` was unavoidable (third-party library interop), used ESLint inline disable comments with a justification comment so it was intentional and traceable.

---

### ⚠️ Challenge 8 — JSON Server Not Matching Real API Shape

**Problem:** The mock `db.json` structure diverged from the actual Laravel API responses over time, causing the frontend code to break when switching between mock and real backend.

**Solution:**
- Kept `db.json` in sync with the agreed API contract document shared between frontend and backend teams.
- Created a thin API adapter layer (`src/lib/api.ts`) so the frontend code never consumed raw API responses — the adapter normalized both mock and real responses into the same internal shape.

---

## 📜 Available Scripts

```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

---

## 👥 Team

**Graduation Project — 5th Year**

| Role | Name |
|------|------|
| Frontend Developer | [@Sanako2003](https://github.com/Sanako2003) &[@shahdzaa](https://github.com/shahdzaa) |
| Backend (Laravel) | [@shahdzaa](https://github.com/shahdzaa) |
| ML Recommendation | Graduation Team |

---

## 📄 License

This project is developed for academic purposes as part of a graduation requirement.

---

> *"The best way to learn is to build something real."*


# Masar — Hybrid AI Course Recommendation Platform

**Masar** is an intelligent educational platform that helps learners discover tailored tech career paths and matches partial course descriptions to the most relevant courses using a hybrid NLP retrieval pipeline.

> **Note:** The core AI training and evaluation codebase is maintained in a private repository to protect intellectual property, while this repository showcases the system architecture, evaluation methodology, and frontend web application.

---

## 🧠 AI System Architecture & Workflow

The recommendation engine combines **conditional title generation** with **chunk-based semantic retrieval** over a fixed catalog of 1,900 IT courses:

1. **Data Preparation & Leak-Free Partitioning:** Course metadata (syllabus, modules, outcomes, skills, and level) is cleaned, normalized, and split into 4 disjoint partitions (`A, B, C, D`) per course (`A+B` for training, `C` for validation, `D` for testing) to ensure zero data leakage under a fixed-catalog retrieval protocol.
2. **Candidate Title Generation (`T5-base` + `LoRA`):** Fine-tuned using Parameter-Efficient Fine-Tuning (`LoRA`, rank=8) to generate candidate course titles from partial (25%) course content.
3. **Semantic Retrieval & Hybrid Ranking (`all-MiniLM-L6-v2`):** Encodes generated titles and chunked course documents (40 words/chunk), averaging top-3 chunk cosine similarities and combining title, content, and matcher scores via tuned hybrid weights to rank catalog courses (`Top-1`, `Top-5`, `MRR`).

![Hybrid Course Recommendation Workflow](assets/workflow.png)

---

## 🖥️ Platform UI Showcase

Built with **Next.js, TypeScript, and Tailwind CSS**, the interface guides users through an interactive tech aptitude discovery flow and personalized course exploration:

### Landing & Learning Paths
![Masar Landing Page](assets/ui-landing.png)

### Tech Aptitude Scale & Domain Discovery
![Masar Domain Discovery](assets/ui-discovery.png)

### Interactive Career Assessment
![Masar Assessment Flow](assets/ui-assessment.png)

---

## 🛠️ Tech Stack

* **AI & NLP Pipeline:** PyTorch, Hugging Face Transformers (`T5-base`), PEFT (`LoRA`), SentenceTransformers (`all-MiniLM-L6-v2`), Scikit-learn, Pandas
* **Frontend Application:** Next.js, TypeScript, Tailwind CSS
