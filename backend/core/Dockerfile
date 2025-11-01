# ---------- Build stage ----------
FROM eclipse-temurin:21-jdk-alpine AS builder

# Instala bash y dos2unix para asegurar compatibilidad con mvnw
RUN apk add --no-cache bash dos2unix

WORKDIR /app

# Copia archivos necesarios para resolver dependencias primero
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Asegura permisos correctos y convierte saltos de línea
RUN chmod +x mvnw && dos2unix mvnw

# Descarga dependencias (para aprovechar cache de Docker)
RUN ./mvnw dependency:go-offline

# Copia el resto del proyecto
COPY . .

# Por seguridad, asegura permisos nuevamente (por si se sobrescribe mvnw)
RUN chmod +x mvnw && dos2unix mvnw

# Compila el proyecto (sin tests)
RUN ./mvnw package -DskipTests

# ---------- Run stage ----------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copia el JAR generado desde la etapa anterior
COPY --from=builder /app/target/*.jar app.jar

# Añade script para esperar la base de datos
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Crea usuario no root por seguridad
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
