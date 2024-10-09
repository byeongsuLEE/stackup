# Use an official Node.js runtime as the base image
FROM node:16 AS build

# Set working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json from frontend
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from frontend
COPY frontend/. .

# Copy blockchain files
COPY blockchain/NFT/build/contracts/MyNFT.json /app/blockchain/NFT/build/contracts/

# Build the React application
RUN npm run build

# Use an official Nginx image to serve the React application
FROM nginx:alpine

# Copy the build output to Nginx's html directory
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
