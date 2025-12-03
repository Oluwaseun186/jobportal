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

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

# Install serve to serve static files
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]