#!/bin/bash

# Quick-start guide script
# Prints setup instructions

cat << 'EOF'

╔═══════════════════════════════════════════════════════════════════════════╗
║          ESSG Docker CI/CD Setup - Quick Start Guide                     ║
╚═══════════════════════════════════════════════════════════════════════════╝

🚀 GETTING STARTED

1. LOCAL DEVELOPMENT
   ───────────────────
   For local development with hot-reload:
   
   $ docker compose -f docker-compose.dev.yml up --pull always
   
   - Frontend: http://localhost:3000
   - Back-office: http://localhost:3001
   - Volumes mounted for live source code updates

2. SETUP DOCKER REGISTRY
   ──────────────────────
   a) Create Docker Hub account: https://hub.docker.com
   
   b) Create organization or use username
   
   c) Generate personal access token:
      Settings > Security > New Access Token
   
   d) Add GitHub Secrets (Settings > Secrets and variables > Actions):
      - DOCKER_USERNAME: your-username
      - DOCKER_PASSWORD: your-token
      - DOCKER_ORG: your-org-name

3. GITHUB ACTIONS WORKFLOW
   ────────────────────────
   The workflow automatically:
   
   - Builds images on every push
   - Pushes to Docker Hub (main/staging/develop branches)
   - Deploys to staging (staging branch)
   - Deploys to production (main branch)
   
   For deployment automation, also add:
   - STAGING_HOST, STAGING_USER, STAGING_DEPLOY_KEY
   - PROD_HOST, PROD_USER, PROD_DEPLOY_KEY

4. ENVIRONMENT CONFIGURATION
   ──────────────────────────
   $ cp .env.example .env.dev
   $ cp .env.example .env.staging
   $ cp .env.example .env.prod
   
   Edit each file with environment-specific settings:
   - API URLs
   - Registry information
   - Deployment credentials

5. MANUAL DEPLOYMENT
   ──────────────────
   $ chmod +x deploy.sh
   
   # Development
   $ ./deploy.sh dev pull
   
   # Staging
   $ ./deploy.sh staging pull
   
   # Production
   $ ./deploy.sh prod pull

📁 ENVIRONMENT-SPECIFIC COMPOSE FILES
   ─────────────────────────────────────
   
   docker-compose.yml              Default (production build)
   docker-compose.dev.yml          Development with hot-reload
   docker-compose.staging.yml      Staging environment
   docker-compose.prod.yml         Production with resource limits

🔧 USEFUL COMMANDS

   # View running services
   $ docker compose ps
   
   # View logs
   $ docker compose logs -f frontend
   
   # Rebuild images
   $ docker compose build --no-cache
   
   # Pull latest images
   $ docker compose pull
   
   # Stop services
   $ docker compose down

📋 WORKFLOW TRIGGERS

   Branch          Action
   ──────────────────────────────────────
   develop         Build & push image
   staging         Build, push, deploy to staging
   main            Build, push, deploy to production

🔗 DEPLOYMENT DOCUMENTATION

   See DEPLOYMENT_GUIDE.md for comprehensive setup and troubleshooting:
   - Detailed GitHub secrets configuration
   - Image tagging strategy
   - Monitoring and logging
   - Troubleshooting guide

📦 IMAGE REPOSITORIES

   Frontend:   docker.io/YOUR_ORG/essg-frontend
   Back-office: docker.io/YOUR_ORG/essg-back-office

✅ NEXT STEPS

   1. Create Docker Hub account and organization
   2. Configure GitHub Secrets
   3. Create .env.* files
   4. Push to a branch to trigger the workflow
   5. Monitor GitHub Actions > Build and Push to Docker Hub

╚═══════════════════════════════════════════════════════════════════════════╝

EOF
