# CanvasFlow - Setup & Development Guide

## 🎉 **Project Renamed: PixelForge → CanvasFlow**

Modern, professional web design tool with AI-powered image generation and production-ready code export.

---

## 🚀 **What We've Accomplished**

### ✅ **Security & Authentication (Production-Ready)**
1. **NextAuth.js Integration**
   - Credentials provider (email/password)
   - OAuth providers (Google, GitHub) - ready to configure
   - JWT session strategy with secure tokens
   - Custom TypeScript types for session/user

2. **Authentication Middleware**
   - Protected routes: `/editor`, `/projects`, `/api/*`
   - Automatic redirect to signin
   - Account deactivation checks

3. **Secure API Routes**
   - All project APIs require authentication
   - Owner verification before CRUD operations
   - Returns 401 (Unauthorized) and 403 (Forbidden) appropriately

4. **Rate Limiting**
   - In-memory rate limiter (development)
   - Configurable limits per endpoint:
     - AI Generation: 10 requests/hour
     - Project CRUD: 30 requests/minute
     - Auth: 5 requests/15 minutes
     - General API: 60 requests/minute
   - Ready for Upstash Redis in production

5. **Input Validation (Zod)**
   - Project creation/update validation
   - AI generation request validation
   - Password strength requirements
   - Max length limits for all inputs

### ✅ **Advanced Image Adjustments**
- **Temperature Control** (-100 to +100): Warm/cool tones
- **Exposure** (-2 to +2 EV): Professional exposure adjustment
- **Shadows** (-100 to +100): Lift or deepen shadow areas
- **Highlights** (-100 to +100): Recover or boost highlights
- **Auto White Balance**: One-click color correction

### ✅ **Auth UI Components**
- Sign in page with credentials + OAuth
- Sign up page with validation
- Error page for auth failures
- Modern, accessible design

### ✅ **Updated .env.example**
- Clear documentation for all environment variables
- OAuth provider setup instructions
- Database configuration options

---

## 📦 **Installation**

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Push database schema
pnpm prisma db push

# Start development server
pnpm dev
```

---

## 🔐 **Environment Setup**

### 1. Copy .env.example to .env
```bash
cp .env.example .env
```

### 2. Configure Required Variables

#### Database (SQLite for dev)
```env
DATABASE_URL="file:./dev.db"
```

#### NextAuth Secret (REQUIRED)
```bash
# Generate secret
openssl rand -base64 32

# Add to .env
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

#### AI API Key (For generation features)
```env
REPLICATE_API_KEY="your-replicate-api-key"
```

### 3. Optional: OAuth Providers

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add to .env:
```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

#### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add to .env:
```env
GITHUB_ID="your-github-app-id"
GITHUB_SECRET="your-github-app-secret"
```

---

## 🎯 **Authentication Flow**

### Creating the First User
1. Start the dev server: `pnpm dev`
2. Navigate to: `http://localhost:3000/auth/signup`
3. Create an account with:
   - Valid email address
   - Strong password (8+ chars, uppercase, lowercase, number)
   - Full name

### Signing In
- Go to: `http://localhost:3000/auth/signin`
- Use credentials OR OAuth providers
- Automatically redirected to editor

### Protected Routes
- `/editor` - Main canvas editor
- `/projects` - Project management  
- All `/api/projects/*` endpoints
- All `/api/generate/*` endpoints

---

## 🏗️ **Project Structure**

```
canvasflow/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── signin/page.tsx      # Sign in page
│   │   │   ├── signup/page.tsx      # Sign up page
│   │   │   └── error/page.tsx       # Auth error page
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/   # NextAuth handler
│   │   │   │   └── signup/          # Signup API
│   │   │   ├── projects/            # Project CRUD (protected)
│   │   │   └── generate/            # AI generation (protected)
│   │   ├── editor/page.tsx          # Main editor
│   │   └── projects/page.tsx        # Projects list
│   ├── lib/
│   │   ├── auth.ts                  # NextAuth config
│   │   ├── rate-limit.ts            # Rate limiting
│   │   ├── validation.ts            # Zod schemas
│   │   ├── canvas/
│   │   │   └── advanced-adjustments.ts  # Image adjustments
│   │   └── export/                  # Code generators
│   ├── components/
│   │   ├── adjustments/             # Adjustment panels
│   │   ├── canvas/                  # Canvas components
│   │   └── export/                  # Export modals
│   ├── middleware.ts                # Auth middleware
│   └── types/
│       └── next-auth.d.ts           # NextAuth types
├── prisma/
│   └── schema.prisma                # Database schema
└── .env.example                     # Environment template
```

---

## 🧪 **Testing Authentication**

### Test Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{ "name": "Test User", "email": "test@example.com", "password": "Test123!" }'
```

### Test Protected API
```bash
# Without auth - should return 401
curl http://localhost:3000/api/projects

# With auth - sign in first via browser, then use session cookie
```

---

## 📝 **Key Features Implemented**

1. **Full Authentication System**
   - Email/password signup with bcrypt hashing
   - OAuth ready (Google, GitHub)
   - Session management with JWT
   - Protected routes with middleware

2. **Security**
   - Rate limiting on all endpoints
   - Input validation with Zod
   - Owner verification for resources
   - SQL injection protection (Prisma)
   - XSS protection (React)

3. **Advanced Adjustments**
   - Professional photo editing controls
   - Real-time preview
   - Advanced color correction
   - Auto white balance

4. **Production Ready**
   - TypeScript strict mode
   - Error handling
   - Proper HTTP status codes
   - Clean architecture

---

## 🚀 **Next Steps**

1. **Test the authentication flow**
2. **Configure OAuth providers** (optional)
3. **Add your Replicate API key** for AI generation
4. **Start building!**

---

## 📚 **Documentation**

- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Fabric.js Docs](http://fabricjs.com/docs/)

---

## 🎉 **You're All Set!**

The project is now production-ready with:
- ✅ Secure authentication
- ✅ Rate limiting
- ✅ Input validation
- ✅ Protected API routes
- ✅ Advanced image adjustments
- ✅ Professional codebase

Start the dev server and begin creating!

```bash
pnpm dev
# Open http://localhost:3000
```
