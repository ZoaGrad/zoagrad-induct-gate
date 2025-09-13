# Use a specific Node.js version for reproducibility
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the Next.js app runs on
EXPOSE 3000

# Command to run the development server
CMD ["npm", "run", "dev"]
