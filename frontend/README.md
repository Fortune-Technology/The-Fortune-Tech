# The Fortune Tech - IT Consulting Website

A modern, production-ready IT consulting and software development website built with Next.js and custom CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.10 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit & React Redux
- **Styling**: Pure Custom CSS (No Tailwind/Bootstrap)
- **Animations**: Motion (Framer Motion 12) & Lenis (Smooth Scroll)
- **Icons**: react-icons
- **Editor**: react-quill-new
- **Data**: Hybrid (Static JSON + Backend API ready)

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Navbar & Footer
│   ├── page.tsx           # Home page (Server Component)
│   ├── loading.tsx        # Loading state component
│   ├── robots.ts          # SEO - Search engine crawling rules
│   ├── sitemap.ts         # SEO - Dynamic sitemap generation
│   ├── about/             # About page
│   ├── services/          # Services page
│   ├── technologies/      # Technologies page
│   ├── portfolio/         # Portfolio page
│   ├── contact/           # Contact page
│   ├── login/             # Authentication page
│   └── admin/             # Admin Dashboard (Users, Services, Portfolio, etc.)
├── components/
│   ├── ErrorBoundary.tsx  # Error boundary for production resilience
│   ├── layout/            # Layout components (Navbar, Footer, SmoothScroll)
│   ├── ui/                # Reusable UI components (Button, Card, ScrollAnimate)
│   ├── home/              # Home page sections
│   └── admin/             # Admin-specific components
├── lib/                   # Shared utilities and hooks
│   ├── store/             # Redux store, slices, and API services (RTK Query)
│   ├── constants.ts       # Centralized constants (routes, durations, patterns)
│   ├── utils.ts           # Common utilities (formatting, string, array ops)
│   ├── validation.ts      # Form validation & input sanitization
│   ├── icons.ts           # Centralized icon utility (DRY)
│   └── hooks.ts           # Custom React hooks
├── types/                 # Shared TypeScript type definitions
│   └── index.ts           # Shared TypeScript type definitions
├── styles/                # Global and component-specific CSS
│   ├── variables.css      # CSS custom properties
│   ├── globals.css        # Global styles & resets
│   ├── layout.css         # Layout utilities & grid
│   └── components.css     # All component-specific styles
├── data/                  # Static JSON data files
└── public/                # Static assets
```

## 🎨 Design Features

- **Modern Premium Design**: Clean, professional IT-corporate aesthetic
- **Smooth Scrolling**: Lenis implementation for refined, buttery-smooth scroll experience
- **Scroll-Triggered Animations**: Modern entrance animations using `motion` (Motion One)
- **Fully Responsive**: Mobile-first approach with optimized breakpoints
- **Dark/Light Theme**: Seamless theme switching with persistent preferences
- **Custom CSS Variables**: Easy theming with CSS custom properties
- **SEO Optimized**: Meta tags, robots.txt, sitemap.xml, and semantic HTML
- **AEO/GEO Ready**: Optimized for AI search engines (ChatGPT, Gemini, Copilot)
- **Accessible**: ARIA labels and keyboard navigation
- **Type-Safe**: Full TypeScript coverage with strict mode

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd The-Fortune-Tech
```

2. Install dependencies
```bash
npm install
```

3. Run development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📄 Pages

### Home Page
- Hero section with high-impact CTA
- Services overview with interaction effects
- Why Choose Us section (Stats & Features)
- Technologies showcase (Interactive grid)
- Client testimonials (Slider ready)

### About Page
- Company overview with Mission & Vision
- Dynamic statistics with count-up animations
- Team showcase and core values

### Services Page
- Detailed breakdown of offerings
- Specialized UI cards for each service category

### Technologies Page
- Categorized tech stack display (Frontend, Backend, Database, Cloud)

### Portfolio Page
- Project showcase with filtering and tech stack badges

### Contact Page
- Validated contact form with anti-spam (sanitization)
- Interactive map and contact information

### Admin Panel (Protected)
- **Dashboard**: High-level metrics for site performance
- **CMS**: Manage services, portfolio, technologies, and testimonials
- **User Management**: Control admin access and roles
- **Settings**: Update site-wide configs and SEO metadata

## ⚡ Performance & Animation

### 1. Smooth Scrolling (Lenis)
Implemented via `components/layout/SmoothScroll.tsx`, Lenis provides a premium feel by normalizing scroll behavior across browsers and devices.

### 2. Entrance Animations (ScrollAnimate)
A reusable `ScrollAnimate` wrapper component using `motion` handles entrance effects:
- Fade (Up, Down, Left, Right)
- Scale
- Staggered delays

### 3. Server Components
Home page is a Server Component, reducing client-side JavaScript bundle and improving LCP.

### 4. Icon Tree-Shaking
Centralized icon utility (`lib/icons.ts`) ensures only used icons are bundled, leveraging Next.js optimization.

## 🏗️ Architectural Decisions

| Principle | Implementation | Rationale |
|-----------|----------------|-----------|
| **DRY** | Centralized constants & utils | Eliminated duplicate code and magic numbers |
| **KISS** | Simple utility functions, no over-abstraction | Easy to understand and maintain |
| **Separation of Concerns** | Distinct Layer for Data/UI/Logic | Easier maintenance and scalability |
| **Fail Fast** | Early validation in `lib/validation.ts` | Prevents propagation of invalid data |
| **Type Safety** | Shared `types/index.ts` | Frontend-backend type contracts, compile-time safety |

## 🧰 Utilities & Helpers

### Constants (`lib/constants.ts`)
Centralized constants eliminate magic numbers and strings for routes, animation durations, and regex patterns.

### Utilities (`lib/utils.ts`)
30+ utility functions for conditional class names (cn), date formatting, string truncation, and clipboard operations.

### Validation (`lib/validation.ts`)
Comprehensive form validation and input sanitization (XSS prevention) for secure user interaction.

## 🔮 Future Enhancements

- [x] Dark/Light theme toggle
- [x] Error boundaries for production resilience
- [x] SEO files (robots.txt, sitemap.xml)
- [x] Form validation and sanitization
- [x] Image optimization with next/image
- [x] Advanced scroll animations (Lenis + Motion)
- [ ] Blog section (Integrated via CMS)
- [ ] Case study detailed deep-dives
- [ ] Analytics integration (Google/PostHog)
- [ ] Unit & E2E Testing suite
- [ ] Multi-language support (i18n)

---

Built with ❤️ by The Fortune Tech Team
