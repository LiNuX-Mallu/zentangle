FROM node:18

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Copy the rest of the server application code to the container
COPY . .

# Install dependencies for the server
RUN npm install

# Build the server
RUN npm run build

# Set the working directory to the client folder
WORKDIR /client

# Copy client package.json and package-lock.json to the container
COPY client/package*.json ./

# Copy the rest of the client application code to the container
COPY client .

# Install dependencies for the client
RUN npm install

# Build the client
RUN npm run build

# Set the working directory back to the root
WORKDIR /

# Expose the port your application listens on (replace with the correct port)
EXPOSE 8080

# Specify the command to run when the container starts
CMD ["npm", "start"]