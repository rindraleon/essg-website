.PHONY: help dev staging prod logs build build-nc clean pull ps stop restart

help:
	@echo "╔════════════════════════════════════════════════════════════════╗"
	@echo "║              Docker Compose Environment Manager               ║"
	@echo "╚════════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "DEVELOPMENT"
	@echo "  make dev                Start development environment"
	@echo "  make dev-logs           View development logs (follow)"
	@echo "  make dev-ps             List development services"
	@echo ""
	@echo "STAGING"
	@echo "  make staging            Start staging environment"
	@echo "  make staging-logs       View staging logs (follow)"
	@echo "  make staging-ps         List staging services"
	@echo ""
	@echo "PRODUCTION"
	@echo "  make prod               Start production environment"
	@echo "  make prod-logs          View production logs (follow)"
	@echo "  make prod-ps            List production services"
	@echo ""
	@echo "BUILD & MANAGEMENT"
	@echo "  make build [ENV=dev]    Build images (default: dev)"
	@echo "  make build-nc [ENV=dev] Build images without cache"
	@echo "  make pull [ENV=dev]     Pull images from registry"
	@echo "  make clean [ENV=dev]    Stop and remove containers"
	@echo "  make restart [ENV=dev]  Restart services"
	@echo ""
	@echo "UTILITIES"
	@echo "  make test               Run tests in containers"
	@echo "  make lint               Run linting in containers"
	@echo ""

# Development
dev:
	docker compose -f docker-compose.dev.yml up --pull always

dev-logs:
	docker compose -f docker-compose.dev.yml logs -f

dev-ps:
	docker compose -f docker-compose.dev.yml ps

# Staging
staging:
	docker compose -f docker-compose.staging.yml up --pull always

staging-logs:
	docker compose -f docker-compose.staging.yml logs -f

staging-ps:
	docker compose -f docker-compose.staging.yml ps

# Production
prod:
	docker compose -f docker-compose.prod.yml up --pull always

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

prod-ps:
	docker compose -f docker-compose.prod.yml ps

# Build and management (default to dev)
ENV ?= dev

build:
	docker compose -f docker-compose.$(ENV).yml build

build-nc:
	docker compose -f docker-compose.$(ENV).yml build --no-cache

pull:
	docker compose -f docker-compose.$(ENV).yml pull

ps:
	docker compose -f docker-compose.$(ENV).yml ps

logs:
	docker compose -f docker-compose.$(ENV).yml logs -f

stop:
	docker compose -f docker-compose.$(ENV).yml stop

restart: stop
	docker compose -f docker-compose.$(ENV).yml up -d

clean:
	docker compose -f docker-compose.$(ENV).yml down

# System cleanup
prune:
	docker system prune -f
	@echo "Docker system cleaned"

# Testing (if test scripts exist)
test:
	docker compose -f docker-compose.dev.yml exec frontend npm test
	docker compose -f docker-compose.dev.yml exec back-office npm test

lint:
	docker compose -f docker-compose.dev.yml exec frontend npm run lint
	docker compose -f docker-compose.dev.yml exec back-office npm run lint
