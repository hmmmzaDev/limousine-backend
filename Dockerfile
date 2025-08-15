# Use Node.js official image
FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the app's source code
COPY . .

# Build the TypeScript app
RUN pnpm run build

# Remove source files and dev dependencies to reduce image size
RUN rm -rf src

# Expose the port the app runs on
EXPOSE 5000

# Start the app
CMD ["pnpm", "start"]
