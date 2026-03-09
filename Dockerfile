# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Install curl for health check
RUN apk add --no-cache curl

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from builder
COPY --from=builder /app/.next/standalone /app
COPY --from=builder /app/public /app/public
COPY --from=builder /app/.next/static /app/.next/static

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]