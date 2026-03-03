FROM python:3.11-slim

# ---- System deps ----
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ---- Python deps (separate layer for cache efficiency) ----
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---- Application code ----
COPY . .

# ---- Non-root user (security best-practice) ----
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

EXPOSE 8001

# ---- Container health probe ----
# Checks the /health endpoint every 30 s. After 3 consecutive failures the
# container is marked unhealthy and docker compose will restart it depends_on
# chains wait for healthy status.
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8001/health || exit 1

# ---- Start ----
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
