# JSON Server Backend Dockerfile

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy database and app files
COPY . .

# Create health check script
RUN echo '#!/bin/sh' > /healthcheck.sh && \
    echo 'wget --quiet --tries=1 --spider http://localhost:8080 || exit 1' >> /healthcheck.sh && \
    chmod +x /healthcheck.sh

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD /healthcheck.sh

# Start JSON Server
CMD ["npm", "run", "server"]
