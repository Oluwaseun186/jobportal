# ---- Builder Stage ----
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Install dependencies
    COPY package*.json ./

    RUN npm install
    
    COPY . .
    RUN npm run build
    
    
    
    # ---- Production Stage ----
    FROM nginx:alpine
    
    # Copy build output from the builder stage
    COPY --from=builder /app/build /usr/share/nginx/html
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]
    