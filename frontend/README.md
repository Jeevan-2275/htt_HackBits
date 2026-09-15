<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16"/>
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4"/>
  <img src="https://img.shields.io/badge/Glassmorphism-Ultra--Modern-blueviolet?style=for-the-badge" alt="Glassmorphism"/>
  <img src="https://img.shields.io/badge/SEO-Enterprise_Grade-00C7B7?style=for-the-badge" alt="Enterprise SEO"/>
</p>

<h1 align="center">Feedspace • Enterprise Frontend Architecture</h1>

<p align="center">
  <b>High-performance, cinematic Next.js 16 application with an optical Glassmorphism Design System, audio-reactive 9:16 smartphone reel previews, and an enterprise SEO engine.</b>
</p>

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Directory Hierarchy](#-directory-hierarchy)
- [Glassmorphism Design System](#-glassmorphism-design-system)
- [AI Video & Audio Studio Pipeline](#-ai-video--audio-studio-pipeline)
- [Enterprise SEO Engine](#-enterprise-seo-engine)
- [Component Specifications](#-component-specifications)
- [Environment Configuration](#-environment-configuration)
- [Development & Build Scripts](#-development--build-scripts)
- [Performance & Core Web Vitals](#-performance--core-web-vitals)

---

## 🏗️ Architectural Overview

The Feedspace web client is built on **Next.js 16.1.6 App Router** powered by **React 19** and compiled via **Turbopack**. It provides a zero-lag, cinematic user experience through hardware-accelerated CSS filters, real-time media recording, and seamless backend API streaming.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Next.js 16 App Router                            │
├───────────────────┬───────────────────────────────────┬─────────────────────┤
│   Public Edge     │         Dashboard Chrome          │    Studio Engine    │
│  - Landing Page   │  - Overview Telemetry (Stats)     │  - 9:16 Reel Modal  │
│  - Aspect Demo    │  - Campaign Management            │  - Karaoke Subtitles│
│  - Glass Auth     │  - Testimonial Feed & Embeds      │  - Custom Trimming  │
│  - SEO (JSON-LD)  │  - Universal Wall of Love         │  - 60 FPS Seek Bar  │
└───────────────────┴───────────────────────────────────┴─────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │   Optical Glassmorphism Engine (CSS Tokens + Mesh)      │
       │   - 28px Blur / 190% Saturation                         │
       │   - Inset Specular Top Highlights                       │
       │   - Multi-Point Chromatic Ambient Refraction Orbs       │
       └─────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Hierarchy

```
frontend/
├── public/                      # Static assets, brand logos, favicons
├── src/
│   ├── app/                     # Next.js 16 App Router directory
│   │   ├── layout.js            # Root layout with Ambient Refraction Mesh & JSON-LD
│   │   ├── globals.css          # Glassmorphism tokens, animations, typography
│   │   ├── page.js              # Cinematic Landing Page (Hero, Demo, FAQ, Marquee)
│   │   ├── sitemap.js           # Dynamic XML sitemap generator (/sitemap.xml)
│   │   ├── robots.js            # Dynamic robots crawler policy (/robots.txt)
│   │   ├── login/
│   │   │   └── page.js          # Glassmorphic Login + 1-Click Demo Login
│   │   ├── signup/
│   │   │   └── page.js          # Glassmorphic Account Creation Portal
│   │   ├── dashboard/
│   │   │   ├── layout.js        # Dashboard shell with frosted Sidebar
│   │   │   ├── page.js          # Real-time Telemetry & Overview Cards
│   │   │   ├── campaigns/
│   │   │   │   ├── page.js      # Campaign Index & share link controls
│   │   │   │   └── create/      # AI Question Generator & Campaign Builder
│   │   │   └── testimonials/
│   │   │       └── page.js      # Testimonial cards, Embed Generator & Wall of Love
│   │   ├── embed/
│   │   │   └── testimonial/[id] # Standalone embeddable customer trust widget
│   │   └── record/[campaignId]  # Browser MediaRecorder with AI voice prompts
│   │
│   ├── components/              # Modular, reusable UI components
│   │   ├── Navbar.js            # Frosted glass dock header with navigation pill
│   │   ├── Sidebar.js           # Frosted obsidian dashboard navigation column
│   │   ├── Footer.js            # Enterprise footer with brand & legal index
│   │   ├── ReelStudioModal.js   # 60 FPS Lag-free AI Video Studio editor
│   │   └── DynamicListInput.js  # Dynamic campaign question editor
│   │
│   ├── context/
│   │   └── AuthContext.js       # React Context for JWT auth state & user session
│   │
│   └── lib/
│       ├── authService.js       # Authentication endpoints & token storage
│       ├── campaignService.js   # Campaign CRUD & public metadata client
│       └── mockApi.js           # Resilient fallback mock client
│
├── package.json
└── next.config.mjs
```

---

## 💎 Glassmorphism Design System

Feedspace utilizes an **Optical Glassmorphism Design System** defined in `src/app/globals.css`. Rather than flat grey semi-transparent panels, each surface simulates real optical frosted glass:

### 1. Optical Glass Tokens
| Token Class | Backdrop Filter | Border & Surface | Lighting Inset |
| :--- | :--- | :--- | :--- |
| `.glass-morphism` | `blur(28px) saturate(190%)` | `rgba(15, 23, 42, 0.60)` / `rgba(255, 255, 255, 0.12)` | `inset 0 1px 1px 0 rgba(255, 255, 255, 0.16)` |
| `.glass-dock` | `blur(32px) saturate(200%)` | `rgba(2, 6, 23, 0.70)` / `rgba(255, 255, 255, 0.14)` | `inset 0 1px 2px 0 rgba(255, 255, 255, 0.22)` |
| `.glass-pill` | `blur(20px) saturate(180%)` | `rgba(255, 255, 255, 0.05)` / `rgba(255, 255, 255, 0.15)` | `inset 0 1px 1px 0 rgba(255, 255, 255, 0.20)` |
| `.glass-btn` | `blur(16px)` | `rgba(255, 255, 255, 0.08)` / `rgba(255, 255, 255, 0.18)` | Hover elevation `-1px` + `shadow-cyan-500/20` |
| `.glass-btn-primary` | `blur(16px)` | Gradient `from-cyan-500 via-purple-600 to-pink-500` | Inset highlight + `shadow-purple-500/40` |
| `.glass-input` | `blur(12px)` | `rgba(15, 23, 42, 0.65)` / `rgba(255, 255, 255, 0.12)` | Focus ring `cyan-400/50` |

### 2. Chromatic Refraction Mesh
Frosted glass only refracts authentically when colorful light passes behind it. In `layout.js`, three multi-point radiant orbs continuously diffuse across the viewport:
- **Orb 1 (Top-Left)**: Electric Cyan (`rgba(6, 182, 212, 0.22)`)
- **Orb 2 (Center-Right)**: Deep Royal Purple (`rgba(147, 51, 234, 0.24)`)
- **Orb 3 (Bottom-Center)**: Vivid Neon Pink (`rgba(236, 72, 153, 0.18)`)
- **Overlay**: Micro-dot SVG glass mesh grid providing tactile depth.

---

## 🎬 AI Video & Audio Studio Pipeline

Feedspace features an in-browser studio modal that handles 9:16 vertical reels with burned-in karaoke captions:

```
                      ┌────────────────────────┐
                      │ Raw Testimonial Video  │
                      └───────────┬────────────┘
                                  │
                                  ▼
               ┌─────────────────────────────────────┐
               │         Browser Media Engine        │
               │  - Direct DOM useRef 60 FPS Seek    │
               │  - Audio-reactive Waveform Visualizer│
               │  - Word-level Karaoke Highlight Sync │
               └──────────────────┬──────────────────┘
                                  │
                                  ▼
               ┌─────────────────────────────────────┐
               │    Server FFmpeg Rendering Core     │
               │  - Universal Aspect Ratio Padding   │
               │  - 30s to 60s Single Reel Target    │
               │  - Preset: veryfast (4-8s render)   │
               └──────────────────┬──────────────────┘
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │ Finished Viral 9:16 MP4│
                     └────────────────────────┘
```

### ⚡ 60 FPS Zero-Lag Architecture
Previous implementations used high-frequency React `useState` inside `onTimeUpdate`, resulting in 15–25 re-renders per second that choked the browser thread. Feedspace eliminates this through:
1. **Direct DOM Refs**: Progress bar widths and current timestamp values update directly on the DOM node via `progressBarRef.current.style.width` and `timeDisplayRef.current.textContent`.
2. **Discrete State Synchronization**: Subtitle word highlighting only updates state when the active word index changes, preserving silky smooth 60 FPS video playback.

---

## 🔍 Enterprise SEO Engine

Feedspace is configured for maximum search engine discovery, Rich Snippets, and social sharing:

### 1. Dynamic Next.js Metadata & OpenGraph
- **Base URL**: `http://localhost:3000` (or production domain)
- **Title Template**: `%s | Feedspace AI Video Testimonials`
- **Twitter Cards**: `summary_large_image` with full dynamic preview tags.

### 2. Schema.org JSON-LD Structured Data
Injected natively in the document `<head>`:
- **`SoftwareApplication`**: Declares Feedspace as an enterprise Multimedia AI Application with a 4.9/5 star rating and feature specifications.
- **`Organization`**: Declares company identity, logo URLs, and official social handles.
- **`FAQPage`**: Rich schema marking up the landing page FAQ for Google Rich Snippets in search results.

### 3. Dynamic Crawler Endpoints
- **`/sitemap.xml`**: Generated by `src/app/sitemap.js` with change frequencies and page priorities.
- **`/robots.txt`**: Generated by `src/app/robots.js` with rules allowing search crawlers while disallowing private dashboard routes.

---

## 🧩 Component Specifications

### `<Navbar />`
- **Location**: `src/components/Navbar.js`
- **Behavior**: Sticky frosted glass dock header with responsive hamburger navigation, isolated navigation pill island, and primary glass CTA.

### `<Sidebar />`
- **Location**: `src/components/Sidebar.js`
- **Behavior**: Frosted obsidian sidebar (`w-64`) with route-aware glowing active indicators, subtle hover translations, and mobile slide-out drawer.

### `<ReelStudioModal />`
- **Location**: `src/components/ReelStudioModal.js`
- **Behavior**: Hardware-accelerated modal dialog featuring dual-pane video preview, interactive start/end time trimming sliders, live subtitle synchronizer, and one-click FFmpeg render dispatcher.

---

## ⚙️ Environment Configuration

Create a `.env.local` or `.env` in the `frontend/` directory:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Site Public Origin (for OpenGraph & Canonical URLs)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🚀 Development & Build Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server with Turbopack on port `3000` |
| `npm run build` | Compiles optimized production bundle |
| `npm run start` | Serves compiled production build |
| `npm run lint` | Runs Next.js ESLint verification |

---

## ⚡ Performance & Core Web Vitals

- **Fonts**: Self-hosted Google Fonts (`Outfit` and `Inter`) loaded with `preconnect` and `display: swap`.
- **CSS Precedence**: Tailwind v4 architecture with root `@import` declarations for immediate Turbopack streaming.
- **Images & Video**: Progressive loading with `preload="metadata"` to prevent bandwidth congestion.
- **Hydration**: Client component barriers isolated to interactive nodes (`'use client'`), allowing maximum static server rendering for the landing page.
