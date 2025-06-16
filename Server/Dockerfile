# Base image
FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install OS-level dependencies for HTTPS (Google OAuth fix)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install wheel
RUN pip install -r requirements.txt

# Copy your project into the image
COPY . /app/

# Default command
CMD ["gunicorn", "Transport_Pool.wsgi:application", "--bind", "0.0.0.0:8000"]
