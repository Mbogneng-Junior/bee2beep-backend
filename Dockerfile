# Base for Node
FROM node:18-alpine AS node-base
WORKDIR /app/api-node
COPY api-node/package*.json ./
RUN npm install

# Base for Python
FROM python:3.11-slim AS python-base
WORKDIR /app/worker-python
COPY worker-python/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Node API Target
FROM node-base AS node-api
COPY api-node/ .
CMD ["npm", "start"]

# Python Worker Target
FROM python-base AS python-worker
COPY worker-python/ .
CMD ["python", "main.py"]
