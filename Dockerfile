# Use the Node.js image as a base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Download wait-for-it.sh and place it in the /app directory
RUN curl -o /app/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x /app/wait-for-it.sh

# Expose the port your app runs on
EXPOSE 3000

# Run database migrations and start the application
CMD ["sh", "-c", "./wait-for-it.sh mysql_db:3306 -- npm run migration:run && npm start"]
