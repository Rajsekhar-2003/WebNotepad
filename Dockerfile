
# Stage 1: Build React + Vite
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN if [ -f package-lock.json ]; then \
        npm ci; \
    else \
        npm install; \
    fi

COPY . .

ARG VITE_SITE_URL=https://webnotepad.online
ENV VITE_SITE_URL=${VITE_SITE_URL}

RUN npm run build


# Stage 2: Serve using Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
