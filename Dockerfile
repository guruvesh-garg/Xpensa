# Step 1 — Build backend and frontend
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Install Node.js & npm
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy all project files
COPY . .

# Install and build frontend
WORKDIR /app/xpensa-frontend
RUN npm install && npm run build

# Copy frontend build into backend
RUN mkdir -p /app/xpensa-backend/src/main/resources/static && \
    cp -r dist/* /app/xpensa-backend/src/main/resources/static/

# Build backend
WORKDIR /app/xpensa-backend
RUN mvn clean package -DskipTests

# Step 2 — Run JAR
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/xpensa-backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
