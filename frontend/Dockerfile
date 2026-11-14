# Stage 1: Build Angular production bundle
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependency manifests and install packages
COPY package*.json ./
RUN npm ci

# Copy frontend source code and compile
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve via Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
