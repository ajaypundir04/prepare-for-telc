# Deploying `prepare-for-telc` to Render: Step-by-Step Production Guide

This guide walks through deploying the **`prepare-for-telc`** monorepo to [Render](https://render.com) using both **Automated Blueprint Infrastructure-as-Code (`render.yaml`)** and **Manual Dashboard Setup**.

---

## 1. Architecture Topology on Render

Render hosts all three subsystems in a unified environment:

```
┌─────────────────────────────────────────────────────────────┐
│                       Render Platform                       │
│                                                             │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │  prepare-for-telc-web │       │  prepare-for-telc-api │  │
│  │   (Static Site CDN)   │ ────► │  (Docker Web Service) │  │
│  │   Angular 18+ SPA     │ REST  │  Spring Boot 3.4/J25  │  │
│  └───────────────────────┘       └───────────┬───────────┘  │
│                                              │ JDBC         │
│                                              ▼              │
│                                  ┌───────────────────────┐  │
│                                  │   prepare-for-telc-db │  │
│                                  │  (Managed PostgreSQL) │  │
│                                  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

| Service Name | Render Type | Runtime / Spec | Source Folder | Output / Port |
|---|---|---|---|---|
| **`prepare-for-telc-db`** | Managed Database | PostgreSQL 16 | — | Port 5432 (Internal) |
| **`prepare-for-telc-api`** | Web Service | Docker (Java 25 + Spring Boot 3.4) | `backend/` | Port 8080 |
| **`prepare-for-telc-web`** | Static Site | Node 22 build / Static CDN | `frontend/` | `./dist/frontend/browser` |

---

## 2. Prerequisites

1. A [Render.com Account](https://dashboard.render.com).
2. A GitHub or GitLab repository containing your `prepare-for-telc` code.
3. Access to repository settings (for GitHub Actions CI/CD secrets).

---

## 3. Deployment Method 1: Infrastructure as Code (`render.yaml`) — Recommended

Render natively supports deploying multi-service topologies defined in [`render.yaml`](./render.yaml).

### Step 1: Push Code to GitHub

Ensure all files, including `render.yaml`, `backend/`, and `frontend/`, are committed and pushed to your GitHub repository:

```bash
git add .
git commit -m "feat: complete monorepo with DDD and Render config"
git push origin main
```

### Step 2: Create Blueprint in Render

1. Open the [Render Dashboard](https://dashboard.render.com).
2. Click **New +** in the top navigation bar and select **Blueprint**.
3. Connect your GitHub/GitLab account and select your **`prepare-for-telc`** repository.
4. Render will automatically parse [`render.yaml`](./render.yaml) and display the planned resources:
   - **`prepare-for-telc-db`** (PostgreSQL Database)
   - **`prepare-for-telc-api`** (Docker Web Service)
   - **`prepare-for-telc-web`** (Static Site)
5. Review the plan options (Starter / Free) and click **Apply**.

### Step 3: Automated Provisioning & Linking

Render will orchestrate the deployment in the correct order:
1. It provisions the **PostgreSQL database**.
2. It injects the connection string into `prepare-for-telc-api` via `fromDatabase.property: connectionString`.
3. It builds the **Docker container** using `backend/Dockerfile` with Java 25.
4. It compiles the **Angular frontend** (`npm install && npm run build -- --configuration production`) and serves `./dist/frontend/browser` over the Global Edge CDN.
5. It links `API_BASE_URL` on the static site to the API service URL.

---

## 4. Deployment Method 2: Manual Dashboard Configuration

If you prefer configuring each service manually via the Render UI:

### Step 1: Create PostgreSQL Database

1. Click **New +** -> **PostgreSQL**.
2. Set configuration:
   - **Name:** `prepare-for-telc-db`
   - **Database:** `prepare_for_telc_production`
   - **User:** `telc_admin`
   - **Region:** Frankfurt (EU Central) or your preferred region
   - **Plan:** Free or Starter
3. Click **Create Database**.
4. Once created, copy the **Internal Database URL**.

---

### Step 2: Create Backend API Web Service

1. Click **New +** -> **Web Service**.
2. Select your repository.
3. Configure the settings:
   - **Name:** `prepare-for-telc-api`
   - **Region:** Same as your database
   - **Root Directory:** `backend`
   - **Runtime:** `Docker`
   - **Dockerfile Path:** `backend/Dockerfile`
   - **Instance Type:** Starter (or Free)
4. Add **Environment Variables**:
   | Key | Value / Source |
   |---|---|
   | `SPRING_DATASOURCE_URL` | Paste the **Internal Database URL** from Step 1 |
   | `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` |
   | `JWT_SECRET` | Click *Generate* (or enter a 256-bit base64 key) |
   | `PORT` | `8080` |
5. Click **Create Web Service**. Wait for the Docker build to complete and note the service URL (e.g., `https://prepare-for-telc-api.onrender.com`).

---

### Step 3: Create Angular Frontend Static Site

1. Click **New +** -> **Static Site**.
2. Select your repository.
3. Configure settings:
   - **Name:** `prepare-for-telc-web`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build -- --configuration production`
   - **Publish Directory:** `./dist/frontend/browser`
4. Add **Environment Variables**:
   | Key | Value |
   |---|---|
   | `API_BASE_URL` | `https://prepare-for-telc-api.onrender.com` (from Step 2) |
5. Configure **Redirects / Rewrites** (for Angular HTML5 Routing):
   - Go to the **Redirects/Rewrites** tab in your static site settings.
   - Add a rule:
     - **Type:** `Rewrite`
     - **Source:** `/*`
     - **Destination:** `/index.html`
   *(This ensures refreshing `/student/dashboard` or `/student/exam/1` routes directly to the Angular SPA rather than a 404).*
6. Click **Create Static Site**.

---

## 5. Setting Up Automated CI/CD with GitHub Actions

The repository includes a ready-to-use GitHub Actions workflow in [`.github/workflows/ci-cd.yml`](./.github/workflows/ci-cd.yml).

To enable automatic continuous deployment whenever code merges to `main`:

1. **Get Render Deploy Hooks:**
   - In Render Dashboard, navigate to **`prepare-for-telc-api`** -> **Settings** -> **Deploy Hook**.
   - Copy the webhook URL (e.g., `https://api.render.com/deploy/srv-xxxx?key=yyyy`).
   - Navigate to **`prepare-for-telc-web`** -> **Settings** -> **Deploy Hook**.
   - Copy the webhook URL.

2. **Add Secrets in GitHub:**
   - Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**.
   - Add the following repository secrets:
     - `RENDER_API_DEPLOY_HOOK`: *Your backend deploy hook URL*
     - `RENDER_WEB_DEPLOY_HOOK`: *Your frontend deploy hook URL*

3. **Deploy Workflow:**
   Every push to `main` will now:
   1. Compile and execute Java 25 backend integration tests.
   2. Build and verify the Angular 18 production bundle.
   3. Trigger zero-downtime rolling deployments on Render.

---

## 6. Pre-Seeded Production Demo Accounts

When the backend starts for the first time, [`DataInitializer.java`](./backend/src/main/java/com/preparefortelc/shared/config/DataInitializer.java) seeds the database with official TELC B2 test materials and demonstration users:

| Account Type | Email | Password | Role |
|---|---|---|---|
| **Student** | `student@telc.com` | `Password123!` | `ROLE_STUDENT` |
| **Teacher** | `teacher@telc.com` | `Password123!` | `ROLE_TEACHER` |
| **Administrator** | `admin@telc.com` | `Password123!` | `ROLE_ADMIN` |

---

## 7. Operational Best Practices & Troubleshooting

### HikariCP Connection Pool
- Configured in `backend/src/main/resources/application.yml` with:
  ```yaml
  hikari:
    maximum-pool-size: 15
    minimum-idle: 5
    connection-timeout: 30000
    idle-timeout: 600000
  ```
- This prevents pool exhaustion during concurrent exam submissions.

### Audio File Constraints
- Listening audio tracks (`.mp3` or `.ogg`) must **never** be packaged inside the Spring Boot container.
- Always provide external URLs (hosted on Cloudflare R2, AWS S3, or CDN) when creating Hören questions in the Teacher CMS.
- The frontend [`AudioPlayerComponent`](./frontend/src/app/shared/components/audio-player.component.ts) enforces the playback quota (e.g. maximum 2 plays) on the client side.

### Database Cold Starts
- If using Render's free tier, the database spins down after periods of inactivity. The first request may take ~30–50 seconds to warm up. For production exams, keep the database on a Starter or higher plan.

### CORS Configuration
- The backend API includes CORS support allowing requests from your Render frontend domain and custom domains. If you attach a custom domain, ensure headers like `Authorization` and `Content-Type` remain allowed in [`SecurityConfig.java`](./backend/src/main/java/com/preparefortelc/identity/infrastructure/security/SecurityConfig.java).
