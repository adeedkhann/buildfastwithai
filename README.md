# 🏛️ JanMitra AI — Next-Gen Smart Citizen Grievance & Predictive Governance Platform

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015%2F16-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/Runtime-React%2019-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini 2.5 Flash](https://img.shields.io/badge/AI_Engine-Gemini%202.5%20Flash-4285F4?style=for-the-badge&logo=googlegemini)](https://deepmind.google/technologies/gemini/)
[![Leaflet GIS](https://img.shields.io/badge/GIS-React%20Leaflet-199900?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)
[![Build Fast with AI](https://img.shields.io/badge/Hackathon-Build%20Fast%20With%20AI-FF6B6B?style=for-the-badge)](https://buildfastwithai.com)

> **JanMitra AI** (जनमित्र) is a state-of-the-art citizen grievance redressal and predictive analytics platform engineered for modern municipal administrations and smart cities across India. Developed for the **Build Fast with AI Hackathon**, JanMitra AI combines Google Gemini-powered multimodal AI analysis, native speech-to-text voice transcriptions, dynamic spatial hotspot clustering, and role-based authentication gates to eliminate misallocated departments, administrative bottlenecks, and lack of transparency.

---

## 🌟 Modern Core Modules

### 1. 🎙️ Citizen Engagement Portal

- **Multimodal AI Vision Scanning:** Citizens can upload photos of civic issues (e.g., garbage dumps, burst water mains, broken streetlights, road potholes) which are instantly analyzed by Google Gemini Vision.
- **Vernacular Speech-to-Text Voice Transcriptions:** Speak in Hindi, English, Hinglish, or regional dialects. Custom speech-to-text transcribes conversational audio and local slang into structured, high-accuracy civic grievances.
- **Live Interactive Diagnostic HUD:** Real-time visual tracking of AI analysis:
  1. *Parsing and analyzing complaint text...*
  2. *Detecting complaint category...*
  3. *Assessing priority, urgency, and severity...*
  4. *Routing to appropriate municipal department...*
  5. *Generating administrative officer summary...*
- **GIS Geolocation Pinning:** Automatic citizen location tracking via the browser Geolocation API integrated with OpenStreetMap, reverse-geocoding coordinates directly to localized urban zones.
- **Holographic Tracking Timeline:** Complete end-to-end transparency: `Submitted ➔ AI Analyzing ➔ Department Assigned ➔ Officer Reviewing ➔ Action In Progress ➔ Resolved`.
- **Color-Coded Urgency Selector:** Interactive priority cards (Auto, Normal, Urgent, Critical) with smooth micro-animations and subtle status indicators.
- **Centered Desktop Navigation:** Clean horizontal navigation (`New Complaint`, `My Complaints`, `Track Complaint`) with custom icons and gradient indicators.

---

### 2. 👮 Officer Command Console

- **Automated Department Queues:** Custom-routed action dashboards for Municipal Corporations, Water Authorities, Public Works Departments (PWD), and Electricity Boards.
- **Active Hotline & Action Alerts:** Visually prominent alert banners highlighting urgent grievances that demand immediate field inspection.
- **Consolidated Ticket Merging:** Prevents redundant dispatches by grouping overlapping complaints from identical geographic blocks into a single parent ticket.
- **Bilingual Resolution & Feedback Notes:** Officers provide updates in English & Hindi, instantly synced to the citizen's live tracking portal.

---

### 3. 🔒 Secure Database-Backed Citizen Authentication

- **Database-Backed Access Gate:** User registration and credentials verified directly against a persistent Supabase PostgreSQL database (`public.citizens`).
- **Role Selection Grid (`/login`):** Modern glassmorphic accessway portal featuring distinct role cards for Citizens, Nodal Officers, and System Administrators.
- **Active Session Persistence:** Automatic session caching with pulsing `Active Session` indicators to ensure uninterrupted navigation.
- **Cross-Tab Synchronization:** Instant state sync across multiple browser tabs on authentication events.

---

### 4. 📊 Admin Console & Predictive Governance

- **Telemetry & Analytics Visualizations:** Rich interactive area charts (monthly grievance trends), pie charts (category distribution), and bar charts (department resolution ratios).
- **Dynamic Spatial Hotspot Clustering:** Grievances reported in the same geographical locality auto-cluster to highlight critical civic infrastructure bottlenecks.
- **Inter-Department SLA Efficiency Matrix:** Real-time performance tracking monitoring average resolution turnarounds (SLAs) and department-wise closure rates.

---

### 5. ☁️ Supabase Cloud & PostgreSQL Database Integration

- **Relational Cloud Storage:** Powered by Supabase PostgreSQL for multi-client state persistence.
- **Core Schemas:**
  - `public.citizens`: Verified user profiles (names, emails, phones, and credentials).
  - `public.complaints`: Full grievance repository (media URLs, coordinates, AI routing metadata, priority levels, and assigned officers).
  - `public.complaint_updates`: Linked timeline rows maintaining historical audit logs.
- **Row-Level Security (RLS):** RLS policies applied across tables to enforce secure dataset isolation.

---

## 🤖 AI Nodal Agent Autonomous Follow-Up (`AIAgentFollowUpPanel`)

JanMitra AI simulates an autonomous background auditing agent that monitors ticket lifecycles and triggers automated actions across a 5-day SLA timeline:

| Timeline Segment | Action Title | Bilingual Description | Visual Theme Indicator |
|:---|:---|:---|:---|
| **Day 1 (0h)** | **Grievance Auto-Classification** | AI parses user text, assigns precise category, and routes to correct municipal department. | 🟣 `Purple / Bot` (Success) |
| **Day 1 (0.1h)** | **AI Vision Scan & Evidence Extract** | Photo attachment processed. Confirmed visual evidence tagged for officer inspection. | 🟢 `Green / Zap` (Success) |
| **Day 1 (0.5h)** | **Vernacular SMS Alert** | Citizen receives instant status updates in local language/dialect. | 🔵 `Blue / Msg` (Info) |
| **Day 2 (24h)** | **Autonomous Officer Push Alert** | Monitors SLA progress. Sends high-priority reminder alerts to assigned officer. | 🟡 `Amber / Clock` (Action) |
| **Day 3 (48h)** | **SLA Threshold Escalation** | Escalates unhandled tickets automatically to ward/city commissioner. | 🔴 `Red / Shield` (Warning) |
| **Day 4 (72h)** | **Field Progress Verification** | Ground telemetry captured; progress updates dispatched to citizen. | 🔵 `Cyan / Zap` (Action) |
| **Day 5 (96h)** | **AI Resolution Verification** | Analyzes officer's resolution proof photo to confirm issue closure. | 🟢 `Green / Check` (Success) |

---

## 🚀 Dynamic Spatial Hotspot Clustering Engine

JanMitra AI runs an autonomous spatial clustering algorithm to detect localized civic infrastructural failures:

```
[ Grievance Submitted ]
         │
         ▼
[ Scan active non-resolved complaints ]
         │
         ▼
[ Group by identical Area + Category ]
         │
         ▼
[ Is cluster size >= 2 active complaints? ]
     ├── Yes ➔ Mark both as [HOTSPOT] ➔ Elevate Priority to [HIGH] ➔ Bubble to Top of Officer Queue
     └── No  ➔ Standard Queue Sorting & Priority
```

### Key Algorithmic Rules:

- **Dynamic Promotion:** If two or more active (unresolved) complaints of the same category are reported in the same block, they are flagged as `isHotspot: true` and elevated to High Priority.
- **SLA Queue Prioritization:** Hotspot tickets bypass standard chronological lists and bubble up to the top of the Officer Command Console.
- **Cluster Shrinkage:** As officers resolve individual tickets within a cluster, the cluster size automatically shrinks back below the threshold, returning remaining tickets to standard priority queues.

---

## 💻 Google Gemini AI Heuristics Engine

### A. Multimodal Grievance Classifier (`/api/classify`)

Integrates Gemini 2.5 Flash to evaluate citizen reports:

- **Visual Inputs:** Inspects uploaded base64 images for structural issues, refuse accumulation, or electrical hazards.
- **Multilingual Analysis:** Comprehends English, Devanagari Hindi, Urdu, and Hinglish.
- **Structured Output:** Returns strict JSON payloads specifying category routing, bilingual summaries, urgency metrics, and SLA targets:

```json
{
  "category": "Water Supply",
  "categoryHi": "जल आपूर्ति",
  "priority": "high",
  "urgency": "Requires immediate attention",
  "department": "Water Works Department",
  "departmentHi": "जल कल विभाग",
  "summary": "Water pipeline burst reported in Sector 4 causing localized flooding.",
  "summaryHi": "सेक्टर 4 में पानी की पाइपलाइन फटने की खबर है जिससे स्थानीय जलभराव हो गया है।",
  "confidence": 0.98,
  "predictedResolutionDays": 3
}
```

### B. Vernacular Speech-to-Text (`/api/transcribe`)

Allows citizens to record voice notes directly in the browser:

- Accurately parses Hinglish, Hindi, and local dialects.
- Preserves landmark and location details as spoken.
- Filters ambient audio noise.

---

## 🔑 Portal Access Directory

To test the application portals, use the following credentials available on the `/login` portal:

| Portal Accessway | Route | Authorized Email | Secret Passcode / Key |
|:---|:---|:---|:---|
| Officer Command Console | `/officer` | officer@gmail.com | 1122 |
| Admin Panel & Secretariat | `/admin` | admin@gmail.com | 1234 |
| Citizen Portal (Public) | `/citizen` | No Credentials Required | Open Access |

---

## 📂 Project Directory Structure

```
janmitra-ai/
├── src/
│   ├── app/                 # Next.js App Router Configuration
│   │   ├── admin/           # Administrative Panel & Telemetry Charts
│   │   ├── api/             # Serverless API Routes (/classify, /transcribe, /send-email)
│   │   ├── citizen/         # Citizen Portal (Form, Geolocation, Timeline)
│   │   ├── help/            # Citizen Support & FAQ Section
│   │   ├── login/           # Authentication Gateways & Role Cards
│   │   ├── officer/         # Nodal Officer Command Console & Live Telemetry Map
│   │   ├── privacy/         # Privacy Policy
│   │   ├── terms/           # Terms of Service
│   │   ├── globals.css      # Custom Styling & Dark Theme Variables
│   │   ├── layout.tsx       # Root Layout & Global Tooltip Providers
│   │   └── page.tsx         # Product Landing Page
│   ├── components/
│   │   ├── admin/           # Administrative Dashboard Components
│   │   ├── citizen/         # Grievance Input Form & Tracking Components
│   │   ├── landing/         # Landing Page Visual Sections
│   │   ├── shared/          # Navigation, Footers, Theme Toggles
│   │   └── ui/              # Reusable UI Primitives
│   ├── data/
│   │   ├── complaints.ts    # Seed Data Repository
│   │   └── departments.ts   # Department Mappings & Heuristic Keywords
│   ├── lib/
│   │   ├── ai.ts            # Fallback Classifier Heuristics
│   │   ├── complaints.ts    # Spatial Clustering & Query Utilities
│   │   └── utils.ts         # Utility Helper Functions
│   └── types/
│       └── index.ts         # Global TypeScript Definitions
├── public/                  # Static Assets, Icons, and Media
├── .env.local               # Environment Configurations
├── package.json             # Dependencies and Execution Scripts
└── tsconfig.json            # TypeScript Configuration
```

---

## 💻 Tech Stack & Tooling

- **Framework:** Next.js 15/16 (App Router)
- **Runtime:** React 19
- **Styling Engine:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Telemetry & Visualization:** Recharts
- **GIS Maps:** OpenStreetMap & React Leaflet
- **AI Engine:** Google Gemini 2.5 Flash
- **Database & Auth:** Supabase PostgreSQL
- **Email Gateway:** Resend API

---

## 🛠️ Local Development Quickstart

### 1. Clone the Repository

```bash
git clone https://github.com/adeedkhaan/buildfastwithai.git
cd buildfastwithai
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configurations
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Resend API Key
RESEND_API_KEY=your_resend_api_key_here

# Bhashini API
BHASHINI_UDYAT_KEY=
BHASHINI_USER_ID=
BHASHINI_INFERENCE_KEY=

```

### 3. Install Dependencies

```bash
npm install
```

### 4. Launch Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🎯 Built For

Developed with ❤️ for **Build Fast with AI Hackathon**.
