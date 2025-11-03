# Use lightweight Node.js base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the NestJS port
EXPOSE 3000

# Run the app in development mode
CMD ["npm", "run", "start:dev"]
