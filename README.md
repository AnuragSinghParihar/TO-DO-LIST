# 🛍️ SHOPMART

A production-ready, full-stack e-commerce application built with React, Node.js, Express, and MySQL. Features Docker containerization, AWS ECS Fargate deployment, CI/CD automation, and Kubernetes manifests.

## 🏗️ Architecture

```
┌─────────────┐    ┌─────────────┐    ┌──────────┐
│   React SPA  │───▶│  Express API │───▶│  MySQL   │
│   (Nginx)    │    │  (Node.js)   │    │  (RDS)   │
└─────────────┘    └─────────────┘    └──────────┘
      │                   │
      └───────┬───────────┘
              ▼
    ┌──────────────────┐
    │   Docker / ECS   │
    │    Fargate        │
    └──────────────────┘
```

## ✨ Features

- **Frontend**: React 18, React Router v6, Context API, Axios, react-hook-form
- **Backend**: Express.js, JWT auth, bcrypt, rate limiting, CORS, Helmet
- **Database**: MySQL 8 with migrations, indexes, and seed data
- **Auth**: JWT-based with bcrypt password hashing and role-based access
- **Cart**: Full shopping cart with localStorage persistence
- **Checkout**: Multi-step checkout flow with order management
- **Dockerized**: Multi-stage builds, non-root users, health checks
- **CI/CD**: GitHub Actions with OIDC auth, ECR push, ECS deploy
- **K8s**: Deployment, Service, Ingress, and resource limits
- **Monitoring**: CloudWatch alarms for CPU, memory, and task health

## 📁 Project Structure

```
SHOPMART/
├── frontend/           # React SPA
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route pages
│   │   ├── context/    # Auth & Cart context
│   │   ├── hooks/      # Custom hooks
│   │   ├── api/        # Axios client
│   │   └── utils/      # Helper functions
│   ├── Dockerfile
│   └── nginx.conf
├── backend/            # Node.js + Express API
│   ├── src/
│   │   ├── routes/     # Express routes
│   │   ├── controllers/# Business logic
│   │   ├── middleware/  # Auth, admin, validation
│   │   ├── config/     # DB connection
│   │   └── server.js   # Entry point
│   └── Dockerfile
├── database/           # SQL migrations & seeds
├── k8s/                # Kubernetes manifests
├── monitoring/         # CloudWatch scripts
├── .github/workflows/  # CI/CD pipelines
├── docker-compose.yml  # Local development
├── task-def.json       # ECS task definition
└── docs/               # Setup guides
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20 LTS
- Docker & Docker Compose
- AWS CLI v2 (for deployment)

### Local Development

```bash
# Clone the repo
git clone https://github.com/AnuragSinghParihar/SHOPMART.git
cd SHOPMART

# Start all services with Docker
docker compose up --build

# Frontend: http://localhost:3001
# Backend:  http://localhost:3000
# API:      http://localhost:3000/api
```

### Without Docker

```bash
# Backend
cd backend
cp .env.example .env  # configure your DB
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm start
```

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ✗ | Register user |
| POST | `/api/auth/login` | ✗ | Login user |
| GET | `/api/auth/me` | ✓ | Get current user |
| GET | `/api/products` | ✗ | List products (filter/sort/page) |
| GET | `/api/products/:slug` | ✗ | Get product details |
| GET | `/api/products/featured` | ✗ | Featured products |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| GET | `/api/cart` | ✓ | Get user cart |
| POST | `/api/cart` | ✓ | Add to cart |
| PATCH | `/api/cart/:id` | ✓ | Update quantity |
| DELETE | `/api/cart/:id` | ✓ | Remove from cart |
| POST | `/api/orders` | ✓ | Checkout |
| GET | `/api/orders` | ✓ | Order history |
| GET | `/health` | ✗ | Health check |

## 🐳 Docker

```bash
# Build and test locally
docker compose up --build

# Production build
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## ☁️ AWS Deployment

See detailed guides in `/docs`:
- [IAM Setup](docs/aws-iam-setup.md)
- [ECS Configuration](docs/ecs-configuration.md)
- [ECR Deployment](docs/ecr-deployment.md)
- [Secrets Management](docs/secrets-management.md)

## 🔄 CI/CD Pipeline

Push to `main` triggers the full pipeline:

```
Push → Test → Build → ECR Push → ECS Deploy
```

- OIDC authentication (no static AWS keys)
- Dual-tag strategy (`:latest` + `:sha`)
- Automatic ECS service update with stability wait

## 📊 Monitoring

CloudWatch alarms configured for:
- CPU utilization > 80%
- Memory utilization > 85%
- Unhealthy task count < 1

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL 8 |
| Auth | JWT, bcrypt |
| Container | Docker, Nginx |
| Registry | Amazon ECR |
| Compute | Amazon ECS Fargate |
| CI/CD | GitHub Actions |
| Orchestration | Kubernetes |
| Monitoring | CloudWatch |

## 👨‍💻 Author

**Anurag Singh Parihar**

- GitHub: [@AnuragSinghParihar](https://github.com/AnuragSinghParihar)

## 📄 License

This project is licensed under the MIT License.
