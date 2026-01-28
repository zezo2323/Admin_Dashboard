# Use the official Node.js runtime as the base image
FROM node:20-alpine AS base

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build


# Production stage
FROM node:20-alpine AS production

# Set the working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the built application
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
