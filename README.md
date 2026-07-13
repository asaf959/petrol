# Petrol Station Management API

A complete REST API for managing petrol stations, vehicles, fuel records, profits, and expenses.

**Stack:** NestJS · TypeScript · PostgreSQL · TypeORM · Swagger · JWT Auth

---

## Quick Start

### 1. Prerequisites

- Node.js 18+
- PostgreSQL running locally (or any accessible instance)

### 2. Setup

```bash
# Install dependencies
npm install

# Copy environment file and edit your DB credentials
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=petrol_db
JWT_SECRET=your_secret_key
ADMIN_SECRET=iamadminlnb123
```

### 3. Create the PostgreSQL Database

```sql
CREATE DATABASE petrol_db;
```

### 4. Run

```bash
# Development (with hot reload)
npm run start:dev

# Production
npm run build && npm run start:prod
```

The API will auto-sync the database schema on startup (no manual migrations needed).

---

## API Documentation (Swagger)

Once running, open:

```
http://localhost:2018/api/docs
```

You can test every endpoint directly from the browser. Use the **Authorize** button to enter your JWT token.

---

## Authentication Flow

All endpoints (except `/auth/*`) require a Bearer JWT token.

### 1. Register a user

```http
POST /auth/create
{
  "email": "admin@example.com",
  "password": "password123",
  "adminSecret": "iamadminlnb123"
}
```

### 2. Login

```http
POST /auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response contains `token`. Use it as `Authorization: Bearer <token>` in all subsequent requests.

---

## API Endpoints

### Auth (public)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | Login → get JWT token |
| POST | `/auth/create` | Register new user (needs admin secret) |
| POST | `/auth/validate` | Validate a JWT token |

### Users (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | List all users |
| GET | `/user/:id` | Get user by ID |
| PUT | `/user/:id/update` | Update user |
| DELETE | `/user/:id/destroy` | Delete user |

### Vehicles (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/vehicle` | Create vehicle |
| GET | `/vehicle` | List all vehicles |
| GET | `/vehicle/:id` | Get vehicle by ID |
| PUT | `/vehicle/:id/update` | Update vehicle |
| DELETE | `/vehicle/:id/destroy` | Delete vehicle |
| GET | `/fuelRecordByVehicle/:vehicleId` | Fuel records for a vehicle |
| GET | `/profitByVehicle/:vehicleId` | Profit records for a vehicle |

### Stations (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/station` | Create station |
| GET | `/station` | List all stations |
| GET | `/station/:id` | Get station by ID |
| PUT | `/station/:id/update` | Update station |
| DELETE | `/station/:id/destroy` | Delete station |
| GET | `/fuelRecordByStation/:stationId` | Fuel records for a station |
| GET | `/profitByStation/:stationId` | Profit records for a station |

### Fuel Records (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/fuelRecord` | Create fuel record (auto-logs first payment) |
| GET | `/fuelRecord` | List all fuel records |
| GET | `/fuelRecord/:id` | Get fuel record by ID |
| PUT | `/fuelRecord/:id/update` | Update (pass `amountPaid` to add a payment log) |
| DELETE | `/fuelRecord/:id/destroy` | Delete fuel record |

### Profits (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/profit` | Create profit record |
| GET | `/profit` | List all profit records |
| GET | `/profit/:date` | Get profits for a date with calculated summary |
| GET | `/profitById/:id` | Get profit by ID |
| PUT | `/profit/:id/update` | Update profit record |
| DELETE | `/profit/:id/destroy` | Delete profit record |

### Personal Expenses (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/personalExpense` | Create personal expense |
| GET | `/personalExpense` | List all personal expenses |
| GET | `/personalExpense/:id` | Get by ID |
| PUT | `/personalExpense/:id/update` | Update |
| DELETE | `/personalExpense/:id/destroy` | Delete |

### Partner Expenses (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/partnerExpense` | Create partner expense |
| GET | `/partnerExpense` | List all partner expenses |
| GET | `/partnerExpense/:id` | Get by ID |
| PUT | `/partnerExpense/:id/update` | Update |
| DELETE | `/partnerExpense/:id/destroy` | Delete |

---

## Database

Tables auto-created by TypeORM on startup:

- `users`
- `vehicles`
- `stations`
- `fuel_records`
- `fuel_record_logs`
- `profits`
- `personal_expenses`
- `partner_expenses`

---

## Project Structure

```
src/
├── main.ts                    # Entry point + Swagger setup
├── app.module.ts              # Root module + TypeORM config
├── auth/                      # JWT auth (login, register, validate)
├── users/                     # User CRUD
├── vehicles/                  # Vehicle CRUD + aggregations
├── stations/                  # Station CRUD + aggregations
├── fuel-records/              # Fuel records + payment log system
├── profits/                   # Profit records + date-based calculation
├── personal-expenses/         # Personal expense tracking
├── partner-expenses/          # Partner expense tracking
└── common/
    ├── guards/                # JWT auth guard
    └── decorators/            # @Public(), @CurrentUser()
```
