FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install UV for fast package management
RUN pip install uv

# Copy project files
COPY apps/ai-engine/pyproject.toml ./
COPY apps/ai-engine/README.md ./
COPY apps/ai-engine/src ./src

# Install dependencies
RUN uv pip install --system -e .

# Create credentials directory
RUN mkdir -p /app/credentials

# Expose port
EXPOSE 4003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4003/health || exit 1

# Run with uvicorn
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "4003"]
