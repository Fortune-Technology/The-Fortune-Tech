# The Fortune Tech - IT Consulting Website (Frontend)

A modern, production-ready IT consulting and software development website built with Next.js 16 and custom CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.10 (App Router)
- **Language**: TypeScript 5.x (strict mode)
- **React**: 19.2.1
- **State Management**: Redux Toolkit 2.x & React Redux 9.x (RTK Query for API)
- **Styling**: Pure Custom CSS (No Tailwind/Bootstrap)
- **Animations**: Motion (Framer Motion 12) & Lenis (Smooth Scroll)
- **Font**: Inter (via `next/font/google`, optimized subsets)
- **Icons**: react-icons (tree-shaken via centralized utility)
- **Rich Text**: react-quill-new
- **Data**: Hybrid (Static JSON for public pages + Backend API via RTK Query for admin)

## 📁 Project Structure

```
frontend/
├── app/                         # Next.js App Router pages
│   ├── layout.tsx              # Root layout (Navbar, Footer, SmoothScroll, Providers)
│   ├── page.tsx                # Home page (Server Component)
│   ├── loading.tsx             # Global loading state
│   ├── robots.ts               # SEO: Search engine crawling rules
│   ├── sitemap.ts              # SEO: Dynamic sitemap generation
│   ├── about/page.tsx          # About page
│   ├── services/
│   │   ├── page.tsx            # Services listing page
│   │   └── [slug]/page.tsx     # Service detail page (dynamic route)
│   ├── portfolio/
│   │   ├── page.tsx            # Portfolio listing page
│   │   └── [slug]/page.tsx     # Portfolio detail page (dynamic route)
│   ├── technologies/page.tsx   # Technologies showcase page
│   ├── careers/page.tsx        # Careers / Job openings page
│   ├── contact/page.tsx        # Contact page
│   ├── (legal)/[slug]/page.tsx # Legal pages (Privacy, Terms, etc.)
│   ├── login/page.tsx          # Login page
│   ├── signup/page.tsx         # Signup / Registration page
│   ├── forgot-password/page.tsx # Forgot password page
│   └── admin/                  # Admin Dashboard (Protected)
│       ├── page.tsx            # Dashboard overview
│       ├── profile/page.tsx    # Admin profile management
│       ├── services/page.tsx   # Services CRUD
│       ├── portfolio/page.tsx  # Portfolio CRUD
│       ├── technologies/page.tsx # Technologies CRUD
│       ├── testimonials/page.tsx # Testimonials CRUD
│       ├── careers/page.tsx    # Careers CRUD
│       ├── cms/page.tsx        # CMS page management
│       ├── users/page.tsx      # User management
│       └── settings/page.tsx   # Website settings & SEO
├── components/
│   ├── ErrorBoundary.tsx       # Error boundary for production resilience
│   ├── layout/
│   │   ├── Navbar.tsx          # Main navigation bar
│   │   ├── Footer.tsx          # Site footer
│   │   ├── SmoothScroll.tsx    # Lenis smooth scroll wrapper
│   │   └── FloatingButtons.tsx # Floating action buttons (scroll-to-top, etc.)
│   ├── ui/
│   │   ├── Button.tsx          # Reusable button component
│   │   ├── Card.tsx            # Reusable card component
│   │   ├── PageHeader.tsx      # Page title/header component
│   │   ├── SectionTitle.tsx    # Section heading component
│   │   ├── ScrollAnimate.tsx   # Scroll-triggered animation wrapper
│   │   ├── ScrollAnimate.examples.tsx # Animation usage examples
│   │   ├── RichTextEditor.tsx  # Quill rich text editor wrapper
│   │   ├── DeleteConfirmModal.tsx # Confirmation modal for deletions
│   │   ├── Toast.tsx           # Toast notification component
│   │   └── ToastContainer.tsx  # Toast notification container
│   ├── home/
│   │   ├── Hero.tsx            # Hero section with CTA
│   │   ├── Services.tsx        # Services overview section
│   │   ├── Stats.tsx           # Statistics with count-up animations
│   │   ├── WhyChooseUs.tsx     # Why Choose Us section
│   │   ├── TechStack.tsx       # Interactive technology showcase
│   │   ├── Testimonials.tsx    # Client testimonials slider
│   │   └── CTA.tsx             # Call-to-action section
│   ├── admin/
│   │   ├── AdminLayout.tsx     # Admin sidebar & layout shell
│   │   ├── ServiceDetailModal.tsx
│   │   ├── PortfolioDetailModal.tsx
│   │   ├── TestimonialDetailModal.tsx
│   │   ├── CareerDetailModal.tsx
│   │   ├── CMSDetailModal.tsx
│   │   └── UserDetailsModal.tsx
│   └── auth/
│       ├── AuthPersist.tsx     # Auth state persistence across refreshes
│       └── ProtectedRoute.tsx  # Route guard for admin pages
├── contexts/
│   └── ThemeContext.tsx         # Dark/Light theme context (localStorage)
├── lib/
│   ├── constants.ts            # Centralized constants (routes, durations, patterns)
│   ├── utils.ts                # 30+ utility functions (cn, formatting, clipboard, etc.)
│   ├── validation.ts           # Form validation & XSS sanitization
│   ├── icons.ts                # Centralized icon utility (DRY tree-shaking)
│   ├── hooks.ts                # Custom React hooks
│   ├── hooks/
│   │   └── useDeleteConfirm.ts # Delete confirmation hook
│   ├── store/
│   │   ├── store.ts            # Redux store configuration
│   │   ├── hooks.ts            # Typed Redux hooks (useAppSelector, useAppDispatch)
│   │   ├── StoreProvider.tsx   # Redux Provider wrapper
│   │   ├── index.ts            # Store barrel export
│   │   ├── api/
│   │   │   ├── baseApi.ts      # RTK Query base API (auth interceptors, cookie credentials)
│   │   │   ├── authApi.ts      # Auth endpoints (login, register, logout, refresh, etc.)
│   │   │   ├── servicesApi.ts  # Services CRUD endpoints
│   │   │   ├── portfolioApi.ts # Portfolio CRUD endpoints
│   │   │   ├── technologiesApi.ts # Technologies CRUD endpoints
│   │   │   ├── testimonialsApi.ts # Testimonials CRUD endpoints
│   │   │   ├── careersApi.ts   # Careers CRUD endpoints
│   │   │   ├── cmsApi.ts       # CMS CRUD endpoints
│   │   │   ├── usersApi.ts     # Users CRUD endpoints
│   │   │   ├── settingsApi.ts  # Settings endpoints
│   │   │   └── index.ts        # API barrel export
│   │   └── slices/
│   │       ├── authSlice.ts    # Auth state slice (user, token, loading)
│   │       └── notificationSlice.ts # Toast notification state
│   ├── config/                 # App configuration
│   └── seo/                    # SEO utilities
├── types/
│   └── index.ts                # Shared TypeScript types/interfaces
├── data/                        # Static JSON data files
│   ├── services.json
│   ├── portfolio.json
│   ├── technologies.json
│   ├── testimonials.json
│   ├── career.json
│   ├── cms.json
│   ├── users.json
│   └── website-config.json
├── styles/
│   ├── variables.css           # CSS custom properties (colors, spacing, typography)
│   ├── globals.css             # Global resets & base styles
│   ├── layout.css              # Layout utilities & grid system
│   ├── components.css          # Component-specific styles (88KB+)
│   ├── admin.css               # Admin dashboard styles (62KB+)
│   ├── auth.css                # Login, signup, forgot-password styles
│   ├── careers.css             # Careers page styles
│   └── quill-custom.css        # Rich text editor custom styles
├── public/                      # Static assets (images, favicon)
├── middleware.ts                # Next.js middleware (auth route protection)
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── eslint.config.mjs            # ESLint configuration
```

## 🎨 Design Features

- **Modern Premium Design**: Clean, professional IT-corporate aesthetic with rich visual effects
- **Smooth Scrolling**: Lenis implementation for refined, buttery-smooth scroll experience
- **Scroll-Triggered Animations**: Entrance animations using `motion` (fade, scale, stagger)
- **Fully Responsive**: Mobile-first approach with optimized breakpoints
- **Dark/Light Theme**: Seamless toggle with `ThemeContext` and localStorage persistence
- **Custom CSS Variables**: Complete theming via CSS custom properties (no framework dependency)
- **SEO Optimized**: Meta tags, `robots.ts`, `sitemap.ts`, semantic HTML, structured headings
- **AEO/GEO Ready**: Optimized for AI search engines (ChatGPT, Gemini, Copilot)
- **Accessible**: ARIA labels, keyboard navigation, semantic elements
- **Type-Safe**: Full TypeScript coverage with strict mode and shared type contracts
- **Toast Notifications**: Redux-powered notification system for user feedback
- **Error Boundaries**: Production-grade error handling with fallback UI

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see `backend/README.md`)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Next.js dev server with hot-reload |
| `build` | `npm run build` | Create production build |
| `start` | `npm start` | Run production server |
| `lint` | `npm run lint` | Run ESLint |

### Build for Production

```bash
npm run build
npm start
```

## 📄 Pages

### Public Pages
| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Hero, Services overview, Stats, Why Choose Us, Tech Stack, Testimonials, CTA |
| **About** | `/about` | Company overview, Mission & Vision, statistics, team, core values |
| **Services** | `/services` | Services listing with categories |
| **Service Detail** | `/services/[slug]` | Individual service deep-dive |
| **Portfolio** | `/portfolio` | Project showcase with filtering and tech stack badges |
| **Portfolio Detail** | `/portfolio/[slug]` | Individual project case study |
| **Technologies** | `/technologies` | Categorized tech stack display |
| **Careers** | `/careers` | Job openings and career opportunities |
| **Contact** | `/contact` | Validated contact form with anti-spam sanitization |
| **Legal** | `/(legal)/[slug]` | Privacy Policy, Terms of Service (CMS-driven) |

### Auth Pages
| Page | Route | Description |
|------|-------|-------------|
| **Login** | `/login` | Email/password authentication |
| **Signup** | `/signup` | User registration |
| **Forgot Password** | `/forgot-password` | Password reset request |

### Admin Panel (Protected)
| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/admin` | High-level metrics and overview |
| **Profile** | `/admin/profile` | Admin profile management |
| **Services** | `/admin/services` | Services CRUD management |
| **Portfolio** | `/admin/portfolio` | Portfolio CRUD management |
| **Technologies** | `/admin/technologies` | Technologies CRUD management |
| **Testimonials** | `/admin/testimonials` | Testimonials CRUD management |
| **Careers** | `/admin/careers` | Job postings CRUD management |
| **CMS** | `/admin/cms` | CMS page creation, editing, publish/unpublish |
| **Users** | `/admin/users` | User management, roles, permissions |
| **Settings** | `/admin/settings` | Website config, SEO metadata, branding |

## ⚡ Performance & Animation

### 1. Smooth Scrolling (Lenis)
`components/layout/SmoothScroll.tsx` normalizes scroll behavior across browsers for a premium feel.

### 2. Entrance Animations (ScrollAnimate)
Reusable `ScrollAnimate` wrapper using `motion`:
- Fade (Up, Down, Left, Right)
- Scale
- Staggered delays

### 3. Server Components
Home page is a Server Component, reducing client-side JavaScript bundle and improving LCP.

### 4. Icon Tree-Shaking
Centralized icon utility (`lib/icons.ts`) ensures only used icons are bundled.

### 5. Font Optimization
Inter font loaded via `next/font/google` with automatic subsetting, display swap, and only required weights (400, 500, 600, 700).

## 🏗️ Architectural Decisions

| Principle | Implementation | Rationale |
|-----------|----------------|-----------|
| **DRY** | Centralized constants, utils, icons, hooks | Eliminated duplicate code and magic numbers |
| **KISS** | Simple utility functions, no over-abstraction | Easy to understand and maintain |
| **Separation of Concerns** | Data (store/api) / UI (components) / Logic (hooks/utils) | Easier maintenance and scalability |
| **Fail Fast** | Early validation in `lib/validation.ts` | Prevents propagation of invalid data |
| **Type Safety** | Shared `types/index.ts` | Frontend-backend type contracts, compile-time safety |
| **Component Composition** | Smart (admin modals) vs Dumb (ui/Card, Button) | Reusable, testable components |
| **State Management** | RTK Query for server state, Redux slices for UI state | Optimistic updates, cache invalidation, auth persistence |

## 📏 Engineering Principles & Standards

This project strictly follows the guidelines outlined in `ENGINEERING_PRINCIPLES.md`:

- **Component Architecture**: Atomic component structure with clear separation — `layout/`, `ui/`, `home/`, `admin/`, `auth/`.
- **Performance**: Server Components, image optimization, code splitting, lazy loading, font subsetting.
- **Type Safety**: strict TypeScript with shared types (`types/index.ts`) matching backend contracts.
- **Maintainability**: Custom hooks, centralized constants, utility functions, barrel exports.
- **Security**: XSS sanitization in validation, protected routes via middleware, auth state persistence.
- **Error Handling**: Error boundaries, toast notifications, loading/error/empty states in admin.

## 🧰 Utilities & Helpers

### Constants (`lib/constants.ts`)
Centralized constants eliminate magic numbers and strings for routes, animation durations, and regex patterns.

### Utilities (`lib/utils.ts`)
30+ utility functions: conditional class names (`cn`), date formatting, string truncation, clipboard operations, and more.

### Validation (`lib/validation.ts`)
Comprehensive form validation and input sanitization (XSS prevention) for secure user interaction.

### Icons (`lib/icons.ts`)
Centralized icon mapping for tree-shaking optimization — only used icons are included in the bundle.

### Custom Hooks (`lib/hooks.ts`, `lib/hooks/`)
Reusable React hooks for common patterns including delete confirmations and typed Redux dispatch/selector.

## 🔮 Future Enhancements

- [x] Dark/Light theme toggle
- [x] Error boundaries for production resilience
- [x] SEO files (robots.ts, sitemap.ts)
- [x] Form validation and sanitization
- [x] Image optimization with next/image
- [x] Advanced scroll animations (Lenis + Motion)
- [x] Auth pages (Login, Signup, Forgot Password)
- [x] Admin profile management
- [x] Toast notification system
- [x] Dynamic legal pages (Privacy, Terms via CMS)
- [ ] Blog section (Integrated via CMS)
- [ ] Case study detailed deep-dives
- [ ] Analytics integration (Google/PostHog)
- [ ] Unit & E2E Testing suite
- [ ] Multi-language support (i18n)

---

Built with ❤️ by The Fortune Tech Team
