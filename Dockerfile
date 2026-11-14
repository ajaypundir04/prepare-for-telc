# Multi-stage build for Spring Boot Backend on Java 25 (monorepo root context)
FROM maven:3.9-eclipse-temurin-25 AS builder
WORKDIR /workspace

# Copy Maven POM and warm up dependency cache
COPY backend/pom.xml ./pom.xml
RUN mvn -f pom.xml dependency:go-offline -B || true

# Copy backend source code and package
COPY backend/src ./src
RUN mvn -f pom.xml clean package -DskipTests -B

# Stage 2: Minimal Java 25 JRE runtime
FROM eclipse-temurin:25-jre
WORKDIR /app

# Add non-root system user for container security
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

# Copy built artifact from builder stage
COPY --from=builder /workspace/target/*.jar app.jar

# Expose default Spring Boot port
EXPOSE 8080

# Production JVM ergonomics for cloud containers
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
