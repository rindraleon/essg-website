# CI/CD and Deployment Guide

## Overview

This project uses GitHub Actions for CI/CD and environment-specific Docker Compose configurations for deployment across dev, staging, and production environments.

## Setup

### 1. Docker Hub Registry Setup

1. Create a Docker Hub account at https://hub.docker.com
2. Create an organization (or use your username)
3. Generate a personal access token:
   - Go to **Account Settings > Security > New Access Token**
   - Copy the token (you'll need it in the next step)

### 2. GitHub Secrets Configuration

Add the following secrets to your GitHub repository settings (`Settings > Secrets and variables > Actions`):

| Secret Name | Value |
|---|---|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub personal access token |
| `DOCKER_ORG` | Your Docker Hub organization name |
| `STAGING_HOST` | Staging server hostname or IP |
| `STAGING_USER` | SSH user for staging server |
| `STAGING_DEPLOY_KEY` | Private SSH key (base64 encoded) |
| `PROD_HOST` | Production server hostname or IP |
| `PROD_USER` | SSH user for production server |
| `PROD_DEPLOY_KEY` | Private SSH key (base64 encoded) |

To encode SSH keys:
```bash
base64 -i ~/.ssh/staging_deploy_key | pbcopy  # macOS
base64 ~/.ssh/staging_deploy_key  # Linux
```

### 3. Environment Variables

Copy and configure environment files:

```bash
# Development
cp .env.example .env.dev
# Edit with your development API URL and settings

# Staging
cp .env.example .env.staging
# Edit with your staging API URL and registry

# Production
cp .env.example .env.prod
# Edit with your production API URL and registry
```

## GitHub Actions Workflow

The workflow (`.github/workflows/build-push.yml`) automatically:

1. **Builds** Docker images on every push to `main`, `staging`, or `develop`
2. **Tests** images in pull requests
3. **Pushes** images to Docker Hub (only on successful builds)
4. **Deploys** to staging on `staging` branch push
5. **Deploys** to production on `main` branch push (requires approval)

### Triggering Deployments

- **Pull Request**: Builds image, no push or deployment
- **Push to `develop`**: Builds and pushes image, no deployment
- **Push to `staging`**: Builds, pushes, and deploys to staging
- **Push to `main`**: Builds, pushes, and deploys to production (with environment approval)

## Manual Deployment

Use the provided deployment script:

```bash
# Make script executable
chmod +x deploy.sh

# Development
./deploy.sh dev pull    # Pull pre-built images
./deploy.sh dev build   # Build locally

# Staging
./deploy.sh staging pull

# Production
./deploy.sh prod pull
```

## Docker Compose Environments

### Development (`docker-compose.dev.yml`)
- Volume mounts for hot-reload development
- Development environment variables
- Exposed ports for local access

### Staging (`docker-compose.staging.yml`)
- Pre-built images from registry
- Staging environment configuration
- JSON file logging with size limits

### Production (`docker-compose.prod.yml`)
- Pre-built images from registry
- Production environment configuration
- Resource limits (CPU, memory)
- JSON file logging with rotation
- Enhanced healthchecks with longer timeouts

## Image Tagging Strategy

Images are tagged automatically by GitHub Actions:

- `staging` → `git branch name` (e.g., `staging-abc1234`)
- `main` → `latest`, `major.minor` versions
- Pull requests → SHA prefix (e.g., `pr-abc1234`)

Example image names:
- `docker.io/your-org/essg-frontend:latest`
- `docker.io/your-org/essg-backend:staging-abc1234`
- `docker.io/your-org/essg-frontend:v1.0.0`

## Monitoring Deployments

### Check GitHub Actions
```
GitHub > Actions > Build and Push to Docker Hub
```

### Check Docker Hub
```
https://hub.docker.com/repository/docker/your-org/essg-frontend
```

### Check Running Containers
```bash
# Local
docker compose -f docker-compose.dev.yml ps
docker logs <container-name>

# Remote (via SSH)
ssh user@server
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs frontend
```

## Troubleshooting

### Images not pushing to Docker Hub
1. Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets
2. Check that Docker Hub organization is correct
3. Verify personal access token hasn't expired

### Deployment fails
1. Check GitHub Actions logs for error details
2. Verify SSH keys are properly configured
3. Ensure deployment servers have Docker and Docker Compose installed

### Service won't start
```bash
# Check logs
docker compose -f docker-compose.prod.yml logs frontend

# Verify image exists
docker images | grep essg

# Pull manually
docker pull docker.io/your-org/essg-frontend:latest
```

## Best Practices

1. **Use semantic versioning** for production releases
2. **Always test** in staging before production
3. **Monitor logs** for application errors
4. **Set resource limits** in production (already configured)
5. **Use environment variables** for secrets, not hardcoding
6. **Regularly prune** old images: `docker image prune -a`

## Next Steps

1. Set up GitHub secrets
2. Configure `.env.prod`, `.env.staging`, `.env.dev`
3. Set up deployment servers with Docker
4. Test the workflow with a push to `develop`
5. Monitor the GitHub Actions run
