# SIMPUS (Sistem Informasi Manajemen Puskesmas)

SIMPUS is a modern healthcare management system designed for community health centers. It handles patient registration, medical records, and staff management with a robust role-based access control system.

## 🚀 Quick Start (Docker)

The fastest way to get the project running is using Docker Compose. This single command will set up the application, the database, and run all necessary migrations and seeds.

### 1. Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 2. Run the project
```bash
# Clone the repository
git clone <repository-url>
cd simpus

# Start everything
docker compose up --build
```

Wait until the logs show the Next.js server is ready. The first run will automatically:
1. Initialize a MySQL 8.4 database.
2. Apply Prisma migrations.
3. Seed the database with sample users, patients, and medical records.

### 3. Access the services

| Service | URL |
|---------|-----|
| **SIMPUS App** | [http://localhost:3000](http://localhost:3000) |
| **phpMyAdmin** | [http://localhost:8080](http://localhost:8080) |

---

## 🔐 Default Credentials

After the automatic seeding, you can log in with these accounts:

| Role | Username | Password |
|------|----------|----------|
| **Administrator** | `admin` | `admin123456` |
| **Doctor** | `dr_budi` | `doctor12345` |
| **Staff/Nurse** | `suster_ani` | `staff123456` |

---

## 🛠️ Development & Management

### Environment Setup
For Docker, the system is pre-configured to work out of the box. If you need to customize settings, copy the example file:
```bash
cp .env.local.docker .env.local
```

### Docker Helper Script
A helper script is provided for common tasks:
```bash
# Show status of all services
./docker-helper.sh status

# View live logs
./docker-helper.sh logs

# Re-seed the database
./docker-helper.sh db:seed

# Reset the database (CAUTION: Deletes all data)
./docker-helper.sh clean
```

### Manual Development (Non-Docker)
If you prefer to run the project locally:
1. Install dependencies: `npm install`
2. Set up your `.env` file (see `.env.example`).
3. Run migrations: `npx prisma migrate dev`
4. Seed data: `npm run db:seed`
5. Start server: `npm run dev`

---

## 📚 Documentation
For more detailed information, please refer to:
- `docs/DOCUMENTATION.md`: Full system architecture and features.
- `SEARCH_IMPROVEMENTS_SUMMARY.md`: Details on recent search logic updates.
- `QUICK_REFERENCE.md`: Quick command list for developers.

---

## 🧪 Testing
```bash
# Run all tests (Docker)
./docker-helper.sh app:test

# Run all tests (Local)
npm test
```

---

**SIMPUS Team** | ✅ Production Ready | Version 1.0.0
