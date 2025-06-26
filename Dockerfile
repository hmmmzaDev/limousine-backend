# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the TypeScript app
RUN npm run build

# delete the src folder
RUN rm -rf src

# Expose the port the app runs on
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
