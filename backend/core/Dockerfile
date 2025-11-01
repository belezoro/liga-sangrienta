# Build stage
FROM eclipse-temurin:21-jdk-alpine as builder

# Install necessary tools
RUN apk add --no-cache bash

WORKDIR /app

# Debug: List contents before copy
RUN pwd && ls -la

# Copy Maven wrapper and make it executable
COPY mvnw .
COPY .mvn .mvn
RUN chmod +x mvnw

# Copy pom.xml for dependency resolution
COPY pom.xml .

# Debug: List contents after initial copy
RUN pwd && ls -la

# Download dependencies first (cached layer)
RUN ./mvnw dependency:go-offline

# Copy entire project
COPY . .

# Debug: List contents after full copy
RUN pwd && ls -la

# Build the application
RUN ./mvnw package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copy jar from build stage
COPY --from=builder /app/target/*.jar app.jar
# Add wait-for-it script to check database availability
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]