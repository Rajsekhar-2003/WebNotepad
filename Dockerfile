
# ==========================================
# Stage 1: Build React + Vite application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN if [ -f package-lock.json ]; then \
        npm ci; \
    else \
        npm install; \
    fi

# Copy application source
COPY . .

# Build frontend
RUN npm run build


# ==========================================
# Stage 2: Production application
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN if [ -f package-lock.json ]; then \
        npm ci --omit=dev; \
    else \
        npm install --omit=dev; \
    fi && npm cache clean --force

# Copy production server
COPY --from=builder /app/server ./server

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 3001

CMD ["node", "server/index.js"]
