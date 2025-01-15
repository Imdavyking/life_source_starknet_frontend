FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies using yarn
RUN yarn install

COPY . /app

EXPOSE 3000

# Use yarn to run the development server
CMD ["yarn", "dev", "--host"]

# # Use an official Node.js image as the base
# FROM node:20-alpine

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json to the container
# COPY package*.json ./

# # Install the dependencies
# RUN npm install

# # Copy the rest of the application code to the container
# COPY . .

# # Expose the application's port
# EXPOSE 5000

# # Start the Node.js application
# CMD ["npm","run", "listen"]