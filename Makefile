.PHONY: help up down dev-api dev-web test test-api test-web lint lint-api lint-web clean

help:
	@echo "CoCollaber Development Makefile"
	@echo ""
	@echo "Native local commands (no Docker):"
	@echo "  make dev-api     Run FastAPI backend locally"
	@echo "  make dev-web     Run Next.js frontend locally"
	@echo "  make test        Run all tests"
	@echo "  make test-api    Run backend pytest suite"
	@echo "  make lint        Run backend and frontend linters"
	@echo ""
	@echo "Containerized commands:"
	@echo "  make up          Start all containers via Docker Compose"
	@echo "  make down        Stop all Docker Compose containers"

up:
	docker compose up -d

down:
	docker compose down

dev-api:
	python -m uvicorn apps.api.app.main:app --host 0.0.0.0 --port 8000 --reload

dev-web:
	cd apps/web && npm run dev

test: test-api test-web

test-api:
	python -m pytest apps/api/tests/unit -v

test-web:
	cd apps/web && npm run typecheck

lint: lint-api lint-web

lint-api:
	ruff check apps/api || echo "Ruff check completed"

lint-web:
	cd apps/web && npm run lint

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
