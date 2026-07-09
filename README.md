# EH2H Booking Platform REST API

Welcome to the **EH2H Booking Platform REST API**! This backend service is built using the **NestJS** framework, **TypeScript**, **Prisma ORM**, and **PostgreSQL** (running containerized via Docker). 

This platform allows managing services (e.g., medical consultation, sessions) and customer bookings.

---

## Technical Stack
- **Framework**: NestJS (v11.x)
- **Database**: PostgreSQL (v15.x, containerized via docker-compose)
- **ORM**: Prisma (v7.x)
- **Language**: TypeScript

---

## Project Structure
The project follows NestJS best-practice modular architecture:
```
src/
  ├── auth/                  # JWT Authentication Module (Register, Login)
  │    ├── dto/              # Auth request body validation DTOs
  │    ├── guards/           # JWT Guards for securing routes
  │    └── strategies/       # Passport JWT token verification strategy
  ├── services/              # Service CRUD Module (secured write operations, open read)
  │    └── dto/              # Service request DTOs
  ├── bookings/              # Booking CRUD & Core Business Logic Validation Module
  │    └── dto/              # Booking request DTOs
  ├── prisma/                # Prisma client wrapper module
  ├── app.module.ts          # Global AppModule connecting all modules
  └── main.ts                # App entrypoint (registers Global Validation Pipes)
prisma/
  ├── schema.prisma          # Database models (User, Service, Booking, Status enum)
  ├── seed.ts                # Seeder script populating initial services and admin
  └── migrations/            # Generated database migration files
```

---

## Installation & Running

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18+)
- **NPM** (v9+)
- **Docker Desktop** (running)

### 2. Project Setup
Clone this repository copy, and navigate to the project root:
```bash
npm install
```

### 3. Environment Variables Setup
Copy the environment template file:
```bash
cp .env.example .env
```
Ensure your `.env` contains the correct database configuration & secrets. By default, it connects to the PostgreSQL container:
```properties
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/booking_db?schema=public"
JWT_SECRET="abigsecretkeychangeitinproduction"
JWT_EXPIRES_IN="1d"
PORT=3000
```

### 4. Database Setup & Docker Containers
Start the PostgreSQL container:
```bash
docker-compose up -d
```

### 5. Running Database Migrations
Create databases and tables defined in Prisma schema:
```bash
npx prisma migrate dev --name init
```

### 6. Database Seeding
Pre-populate the database with default services and an admin account:
```bash
npx prisma db seed
```

**Seeded Credentials**:
- **Admin Email**: `admin@example.com`
- **Admin Password**: `adminpassword`

---

## Running the Application

```bash
# Start in development/watch mode
npm run start:dev

# Start in production mode
npm run start:prod
```
The API is served locally at `http://localhost:3000`.

---

## Core API Endpoints

### 1. Authentication
*   `POST /auth/register` (Public) - Create a new user account.
*   `POST /auth/login` (Public) - Authenticate and receive a Bearer JWT Token.

### 2. Service Management
*   `GET /services` (Public) - Retrieve all services.
*   `GET /services/:id` (Public) - Retrieve details of a specific service by ID.
*   `POST /services` (Authenticated) - Create a service slot.
*   `PUT /services/:id` (Authenticated) - Update an existing service.
*   `DELETE /services/:id` (Authenticated) - Delete a service slot.

### 3. Booking Management
*   `POST /bookings` (Public) - Create a new booking slot (No auth needed, open to customers).
*   `GET /bookings` (Authenticated) - Get all bookings.
*   `GET /bookings/:id` (Authenticated) - Get a booking by ID.
*   `PATCH /bookings/:id/status` (Authenticated) - Update reservation status (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).
*   `PATCH /bookings/:id/cancel` (Public) - Cancel reservation slot.

---

## Business Validation Rules Implemented
1. **Existing Service constraint**: Bookings can only be made against active, existing services.
2. **Future Date check**: Bookings cannot be set in the past. Date and time are parsed together to ensure they represent a future slot.
3. **Double Booking Guard**: Prevents duplicate bookings for the **same service, date, and time** (ignores slots where booking status is `CANCELLED`).
4. **Transition restrictions**: Prevents transitioning a booking status directly from `CANCELLED` to `COMPLETED`.

---

## Completed Bonus Features
Consistent with the requirements, we implemented these advanced features:
- **Swagger Documentation**: Live interactive endpoints console served under `/api/docs`.
- **Pagination & Search**: Skip/take querying with metadata return response, text searching, and date-range filters.
- **Global Exception Filter**: Automatic mapping of database constraint errors to user-friendly HTTP client codes (409/404).
- **Unit Testing**: Jest mock test suite covering creation rules, double-booking prevention, and state transition logic.
- **Docker Support**: Containerized PostgreSQL setup for immediate configuration.

---

## Assumptions Made
1. **Double Booking Isolation**: Overlapping check holds active only when comparing slots where the status is not `CANCELLED`.
2. **Access Control**: Users registering are treated as administrative entities that manage services. Customer bookings are public.
3. **JWT Validity**: Since refresh token rotation is an optional item, simple JWT expiration is utilized without a Redis blacklist or DB token store.

---

## Future Improvements
- **Refresh Token Rotation**: Implement standard token reissue.
- **Role-based Authentication**: Implement distinct employee (Operator, Advisor) vs. Admin roles.
- **Slots Scheduler**: Integrate calendar library for dynamic slot validation instead of raw hour/minute checks.

