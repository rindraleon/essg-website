#!/bin/bash

# Docker deployment script
# Usage: ./deploy.sh [dev|staging|prod] [pull|build]

set -e

ENVIRONMENT=${1:-dev}
ACTION=${2:-pull}

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Deploying to: $ENVIRONMENT${NC}"

# Load environment variables
if [ -f ".env.${ENVIRONMENT}" ]; then
    export $(cat ".env.${ENVIRONMENT}" | grep -v '^#' | xargs)
else
    echo -e "${RED}Error: .env.${ENVIRONMENT} not found${NC}"
    exit 1
fi

case $ENVIRONMENT in
    dev)
        COMPOSE_FILE="docker-compose.dev.yml"
        ;;
    staging)
        COMPOSE_FILE="docker-compose.staging.yml"
        ;;
    prod)
        COMPOSE_FILE="docker-compose.prod.yml"
        ;;
    *)
        echo -e "${RED}Invalid environment. Use: dev, staging, or prod${NC}"
        exit 1
        ;;
esac

case $ACTION in
    build)
        echo -e "${YELLOW}Building images...${NC}"
        docker compose -f "$COMPOSE_FILE" build --no-cache
        ;;
    pull)
        echo -e "${YELLOW}Pulling images...${NC}"
        docker compose -f "$COMPOSE_FILE" pull
        ;;
    *)
        echo -e "${RED}Invalid action. Use: pull or build${NC}"
        exit 1
        ;;
esac

echo -e "${YELLOW}Starting services...${NC}"
docker compose -f "$COMPOSE_FILE" up -d

echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 5

echo -e "${YELLOW}Service health status:${NC}"
docker compose -f "$COMPOSE_FILE" ps

echo -e "${GREEN}Deployment successful!${NC}"
