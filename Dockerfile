# Stage 1: Build the React application
FROM node:16 AS build

# Set working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY frontend/. .

# Build the React application
RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:alpine

# Copy the build output to Nginx's html directory
COPY --from=build /app/frontend/build /usr/share/nginx/html

# Copy blockchain files into the container
COPY ./blockchain/NFT/build/contracts/MyNFT.json /app/blockchain/NFT/build/contracts/


# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
