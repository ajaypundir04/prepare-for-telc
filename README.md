# prepare-for-telc: Standardized German Exam Preparation Platform

An end-to-end, multi-service monorepo platform designed for TELC German language certification preparation (A1–C1). This project features a containerized Java 25 Spring Boot REST API built with Domain-Driven Design (DDD) and Maven (`pom.xml`), an Angular 18+ client application with audio playback guardrails and distraction-free test runners, GitHub Actions CI/CD workflows, and multi-service Infrastructure-as-Code for deployment on Render.

---

## 1. Monorepo Topology (Domain-Driven Design)

```text
/prepare-for-telc
├── backend/                                   # Java 25 Spring Boot API (Maven & DDD)
│   ├── src/main/java/com/preparefortelc/
│   │   ├── identity/                          # IAM Bounded Context
│   │   │   ├── domain/                        # User aggregate root, Role enum, UserRepository port
│   │   │   ├── application/                   # AuthApplicationService, DTOs (AuthRequest, RegisterRequest)
│   │   │   ├── infrastructure/                # JPA adapters, JWT provider, Spring Security filter & config
│   │   │   └── presentation/                  # AuthController (/api/auth/**)
│   │   ├── questionbank/                      # Question Bank Bounded Context
│   │   │   ├── domain/                        # Question aggregate, ExamLevel, ExamModule, QuestionRepository port
│   │   │   ├── application/                   # QuestionApplicationService, QuestionRequest DTO
│   │   │   ├── infrastructure/                # JpaQuestionRepository, database indexing
│   │   │   └── presentation/                  # QuestionController (/api/questions/**)
│   │   ├── exam/                              # Exam Blueprint Bounded Context
│   │   │   ├── domain/                        # Exam aggregate root, ExamRepository port
│   │   │   ├── application/                   # ExamApplicationService, ExamRequest DTO
│   │   │   ├── infrastructure/                # JpaExamRepository
│   │   │   └── presentation/                  # ExamController (/api/exams/**)
│   │   ├── assignment/                        # Exam Dispatch Bounded Context
│   │   │   ├── domain/                        # ExamAssignment aggregate, AssignmentStatus enum, repo port
│   │   │   ├── application/                   # AssignmentApplicationService, AssignmentRequest DTO
│   │   │   ├── infrastructure/                # JpaExamAssignmentRepository, student index
│   │   │   └── presentation/                  # AssignmentController (/api/assignments/**)
│   │   ├── grading/                           # Auto-Grading & Diagnostic Bounded Context
│   │   │   ├── domain/                        # ExamResult aggregate, GradingDomainService (60% threshold logic)
│   │   │   ├── application/                   # GradingApplicationService, DTOs (Submission, Score breakdowns)
│   │   │   ├── infrastructure/                # JpaExamResultRepository
│   │   │   └── presentation/                  # SubmissionController (/api/assignments/{id}/submit, /results/**)
│   │   ├── shared/                            # Cross-cutting Domain & Config
│   │   │   └── config/                        # DataInitializer (mock data seed)
│   │   └── PrepareForTelcApplication.java     # Spring Boot application entry point
│   ├── src/main/resources/application.yml     # HikariCP pool, PostgreSQL datasource, JWT secrets
│   ├── pom.xml                                # Maven project file (Java 25, Spring Boot 3.4.2)
│   ├── mvnw / mvnw.cmd                        # Maven Wrapper scripts
│   └── Dockerfile                             # Multi-stage production container (Maven 3.9 + Java 25 JRE)
├── frontend/                                  # Angular 18+ TypeScript Application
│   ├── src/app/
│   │   ├── core/                              # JWT Interceptor, AuthGuard, RoleGuard, Base Services
│   │   ├── features/                          # Student Portal, Teacher CMS, Exam Runner, Result Diagnostic
│   │   └── shared/                            # Audio Guardrail, Timer, Progress Bar, Navbar
│   ├── angular.json                           # Production build configuration & budgets
│   ├── package.json                           # Angular 18+, RxJS, TypeScript dependencies
│   ├── nginx.conf                             # SPA routing fallback & asset caching
│   └── Dockerfile                             # Multi-stage build (Node 22 builder + Nginx static server)
├── .github/workflows/
│   └── ci-cd.yml                              # GitHub Actions CI/CD Pipeline (Java 25, Node 22, Render Deploy)
├── render.yaml                                # Multi-service Render Infrastructure-as-Code
├── RENDER_DEPLOYMENT.md                       # Comprehensive Render deployment guide
├── docker-compose.yml                         # Local full-stack development orchestration
└── README.md
```

---

## 2. Dedicated Render Deployment Guide

A complete, step-by-step deployment manual with Blueprint and manual dashboard setups, environment variable configurations, and automated GitHub Actions deploy hooks is available in:

👉 **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)**

---

## 3. GitHub Actions CI/CD Pipeline

The monorepo includes a pipeline in [`.github/workflows/ci-cd.yml`](./.github/workflows/ci-cd.yml):

- **Backend CI Job:** Sets up Java 25, caches Maven dependencies, and runs `./mvnw -B clean verify` to ensure domain integrity and auto-grading tests pass.
- **Frontend CI Job:** Sets up Node 22, executes `npm ci`, compiles Angular with production optimizations, and validates the `./dist/frontend/browser` bundle.
- **Continuous Deployment (CD) Job:** Automatically triggers Render deployment webhooks via repository secrets (`RENDER_API_DEPLOY_HOOK`, `RENDER_WEB_DEPLOY_HOOK`) on push to `main`.

---

## 4. End-to-End Render Blueprint Architecture (`render.yaml`)

```yaml
services:
  # 1. Spring Boot Backend API Service (Java 25)
  - type: web
    name: prepare-for-telc-api
    env: docker
    rootDir: backend
    plan: starter
    envVars:
      - key: SPRING_DATASOURCE_URL
        fromDatabase:
          name: prepare-for-telc-db
          property: connectionString
      - key: SPRING_JPA_HIBERNATE_DDL_AUTO
        value: update
      - key: JWT_SECRET
        generateValue: true
      - key: PORT
        value: 8080

  # 2. Angular Frontend Static Site
  - type: web
    name: prepare-for-telc-web
    env: static
    rootDir: frontend
    buildCommand: npm install && npm run build -- --configuration production
    staticPublishPath: ./dist/frontend/browser
    envVars:
      - key: API_BASE_URL
        fromService:
          type: web
          name: prepare-for-telc-api
          property: url

databases:
  - name: prepare-for-telc-db
    databaseName: prepare_for_telc_production
    user: telc_admin
    plan: starter
```

---

## 5. System Data Flow & Bounded Contexts

```
[Candidate / Teacher Browser (Angular 18+)]
                   │
         (HTTPS / REST / JWT)
                   ▼
     [Render Edge CDN / Static Hosting]
                   │
                   ▼
┌──────────────────────────────────────────────┐
│  Spring Boot API Gateway & Security Layer   │
│  ├── IAM Bounded Context (Stateless JWT)     │
│  ├── Role-Based Access Control (RBAC)        │
└──────────────┬────────────────┬──────────────┘
               ▼                ▼
     ┌──────────────────┐  ┌──────────────────┐
     │ Question Bank &  │  │ Auto-Grading &   │
     │ Exam Blueprints  │  │ Diagnostic Engine│
     └─────────┬────────┘  └─────────┬────────┘
               │                     │
               └──────────┬──────────┘
                          ▼
              [PostgreSQL Database]
```

### Core Subsystems

1. **Identity & Access Management (IAM):**
   - Endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.
   - Roles: `ROLE_STUDENT`, `ROLE_TEACHER`, `ROLE_ADMIN`.
   - Stateless HMAC-SHA256 JWT security via Spring Security.
2. **Question Bank & Exam Creation (Teacher CMS):**
   - Curates questions categorized by Level (`A1`–`C1`) and Module (`LESEN`, `SPRACHBAUSTEINE`, `HOEREN`).
   - Links questions into standardized TELC exam templates.
3. **Exam Dispatch Engine:**
   - Teachers dispatch exams to registered candidate emails with expiration windows (`exam_assignments` table).
   - Candidates see pending/in-progress tests directly upon logging into their dashboard.
4. **Test Runner & Audio Guardrails (Student Portal):**
   - Distraction-free, timed exam view with countdown timers and question navigation.
   - **Audio Guardrail Component:** Enforces strict playback constraints for *Hören* audio files (e.g., maximum 2 plays per TELC regulations), locking the player once the quota is reached.
5. **MCQ Auto-Grading & Diagnostic Engine:**
   - Candidate responses are compared against master keys.
   - Computes module section scores (*Lesen*, *Sprachbausteine*, *Hören*), overall score, and Pass/Fail status (≥60% passing threshold).
   - Generates itemized diagnostic reviews with pedagogical explanations.

---

## 6. Pre-Seeded Demonstration Accounts

| Account Role | Email | Password | Pre-loaded Data |
|---|---|---|---|
| **Student** | `student@telc.com` | `Password123!` | Active assignment: *TELC Deutsch B2 - Modelltest 1* |
| **Teacher** | `teacher@telc.com` | `Password123!` | Access to Question Bank, Exam Builder, and Dispatch |
| **Admin** | `admin@telc.com` | `Password123!` | Full administrative access |

---

## 7. Quick Start & Local Development

### Option A: Running with Docker Compose (Recommended)

```bash
docker compose up --build
```
- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:8080/api`
- PostgreSQL: `localhost:5432`

---

### Option B: Running Standalone

#### 1. Backend (Spring Boot 3.4 + Java 25 + Maven)

```bash
cd backend
./mvnw spring-boot:run
```
*(Automatically falls back to an in-memory PostgreSQL-compatible H2 database if no PostgreSQL instance is configured locally).*

#### 2. Frontend (Angular 18+)

```bash
cd frontend
npm install
npm start
```
Starts at `http://localhost:4200`.

---

## 8. REST API Reference (OpenAPI / Swagger)

The complete OpenAPI 3.0.3 specification is defined in **[`swagger.yml`](./swagger.yml)** (and accessible via `/swagger.yml` on the running API).

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new candidate or teacher account |
| `POST` | `/api/auth/login` | Public | Authenticate with credentials and receive JWT |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile |
| `GET` | `/api/questions` | Authenticated | List questions (optional `level` and `module` filters) |
| `POST` | `/api/questions` | Teacher / Admin | Create a new question item with options and answer key |
| `DELETE` | `/api/questions/{id}` | Teacher / Admin | Delete question from repository |
| `GET` | `/api/exams` | Authenticated | List exam templates |
| `POST` | `/api/exams` | Teacher / Admin | Assemble questions into a new exam blueprint |
| `POST` | `/api/assignments/dispatch`| Teacher / Admin | Dispatch exam assignment to candidate email |
| `GET` | `/api/assignments/student` | Student | List assignments for logged-in candidate |
| `GET` | `/api/assignments/{id}` | Authenticated | Fetch assignment and test questions |
| `POST` | `/api/assignments/{id}/submit` | Student | Submit answers and trigger auto-grading engine |
| `GET` | `/api/results/assignment/{id}` | Authenticated | Retrieve diagnostic result breakdown |
| `GET` | `/api/results/all` | Teacher / Admin | View all candidate submissions |
