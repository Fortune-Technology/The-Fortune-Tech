# The Fortune Tech - Backend API

A robust, enterprise-grade backend API built with Node.js, Express, and TypeScript, powering The Fortune Tech's IT consulting ecosystem.

## 🚀 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express 5.2.1
- **Language**: TypeScript 5.9.3
- **Database**: MongoDB (via Mongoose 8.x)
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only Cookie storage
- **Validation**: Joi schemas with DTO pattern
- **Email Service**: Gmail SMTP via Nodemailer
- **File Upload**: Multer (local disk storage)
- **Security**: Helmet, Express Rate Limit, bcryptjs, CORS
- **Logging**: Morgan (dev/combined modes)
- **Development**: nodemon, ts-node, tsconfig-paths

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts                # Express app setup (middleware, routes, error handling)
│   ├── server.ts             # Server entry point (DB connection, graceful shutdown)
│   ├── config/
│   │   ├── database.ts       # MongoDB connection & disconnection
│   │   ├── env.ts            # Typed environment variable management with validation
│   │   ├── multer.ts         # File upload configuration (disk storage, file filters)
│   │   └── index.ts          # Config barrel export
│   ├── constants/
│   │   └── index.ts          # HTTP statuses, error codes, roles, permissions, pagination
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── service.controller.ts
│   │   ├── portfolio.controller.ts
│   │   ├── technology.controller.ts
│   │   ├── testimonial.controller.ts
│   │   ├── career.controller.ts
│   │   ├── cms.controller.ts
│   │   ├── user.controller.ts
│   │   ├── settings.controller.ts
│   │   ├── blog.controller.ts
│   │   └── index.ts          # Controller barrel export
│   ├── dtos/
│   │   ├── auth.dto.ts       # Login, register, forgot/reset password schemas
│   │   ├── service.dto.ts    # Service CRUD + query schemas
│   │   ├── portfolio.dto.ts  # Portfolio CRUD + query schemas
│   │   ├── technology.dto.ts # Tech category & item schemas
│   │   ├── testimonial.dto.ts
│   │   ├── career.dto.ts
│   │   ├── cms.dto.ts
│   │   ├── user.dto.ts       # User CRUD + change password schemas
│   │   ├── settings.dto.ts
│   │   ├── blog.dto.ts       # Blog CRUD + query schemas
│   │   └── index.ts          # DTO barrel export
│   ├── interfaces/
│   │   └── index.ts          # Shared TypeScript interfaces (IUser, IService, etc.)
│   ├── middlewares/
│   │   ├── auth.middleware.ts      # JWT verification, role & permission checks
│   │   ├── error.middleware.ts     # Global error handler & 404 handler
│   │   ├── upload.middleware.ts    # Multer wrappers (singleImage, multiFields, formDataOnly)
│   │   ├── validate.middleware.ts  # Joi validation middleware (body, query, params)
│   │   └── index.ts               # Middleware barrel export
│   ├── models/
│   │   ├── User.model.ts
│   │   ├── Service.model.ts
│   │   ├── Portfolio.model.ts
│   │   ├── TechnologyCategory.model.ts
│   │   ├── Testimonial.model.ts
│   │   ├── Career.model.ts
│   │   ├── CMSPage.model.ts
│   │   ├── WebsiteConfig.model.ts
│   │   ├── Blog.model.ts     # Blog schema with tags and categories
│   │   └── index.ts               # Model barrel export
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── service.routes.ts
│   │   ├── portfolio.routes.ts
│   │   ├── technology.routes.ts
│   │   ├── testimonial.routes.ts
│   │   ├── career.routes.ts
│   │   ├── cms.routes.ts
│   │   ├── user.routes.ts
│   │   ├── settings.routes.ts
│   │   ├── blog.routes.ts
│   │   └── index.ts               # Route aggregation & health check
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── service.service.ts
│   │   ├── portfolio.service.ts
│   │   ├── technology.service.ts
│   │   ├── testimonial.service.ts
│   │   ├── career.service.ts
│   │   ├── cms.service.ts
│   │   ├── user.service.ts
│   │   ├── settings.service.ts
│   │   ├── blog.service.ts
│   │   └── index.ts               # Service barrel export
│   ├── utils/
│   │   ├── async-handler.ts       # Express async error wrapper
│   │   ├── email.ts               # Email sending utility (Nodemailer)
│   │   ├── errors.ts              # Custom error classes (AppError, NotFoundError, etc.)
│   │   ├── helpers.ts             # Reusable helpers (slug generation, URL formatting, etc.)
│   │   ├── response.ts            # Standardized API response formatting
│   │   └── index.ts               # Utils barrel export
│   └── scripts/
│       └── seed.ts                # Database seeding script
├── public/                        # Static assets & uploaded files
├── dist/                          # Compiled JavaScript (production build)
├── .env.example                   # Environment variable template
└── the-fortune-tech.postman_collection.json  # API Documentation (Postman)
```

## 🔒 Security Features

- **JWT Authentication**: Stateless auth with HTTP-only cookies and token refresh mechanism.
- **RBAC (Role-Based Access Control)**: 4 roles (`super_admin`, `admin`, `editor`, `client`) with granular permission mapping.
- **Granular Permissions**: 30+ permissions covering Dashboard, Services, Portfolio, Technologies, Testimonials, Careers, CMS, Users, Settings, and Blogs.
- **Data Validation**: All inputs validated via Joi schemas (DTOs) before reaching controllers.
- **Security Headers**: Helmet integration protecting against common web vulnerabilities.
- **Rate Limiting**: Configurable brute-force protection (default: 100 requests per 15 minutes).
- **Password Hashing**: bcryptjs for secure credential storage.
- **CORS**: Configurable origin whitelist for frontend integration.
- **Graceful Shutdown**: Process signal handling (SIGTERM, SIGINT) with database cleanup.
- **Uncaught Error Handling**: Global handlers for uncaught exceptions and unhandled promise rejections.

## 🛠️ API Modules & Endpoints

### General
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Public | API info (name, version, environment) |
| `GET` | `/api/health` | Public | Health check (status, timestamp, uptime) |

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Public | User registration |
| `POST` | `/login` | Public | Login with email & password |
| `POST` | `/logout` | Public | Logout (clear cookies) |
| `POST` | `/refresh` | Public | Refresh access token |
| `POST` | `/forgot-password` | Public | Send password reset email |
| `POST` | `/reset-password` | Public | Reset password with token |
| `GET` | `/verify-email/:token` | Public | Verify email address |
| `GET` | `/me` | Protected | Get current authenticated user |

### Services (`/api/services`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Public | List services (paginated, searchable) |
| `GET` | `/featured` | Public | Get featured services |
| `GET` | `/:id` | Public | Get service by ID |
| `POST` | `/` | Admin (create_services) | Create service (multipart: image, thumbnail) |
| `PUT` | `/:id` | Admin (edit_services) | Update service |
| `DELETE` | `/:id` | Admin (delete_services) | Delete service |

### Portfolio (`/api/portfolio`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Public | List portfolio (paginated, filterable by category) |
| `GET` | `/featured` | Public | Get featured portfolio items |
| `GET` | `/:id` | Public | Get portfolio by ID |
| `POST` | `/` | Admin (create_portfolio) | Create portfolio item (multipart: thumbnail) |
| `PUT` | `/:id` | Admin (edit_portfolio) | Update portfolio item |
| `DELETE` | `/:id` | Admin (delete_portfolio) | Delete portfolio item |

### Technologies (`/api/technologies`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Public | Get all technology categories |
| `GET` | `/featured` | Public | Get featured technology categories |
| `GET` | `/:id` | Public | Get category by ID |
| `POST` | `/` | Admin (create_technologies) | Create category (multipart: icon) |
| `PUT` | `/:id` | Admin (edit_technologies) | Update category |
| `DELETE` | `/:id` | Admin (delete_technologies) | Delete category |
| `POST` | `/:categoryId/items` | Admin (create_technologies) | Add tech item to category (multipart: icon) |
| `PUT` | `/:categoryId/items/:itemId` | Admin (edit_technologies) | Update tech item |
| `DELETE` | `/:categoryId/items/:itemId` | Admin (delete_technologies) | Delete tech item |

### Testimonials (`/api/testimonials`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Public | List testimonials (paginated) |
| `GET` | `/featured` | Public | Get featured testimonials |
| `GET` | `/:id` | Public | Get testimonial by ID |
| `POST` | `/` | Admin (create_testimonials) | Create testimonial (multipart: avatar, thumbnail) |
| `PUT` | `/:id` | Admin (edit_testimonials) | Update testimonial |
| `DELETE` | `/:id` | Admin (delete_testimonials) | Delete testimonial |

### Careers (`/api/careers`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Public | List job openings (paginated) |
| `GET` | `/:id` | Public | Get career by ID |
| `POST` | `/` | Admin (create_careers) | Create job posting (form-data) |
| `PUT` | `/:id` | Admin (edit_careers) | Update job posting |
| `DELETE` | `/:id` | Admin (delete_careers) | Delete job posting |

### CMS (`/api/cms`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/published` | Public | Get all published pages |
| `GET` | `/page/:slug` | Public | Get page by slug |
| `GET` | `/` | Protected | List all pages (admin, paginated) |
| `GET` | `/:id` | Protected | Get page by ID (admin) |
| `POST` | `/` | Admin (create_cms) | Create CMS page (form-data) |
| `PUT` | `/:id` | Admin (edit_cms) | Update CMS page |
| `DELETE` | `/:id` | Admin (delete_cms) | Delete CMS page |
| `POST` | `/:id/publish` | Admin (publish_cms) | Publish page |
| `POST` | `/:id/unpublish` | Admin (publish_cms) | Unpublish page |

### Users (`/api/users`) — All routes require authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Admin (view_users) | List users (paginated) |
| `GET` | `/:id` | Admin (view_users) | Get user by ID |
| `POST` | `/` | Admin (create_users) | Create user (multipart: avatar) |
| `PUT` | `/:id` | Admin (edit_users) | Update user |
| `PATCH` | `/:id/password` | Admin (edit_users) | Change user password |
| `DELETE` | `/:id` | Admin (delete_users) | Delete user |

### Settings (`/api/settings`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Public | Get website settings |
| `PUT` | `/` | Admin (edit_settings) | Update settings (multipart: logo, favicon) |

### Blogs (`/api/blogs`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/published` | Public | List published blogs |
| `GET` | `/:id` | Public | Get blog by ID |
| `GET` | `/:id/related` | Public | Get related blogs |
| `GET` | `/` | Admin (view_blogs) | List all blogs (paginated) |
| `POST` | `/` | Admin (create_blogs) | Create blog (multipart: featuredImage) |
| `PUT` | `/:id` | Admin (edit_blogs) | Update blog |
| `DELETE` | `/:id` | Admin (delete_blogs) | Delete blog |

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance (Local or Atlas)
- Gmail App Password (for transactional emails)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/the-fortune-tech
   JWT_SECRET=your-secure-jwt-secret
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_EXPIRES_IN=30d
   COOKIE_SECRET=your-secure-cookie-secret
   FRONTEND_URL=http://localhost:3000
   MAX_FILE_SIZE=5242880
   UPLOAD_DIR=public/uploads
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin-email@example.com
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. Run in development mode:
   ```bash
   npm run dev
   ```

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start dev server with nodemon & hot-reload |
| `build` | `npm run build` | Compile TypeScript to `dist/` |
| `start` | `npm start` | Run compiled production server |
| `start:prod` | `npm run start:prod` | Run with `NODE_ENV=production` |
| `seed` | `npm run seed` | Seed database with sample data |
| `lint` | `npm run lint` | Run ESLint on source files |
| `type-check` | `npm run type-check` | TypeScript type checking (no emit) |

### Database Seeding

To populate the database with initial sample data:
```bash
npm run seed
```

### Production Build

```bash
npm run build
npm start
```

## 🧪 Testing with Postman

Import `the-fortune-tech.postman_collection.json` into Postman to explore and test all API endpoints.

**Collection Features:**
- **Collection Variables**: `base_url` (`http://localhost:5000`) and `accessToken` (auto-set on login)
- **Auto-Authentication**: Login endpoint test script automatically captures `accessToken`
- **Organized Folders**: General, Auth, Services, Portfolio, Technologies, Testimonials, Careers, CMS, Users, Settings, Blogs
- **Sample Bodies**: Pre-configured JSON and form-data request bodies for every endpoint
- **Auth Headers**: `Bearer {{accessToken}}` automatically applied to protected endpoints

## 📏 Engineering Principles & Standards

This project strictly follows the guidelines outlined in `ENGINEERING_PRINCIPLES.md`:

- **DRY**: Centralized utilities (`utils/helpers.ts`), response formatting (`utils/response.ts`), error classes (`utils/errors.ts`), and barrel exports.
- **SOLID**: Single responsibility per controller/service, middleware chain composition, DTO-based validation.
- **Separation of Concerns**: Routes → Controllers → Services → Models with clear layer boundaries.
- **Fail Fast**: Joi validation at the request boundary via DTOs, early-return patterns in controllers.
- **Security First**: JWT HTTP-only cookies, Helmet, rate limiting, RBAC with granular permissions, bcryptjs hashing.
- **Standardized API Responses**: All endpoints return `{ success: boolean, data?: any, message?: string, error?: any }`.
- **Type Safety**: Full TypeScript with typed interfaces, DTOs, environment config, and Express middleware.

## 📡 Health Check

Verify API status at: `GET http://localhost:5000/api/health`

Response:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-02-14T00:00:00.000Z",
    "uptime": 1234.56
  }
}
```

---

Built with ❤️ by The Fortune Tech Team
