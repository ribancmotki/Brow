FROM zig:0.14-slim AS builder
ARG HEADLESS_VERSION=0.1.0
RUN apt-get update && apt-get install -y curl ca-certificates libssl-dev libv8-dev build-essential
WORKDIR /build
COPY build.zig build.zig.zon ./
COPY src ./src
RUN zig build -Doptimize=ReleaseFast -Dstealth=false

FROM gcr.io/distroless/cc-debian12
COPY --from=builder /build/zig-out/bin/headless-browser /headless-browser
COPY --from=builder /build/zig-out/bin/headless-worker /headless-worker
EXPOSE 9222
ENTRYPOINT ["/headless-browser"]
CMD ["serve", "--port", "9222", "--host", "0.0.0.0"]
