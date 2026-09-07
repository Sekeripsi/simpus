# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SIMPUS** is a comprehensive healthcare management system for community health centers (Puskesmas) built with Next.js 16, React 19, TypeScript, PostgreSQL, and Prisma ORM. The system handles patient registration, medical records, clinical data, staff management, and authentication.

## Development Commands

### Setup & Installation
```bash
npm install                    # Install dependencies
cp .env.example .env          # Setup environment variables (edit with real database credentials)
npx prisma migrate dev        # Run migrations and sync database schema
npm run db:seed               # Seed database with sample data
```

### Development
```bash
npm run dev                   # Start Next.js dev server (http://localhost:3000)
npm run build                 # Production build
npm start                     # Run production build
```

### Code Quality
```bash
npm run lint                  # Run ESLint
npx eslint . --fix           # Auto-fix ESLint issues
npm test                      # Run all tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Generate coverage report
```

### Database
```bash
npx prisma migrate dev --name <description>    # Create new migration
npx prisma studio                               # Open Prisma Studio (visual DB editor)
npx prisma db push                              # Sync schema to database (dev only)
npx prisma db seed                              # Run seed script manually
```

### Running Single Tests
```bash
npm test -- <file-pattern>           # Run specific test file
npm test -- --testNamePattern="test name"  # Run test by name
npm run test:watch -- <file-pattern>  # Watch mode for specific file
```

## Architecture Overview

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| Backend | Next.js API Routes, Node.js |
| Database | PostgreSQL, Prisma 7.5.0 (PrismaPg adapter) |
| Authentication | NextAuth.js 5 (beta) with credentials provider |
| Validation | Zod schemas (type-safe validation) |
| Testing | Jest 30, React Testing Library |
| Linting | ESLint 9 with Next.js config |

### Core Directory Structure

```
simpus/
├── app/
│   ├── api/                    # API routes (RESTful endpoints)
│   │   ├── auth/[...nextauth]/ # NextAuth.js endpoints
│   │   ├── health/             # Health check endpoint
│   │   ├── user/               # User profile endpoints (GET, PUT)
│   │   └── protected-example/   # Example protected route
│   ├── (auth)/                 # Auth-related routes (layout group)
│   │   ├── login/              # Login page
│   │   └── error.tsx           # Auth error boundary
│   ├── components/             # React components
│   │   ├── auth/               # Auth-related components
│   │   ├── shared/             # Reusable components
│   │   └── loading/            # Loading skeletons
│   ├── home/                   # Dashboard page
│   ├── rekam-medis/            # Medical records page
│   ├── globals.css             # Global styles with color system
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home redirect
│   └── error.tsx               # Global error boundary
├── lib/                        # Shared utilities
│   ├── actions/                # Server actions (form handling)
│   ├── api-auth.ts             # Auth middleware (requireAuth, withAuth, withRoleAuth)
│   ├── prisma.ts               # Prisma client singleton
│   ├── logger.ts               # Logging utility (use instead of console)
│   ├── audit-log.ts            # Audit logging for compliance
│   ├── env.ts                  # Environment validation at startup
│   ├── config/
│   │   └── routes.ts           # Route configuration
│   └── validations/            # Zod schemas (auth, user, rekam-medis)
├── prisma/
│   ├── schema.prisma           # Data models (User, Patient, MedicalRecord, etc.)
│   └── seed.ts                 # Database seeding script
├── __tests__/                  # Jest test files
├── jest.config.ts              # Jest configuration
├── jest.setup.ts               # Jest setup (jsdom environment)
├── eslint.config.mjs           # ESLint rules (strict TypeScript, no-console, etc.)
├── next.config.ts              # Next.js config (validates env at startup)
├── tailwind.config.ts          # Tailwind configuration with color system
├── tsconfig.json               # TypeScript strict mode
├── auth.ts                     # NextAuth.js configuration
├── auth.config.ts              # Auth session callbacks
└── docs/
    ├── architecture.md         # Detailed architecture guide
    ├── development.md          # Development patterns and standards
    ├── setup.md                # Setup instructions
    ├── api.md                  # API endpoint documentation
    └── COLOR_SYSTEM.md         # Color system guide (⭐ NEW - Updated 2026-03-31)
```

### Data Models (Prisma)

**Key Models:**
- **User**: System users with roles (ADMIN, DOCTOR, NURSE, USER)
  - Fields: id, username, password (bcrypt hashed), name, role, timestamps
  - Password security: 10 salt rounds with bcryptjs
- **Patient**: Patient/person records (Nomor RM - medical record number)
  - Fields: id, recordNumber (unique), name, gender, birthDate, address, phone, email
  - Relations: medicalRecords (one-to-many)
- **MedicalRecord**: Clinical records linked to patients
  - Fields: id, patientId, visitDate, clinic, complaint, diagnosis, treatment
  - Relations: patient (many-to-one)

See `prisma/schema.prisma` for complete schema.

## Authentication & Authorization

### Authentication Flow
1. User submits credentials at `/login`
2. LoginForm validates input with Zod schema
3. NextAuth.js Credentials provider calls authorize callback
4. Password verified with bcrypt.compare()
5. Session created in HTTP-only cookies
6. Protected routes check session via `auth()` function

### Protecting Routes & APIs

**Server Components:**
```typescript
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/")

  return <div>Admin content</div>
}
```

**API Routes:**
```typescript
import { withAuth, withRoleAuth } from "@/lib/api-auth"

// Basic auth protection
export const GET = withAuth(async (request) => {
  return NextResponse.json({ user: request.user })
})

// Role-based protection
export const DELETE = withRoleAuth(["ADMIN"], async (request) => {
  // Only admins can delete
})
```

## Important Development Patterns

### Server Actions
Located in `lib/actions/`. Handle form submissions and data mutations:
```typescript
"use server"
import { loginSchema } from "@/lib/validations/auth"

export async function loginAction(formData: FormData) {
  const input = { /* extract from formData */ }
  const validated = loginSchema.parse(input)  // Zod validation
  // Process and redirect or return error
}
```

### API Routes
RESTful endpoints in `app/api/`. Follow this pattern:
```typescript
import { withAuth } from "@/lib/api-auth"

export const GET = withAuth(async (request) => {
  const data = await prisma.user.findUnique({...})
  return NextResponse.json(data)
})

export const PUT = withAuth(async (request) => {
  const body = await request.json()
  // validate with Zod, update, return
})
```

### Validation
Always validate input with Zod schemas in `lib/validations/`:
```typescript
import { z } from "zod"

export const updateUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().optional(),
})
```

### Logging
Use the logger utility instead of console:
```typescript
import { logger } from "@/lib/logger"

logger.info("User created", { userId, username })
logger.warn("Slow query", { duration: 5000 })
logger.error("DB error", error)
// console.log("...") will be caught by ESLint
```

### Database Operations
Use Prisma client from singleton:
```typescript
import { prisma } from "@/lib/prisma"

const user = await prisma.user.findUnique({ where: { id: "..." } })
await prisma.medicalRecord.create({
  data: { patientId, visitDate, clinic, complaint, diagnosis, treatment }
})
```

## Code Standards

### TypeScript
- Strict mode enabled (`"strict": true`)
- No `any` types allowed (ESLint rule)
- All variables and function parameters must be typed

### Naming Conventions
- **Components**: PascalCase (`LoginForm`, `DashboardSkeleton`)
- **Files**:
  - Components: `ComponentName/index.tsx`
  - Utilities: `kebab-case.ts` (`audit-log.ts`, `api-auth.ts`)
  - API routes: `route.ts`
- **Functions/Variables**: camelCase (`handleSubmit`, `userData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_PASSWORD_LENGTH`)

### ESLint Rules
Enforced via `eslint.config.mjs`:
- `no-console`: Only `console.warn`, `console.error`, `console.info` allowed (use logger for app logic)
- `@typescript-eslint/no-explicit-any`: Error - no `any` type
- `@typescript-eslint/no-unused-vars`: Error (args starting with `_` ignored)
- `no-var`: Error - use `let`/`const` only
- `eqeqeq`: Error - use `===` only

## Default Test Credentials

After running `npm run db:seed`:

| Role   | Username   | Password      |
|--------|-----------|---------------|
| Admin  | admin     | admin123456   |
| Doctor | dr_budi   | doctor12345   |
| Nurse  | suster_ani| nurse123456   |

## Environment Variables

`.env.example` provides the template. Required variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/simpus_db
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

Environment validation runs at startup in `next.config.ts` and will fail the build if required vars are missing.

## Common Workflow

### Adding a New Feature
1. Create component in `app/components/feature/ComponentName/index.tsx`
2. Add Zod validation schema in `lib/validations/feature.ts` (if needed)
3. Create API route in `app/api/feature/route.ts` (if needed)
4. Add tests in `__tests__/components/feature/ComponentName.test.tsx`
5. Run `npm run lint` and `npm test` to verify

### Debugging
- Check logs in terminal (using logger utility)
- Use Prisma Studio: `npx prisma studio`
- Run tests in watch mode: `npm run test:watch`
- Check TypeScript errors: `tsc --noEmit`

### Before Committing
```bash
npm run lint      # Must pass with 0 errors
npm test          # All tests must pass
npm run build     # Build must succeed
```

## Performance Considerations

1. **Connection Pooling**: PrismaPg adapter handles pooling automatically
2. **Query Optimization**: Use Prisma `select` to fetch only needed fields
3. **Avoid N+1 Queries**: Use relations efficiently in Prisma queries
4. **Server Components**: Preferred for data fetching (used in `home/page.tsx`, `rekam-medis/page.tsx`)
5. **Loading States**: Use skeleton components during async operations

## Important Files to Know

| File | Purpose |
|------|---------|
| `auth.ts` | NextAuth.js setup with Credentials provider, password verification, audit logging |
| `auth.config.ts` | NextAuth session/JWT callbacks |
| `lib/api-auth.ts` | Middleware: `requireAuth()`, `withAuth()`, `withRoleAuth()` |
| `lib/prisma.ts` | Singleton Prisma client (use across app) |
| `lib/logger.ts` | Structured logging utility |
| `lib/audit-log.ts` | Compliance audit trail logging |
| `lib/env.ts` | Environment variable validation |
| `.env.example` | Template for required environment variables |
| `prisma/schema.prisma` | Data model definitions |
| `tailwind.config.ts` | Tailwind CSS with complete color system |
| `app/globals.css` | Global styles with CSS color variables |
| `docs/COLOR_SYSTEM.md` | Complete color system documentation ⭐ |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Unauthorized" on protected routes | Check session exists: `await auth()` returns valid session |
| TypeScript errors with unknown types | Ensure types are imported from correct files (check Prisma client imports) |
| ESLint failing on `console.log` | Use `logger.info()` instead |
| Database connection errors | Verify `DATABASE_URL` in `.env`, run `npm run db:seed` to test |
| "Port 3000 already in use" | Use `npm run dev -- -p 3001` or kill existing process |
| Prisma client out of sync | Run `npx prisma generate` to regenerate types |

## Next.js 16 Notes

This project uses **Next.js 16.2.1** (breaking changes from older versions). Always check `/node_modules/next/dist/docs/` for current API documentation before implementing features. Key differences:
- App Router (no Pages directory)
- React 19 with new features
- Server Components by default
- TypeScript strict mode required

## Testing Best Practices

- Tests located in `__tests__/` directory
- Use React Testing Library for component tests
- Mock external dependencies (Prisma, NextAuth)
- Jest config maps `@/` to root for imports
- Run `npm run test:coverage` to identify gaps

## References

- **Architecture**: See `docs/architecture.md`
- **Development Guide**: See `docs/development.md`
- **Setup Instructions**: See `docs/setup.md`
- **API Documentation**: See `docs/api.md`
- **Color System**: See `docs/COLOR_SYSTEM.md` ⭐ **START HERE for styling**
- **External Docs**:
  - [Next.js 16 Docs](https://nextjs.org/docs)
  - [Prisma Docs](https://www.prisma.io/docs)
  - [NextAuth.js Docs](https://next-auth.js.org)
  - [TypeScript Handbook](https://www.typescriptlang.org/docs)
  - [Tailwind CSS](https://tailwindcss.com/docs)
  - [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum)

## Color System (Updated 2026-03-31)

### Quick Reference

**Primary Brand Colors:**
- **Teal (#0c96b5)**: Main actions, headers, primary buttons
- **Blue (#1077bd)**: Secondary actions, borders, accents

**Status Colors:**
- **Success (#22c55e)**: Approvals, confirmations
- **Warning (#f59e0b)**: Alerts, caution
- **Danger (#ef4444)**: Errors, destructive actions

### Usage Examples

```tsx
// Primary button
<button className="bg-primary-500 text-white hover:bg-primary-600">
  Submit
</button>

// Secondary button
<button className="bg-secondary-500 text-white hover:bg-secondary-600">
  Save
</button>

// Using color scales for hierarchy
<div className="bg-primary-50">Light background</div>  {/* Very light */}
<div className="bg-primary-500">Strong accent</div>    {/* Primary */}
<div className="bg-primary-900">Dark overlay text</div>{/* Dark */}

// Gradient for hero sections
<div className="bg-gradient-to-r from-primary-500 to-secondary-500">
  Hero Content
</div>

// Status indicators
<span className="bg-success-100 text-success-700">Approved</span>
<span className="bg-warning-100 text-warning-700">Pending</span>
<span className="bg-danger-100 text-danger-700">Error</span>
```

### Documentation Files

**Start here for styling tasks:**

1. **`docs/COLOR_QUICK_REFERENCE.md`** ← **START HERE** for quick copy-paste examples
2. **`docs/COLOR_SYSTEM.md`** ← Complete color palette and guidelines
3. **`docs/IMPLEMENTATION_GUIDE.md`** ← Real-world component examples
4. **`tailwind.config.ts`** ← Tailwind CSS configuration with all color scales
5. **`app/globals.css`** ← CSS custom properties and global styles
