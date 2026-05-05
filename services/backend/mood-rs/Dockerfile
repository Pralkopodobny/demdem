# Use the official Rust image from Docker Hub
FROM rust:latest AS build
WORKDIR /app
COPY Cargo.toml . 
COPY Cargo.lock .
COPY diesel.toml .
COPY migrations migrations
COPY src src
CMD ["cargo", "run"]