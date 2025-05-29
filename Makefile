init-db:
	cd backend && poetry run python scripts/init_db.py

dev:
	cd frontend && npm run dev &
	cd backend && poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

down:
	pkill -f "npm run dev" || true
	pkill -f "uvicorn app.main:app" || true

test:
	cd backend && poetry run pytest

build:
	cd backend && poetry run python -m compileall app

deploy:
	@echo "デプロイ処理はAWS SAM用に別途記述してください"

clean:
	rm -rf backend/__pycache__ backend/.pytest_cache 