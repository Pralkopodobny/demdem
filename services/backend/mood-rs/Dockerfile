# Use the official Rust image from Docker Hub
FROM rust:latest AS build
WORKDIR /app
# RUN cargo build --release
# RUN cp ./target/release/mood-rs /bin/server
RUN --mount=type=bind,source=src,target=src \
    --mount=type=bind,source=Cargo.toml,target=Cargo.toml \
    --mount=type=bind,source=Cargo.lock,target=Cargo.lock \
    --mount=type=cache,target=/app/target/ \
    --mount=type=cache,target=/usr/local/cargo/registry/ \
    --mount=type=bind,source=migrations,target=migrations \
    <<EOF
set -e
cargo build --locked --release
cp ./target/release/mood-rs /bin/server
EOF

FROM rust:latest as final
COPY --from=build /bin/server /bin/
CMD ["/bin/server"]