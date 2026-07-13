FROM python:3.10-slim

# Install system dependencies required for OpenCV and MediaPipe
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend app code
COPY . .

# Expose backend REST port
EXPOSE 8000

# Command to execute production server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
