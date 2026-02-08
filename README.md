# Forum API - Clean Architecture with CI/CD

A secure, scalable, and production-ready REST API designed for a modern Forum application. This project demonstrates advanced backend engineering practices by combining **Clean Architecture** (to ensure modularity and testability) with a robust **DevOps pipeline**.

Built with **Node.js**, **Express**, and **PostgreSQL**, it features a fully automated CI/CD workflow using **GitHub Actions** and **Komo.do**, secured by **Cloudflare Tunnels** for Zero Trust deployment.

## 📖 About the Project

This is a **Forum API**. It allows users to:
*   **Register & Login**: Secure authentication using JWT (Access & Refresh Tokens).
*   **Create Threads**: Start discussions on various topics.
*   **Comment & Reply**: Engage in conversations by adding comments to threads and replying to comments.
*   **Like & Unlike**: Express appreciation for comments (Toggle feature).

The goal is to provide a robust backend for a frontend forum application, ensuring high security and maintainability.

---

## 🏛️ Clean Architecture Explained

This project implemented a strict **Clean Architecture** to ensure the codebase is testable, maintainable, and independent of frameworks.

### 🧠 The Concept
Clean Architecture (by Robert C. Martin) is about separating software into rings. The core "business logic" lives in the center and knows nothing about the outside world (Database, Web API, UI).

**The Golden Rule**: Dependencies can only point **INWARD**.
*   The **Domain** (Core) layer does not know about the **Application** layer.
*   The **Application** layer does not know about the **Interface** layer.
*   The **Infrastructure** layer depends on everything, but nothing depends on it.

### 📂 How Clean Architectur Implemented
This project mapped these concepts directly to our folder structure:

#### 1. Entities (`src/Domains`)
The center of the onion. These are pure JavaScript classes that define our core business objects and rules. They have **zero dependencies**.
*   *Example*: `NewThread.js` (Defines what a valid thread looks like).
*   *Responsibility*: Validation of types and business constraints.

#### 2. Use Cases (`src/Applications`)
The orchestrators. Use Cases define **features** of the application. They tell the entities what to do and coordinate with repositories.
*   *Example*: `AddThreadUseCase.js`.
*   *Responsibility*: "Get data from user -> Validate it -> Save to DB -> Return ID".
*   *Note*: This layer needs to save data, but it only knows about the *Interface* of the repository, not the SQL implementation.

#### 3. Interface Adapters (`src/Interfaces`)
The translators. This layer converts data from the outside world (HTTP Requests) into a format the Use Cases understand.
*   *Example*: `src/Interfaces/http/api`.
*   *Responsibility*: Extracting `req.body` and passing it to a Use Case.

#### 4. Infrastructure (`src/Infrastructures`)
The tools. This is where the actual implementation lives.
*   *Example*: `ThreadRepositoryPostgres.js` (Uses `node-postgres` to run SQL queries).
*   *Responsibility*: Speaking to the Database, Encryption tools (Bcrypt), Logging, etc.

### 🔄 Dependency Injection (DI)
Since the **Use Case** can't directly `require` a Postgres Repository (that would violate the inward-dependency rule), **Dependency Injection** is used.
*   The *actual* repository instance is injected into the Use Case at runtime (in `container.js`).
*   This makes unit testing incredibly easy: a "Fake Repository" can be injected when testing the Use Case logic!

---

## 🏗️ Deployment Architecture

The production deployment uses a containerized microservices approach:

*   **App**: Node.js API (Port 5000)
    *   *Security*: Runs as non-root, listens on `0.0.0.0`.
*   **Database**: PostgreSQL 16 (Port 5432)
    *   *Storage*: Persistent volume `postgres_data_prod`.
*   **Proxy**: Nginx (Port 80)
    *   *Function*: Reverse proxy & Rate Limiting (90 req/min).
*   **Access**: Cloudflare Tunnel (Quick Tunnel)
    *   *Function*: Exposes Nginx safely to the public internet without opening firewall ports.

## 🚀 Local Development

### Prerequisites
*   Node.js 18+
*   Docker & Docker Compose

### Setup directly
```bash
# Install dependencies
npm install

# Setup Environment
cp .env.example .env

# Run Migrations
npm run migrate up

# Start Dev Server
npm run start:dev
```

### Run with Docker
```bash
docker compose up -d --build
```

---

## 🚢 Komo.do Deployment (CD Pipeline)

This project leverages **[Komo.do](https://komo.do)** for Continuous Deployment. 

> 📘 **Detailed Guide**: For a complete walkthrough of the stack, screenshots, and configuration, see the **[Deployment Documentation](./docs/README.md)**.

### Why Komo.do?
While not as globally famous as Jenkins or GitLab CI, Komo.do is a **hidden gem** in the DevOps world. It offers a modern, incredibly fast, and resource-efficient way to manage Docker stacks across servers. It rivals the capabilities of heavy enterprise tools like Jenkins but with a much cleaner architecture (Core + Periphery agents). It allows for deploying updates in seconds with minimal configuration.

### 1. Stack Configuration
*   **Compose File**: `docker-compose.prod.yaml`
*   **Network**: Uses internal `app-network`.
*   **Environment Variables**:
    *   `PGUSER`, `PGPASSWORD`, `PGDATABASE`: Set securely in Komo.do.
    *   `ACCESS_TOKEN_KEY`, `REFRESH_TOKEN_KEY`: JWT Secrets.
    *   `HOST=0.0.0.0`, `NODE_ENV=production`: Required for connectivity.

### 2. Automatic CD (GitHub Actions)
The CD process is fully automated via GitHub Actions (`.github/workflows/cd.yml`).

#### Workflow Usage:
1.  **Trigger**: Pushing to `master` first triggers the **CI** workflow (Tests).
2.  **Deployment**: If (and only if) the CI tests pass, the **CD** workflow runs.
3.  **Action**: The CD workflow executes `scripts/trigger-deployment.js`, which sends a signed webhook to Komo.do.

#### Setup Requirements:
To enable this, you must configure the following **Repository Secrets** in GitHub (`Settings` -> `Secrets and variables` -> `Actions`):

*   `KOMODO_WEBHOOK_URL`: The full webhook URL from your Komo.do Stack settings.
*   `KOMODO_WEBHOOK_SECRET`: A secret string used to sign the request (verified by Komo.do).
    *   *Note*: Ensure this secret matches the one configured in your Komo.do Stack (if applicable).

---

## 🔧 Troubleshooting Guide

This project encountered and solved several critical issues during Dockerization. **Refer to this list if deployment fails.**

### 1. `node-pg-migrate: not found`
*   **Cause**: This tool was a `devDependencies`, and `npm ci --omit=dev` skipped it.
*   **Fix**: 
    1.  Moved to `dependencies` in `package.json`.
    2.  **Dockerfile**: Installed globally (`npm install -g node-pg-migrate`) to guarantee availability in the system PATH.
    3.  **Dockerfile**: Deleted `package-lock.json` before install to prevent stale lockfile issues.

### 2. Deployment Doesn't Update Code
*   **Cause**: Komo.do/Docker aggressively caches image layers.
*   **Fix**: 
    *   **In Komo.do**: Always use **"Prune Buildx"** before deploying.
    *   **Locally**: Use `docker compose up --build`.
    *   **Emergency**: Manually delete the image: `docker rmi -f forum-api-app`.

### 3. 502 Bad Gateway (Nginx cannot connect)
*   **Cause**: The App was listening on `localhost` (127.0.0.1) inside the container. Docker networking requires `0.0.0.0`.
*   **Fix**: 
    *   Patched `src/Commons/config.js` to respect `HOST` env var.
    *   Forced `NODE_ENV=production` in `docker-compose.prod.yaml`.

### 4. "Repo path is not directory"
*   **Cause**: Repo added before Periphery server was connected.
*   **Fix**: Click the **Sync/Clone** button in Komo.do Repositories to retry the clone.

---

## 🧪 CI Pipeline (GitHub Actions)

The project uses a fully automated CI pipeline defined in `.github/workflows/ci.yml`.

### Triggers
*   **Push to `master`**: Ensures the deployment branch is always stable.
*   **Pull Request**: Verifies code integration before merging.

### The "Service Container" Concept
One of the most powerful features used here is the **PostgreSQL Service Container**.

**Problem**: Integration tests need a real database to run SQL queries. Using a shared database is flaky (state remains from previous tests), and mocking everything hides bugs.

**Solution**: GitHub Actions spins up a fresh, empty isolated Docker container for PostgreSQL *specifically* for the duration of the test job.
1.  **Spin Up**: Before tests start, GitHub downloads the `postgres:16-alpine` image and starts it.
2.  **Map Ports**: It maps port `5432` inside the container to `5432` on the runner (localhost).
3.  **Run Tests**: The Node.js test runner connects to `localhost:5432` just like a local DB.
4.  **Teardown**: Once tests finish (pass or fail), the container is destroyed.

This ensures every single test run starts with a **100% clean slate**, guaranteeing reliable results.
