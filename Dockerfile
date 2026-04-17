# ── Build Stage ───────────────────────────────────────────────────────────────
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline
COPY . .
RUN npm run build

# ── Production Stage — Nginx with gzip + caching ──────────────────────────────
FROM nginx:stable-alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Optimised Nginx config: gzip, cache headers, SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check so Docker / orchestrators know when the container is ready
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/index.html || exit 1

CMD ["nginx", "-g", "daemon off;"]
