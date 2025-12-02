# Build stage for Backend
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Build stage for Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Final stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy backend jar
COPY --from=backend-build /app/target/*.jar app.jar

# Copy frontend build to a static location (if serving from Spring Boot or Nginx)
# For this setup, we'll assume a simple deployment where Spring Boot might serve static files 
# OR we use a separate Nginx container. 
# Let's stick to a Docker Compose approach where we have separate containers for clarity.

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
