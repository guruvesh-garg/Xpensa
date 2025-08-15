# Step 1 — Build backend (with Node.js for frontend-maven-plugin)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Install Node.js & npm (LTS version)
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    node -v && npm -v

# Copy project files
COPY . ./

# Pre-install frontend dependencies to avoid Maven npm issues
WORKDIR /app/src/main/frontend
RUN npm ci || npm install
WORKDIR /app

# Build the project without running tests
RUN mvn clean package -DskipTests

# Step 2 — Run Spring Boot JAR
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
