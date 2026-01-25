FROM sbtscala/scala-sbt:eclipse-temurin-25.0.1_8_1.12.0_3.8.1 AS builder
WORKDIR /app
COPY mill .
COPY .mill-version .
RUN ./mill --version

COPY build.mill .
COPY app app
RUN chmod +x mill
RUN ./mill --no-daemon app.api.assembly

FROM eclipse-temurin:25-jdk-alpine-3.23
COPY --from=builder /app/out/app/api/assembly.dest/out.jar ./app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]