# The Fortune Tech - Backend API

A robust, enterprise-grade backend API built with Node.js, Express, and TypeScript, powering The Fortune Tech's IT consulting ecosystem.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Language**: TypeScript 5.9.3
- **Database**: MongoDB (via Mongoose 8.x)
- **Authentication**: JWT (JSON Web Tokens) with Cookie-based storage
- **Validation**: Joi
- **Email Service**: SendGrid & Nodemailer
- **Security**: Helmet, Express Rate Limit, bcryptjs
- **Logging**: Morgan
- **Development**: nodemon, ts-node

## 📁 Project Structure

```
├── src/
│   ├── config/            # Environment & database configuration
│   ├── controllers/       # Route handlers (Business logic)
│   ├── dtos/             # Data Transfer Objects & validation types
│   ├── interfaces/        # Shared TypeScript interfaces
│   ├── middlewares/       # Auth, error handling, validation middlewares
│   ├── models/            # Mongoose schemas & models
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic & 3rd party integrations
│   ├── utils/             # Helper functions (API response, error classes)
│   ├── scripts/           # Maintenance & seeding scripts
│   ├── app.ts            # Express app configuration
│   └── server.ts         # Server entry point
├── public/                # Static assets & public uploads
├── dist/                  # Compiled JavaScript (for production)
└── the-fortune-tech.postman_collection.json # API Documentation
```

## 🔒 Security Features

- **JWT Authentication**: Secure stateless authentication with HTTP-only cookies.
- **RBAC (Role-Based Access Control)**: Permission levels for Admin and User roles.
- **Data Validation**: Strict input validation using Joi schemas to prevent malformed data.
- **Security Headers**: Helmet integration for protecting against well-known web vulnerabilities.
- **Rate Limiting**: Brute-force protection for API endpoints.
- **Password Hashing**: Industry-standard bcryptjs for secure credential storage.
- **CORS**: Domain-specific access control for frontend integration.
- **XSS/Sanitization**: Middleware for sanitizing incoming request data.

## 🛠️ API Modules

- **Auth**: Login, Register, Logout, Profile Management, Password Reset.
- **Services**: Management of service offerings with categorization.
- **Portfolio**: Project showcase, tech stack associations, and image handling.
- **Technologies**: Dynamic tech stack management for the showcase.
- **CMS**: Dynamic page content management (About, Privacy, Terms).
- **Testimonials**: Client feedback management.
- **Careers**: Job postings and application management.
- **Settings**: Global website configuration and SEO settings.
- **Users**: Admin-level user management.

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+ (Package uses 24.x features in @types/node)
- MongoDB instance (Local or Atlas)
- SendGrid API Key (for emails)

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
   # Update .env with your credentials (PORT, MONGO_URI, JWT_SECRET, SENDGRID_API_KEY, etc.)
   ```

4. Run in development mode:
   ```bash
   npm run dev
   ```

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

Import the `the-fortune-tech.postman_collection.json` file into Postman to explore and test all available API endpoints. The collection includes:
- Pre-configured environment variables
- Organized folders for each module
- Sample request bodies
- Authentication headers (automatically handled via cookies in Postman)

## 📡 Health Check

Verify API status at: `GET http://localhost:5000/api/health`

---

Built with ❤️ by The Fortune Tech Team
