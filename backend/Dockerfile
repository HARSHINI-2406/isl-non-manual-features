FROM python:3.10-slim

# Install system dependencies required for OpenCV and MediaPipe
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Copy requirements and install Python dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY . .

# Render uses the PORT environment variable
EXPOSE 8000

# Start FastAPI server
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]