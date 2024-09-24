# Stage 1: Build the NestJS app
FROM node:20.10.0 AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production image
FROM node:20.10.0

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install -omit=dev

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
