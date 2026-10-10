# CoCollaber API Service

Minimal FastAPI backend skeleton establishing the versioned health check endpoint.

## Local Execution

From repository root:
```bash
python -m uvicorn apps.api.app.main:app --host 0.0.0.0 --port 8000 --reload
```
Or within `apps/api`:
```bash
uvicorn app.main:app --port 8000 --reload
```

## Health Endpoint
- `GET /api/v1/health`
- Response:
```json
{
  "status": "healthy",
  "service": "cocollaber-api",
  "version": "0.1.0",
  "environment": "development"
}
```
