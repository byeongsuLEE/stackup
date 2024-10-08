# Use an official Node.js runtime as the base image
FROM node:14 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./  # frontend 폴더에서 패키지 파일 복사

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY frontend/. .  # frontend 폴더 전체 복사

# Copy blockchain files into the container
COPY blockchain/NFT/build/contracts/MyNFT.json /app/blockchain/NFT/build/contracts/

# Build the React application
RUN npm run build

# Use an official Nginx image to serve the React application
FROM nginx:alpine

# Copy the build output to Nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
