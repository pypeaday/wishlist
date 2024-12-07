# Use Python 3.11 slim image as base
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    WISHLIST_HOST=0.0.0.0 \
    WISHLIST_PORT=8000 \
    WISHLIST_DB_PATH=/app/data/wishlists.db

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port
EXPOSE ${WISHLIST_PORT}

# Run the application
CMD ["python", "app.py"]
