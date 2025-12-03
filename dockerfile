# Multi-stage build for React application
FROM node:18-alpine as development

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install


COPY . .


EXPOSE 3000

# Start development server
CMD ["npm", "start"]

# Production build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .
RUN npm run build

# Production stage with nginx
FROM nginx:alpine as production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Start nginx
CMD ["npm start"]