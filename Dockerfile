# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY project/package*.json ./
RUN npm ci

COPY project .
RUN npm run build


# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget curl

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node","server.js"]