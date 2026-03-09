# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY project/package*.json ./
RUN npm ci

COPY project/ .
RUN npm run build


# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node","server.js"]