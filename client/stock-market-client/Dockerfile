# Use Node.js
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json .

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Build the app
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port
EXPOSE 5173

# Correct CMD for serve v14+
CMD ["npm", "run", "dev"]
