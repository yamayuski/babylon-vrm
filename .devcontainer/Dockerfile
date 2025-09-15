# syntax=docker/dockerfile:1.4
# check=error=true

FROM --platform=${BUILDPLATFORM:-linux/amd64} mirror.gcr.io/node:24

ENV DEBIAN_FRONTEND=noninteractive

RUN npm install -g npm@latest \
    && mkdir -p /workspace \
    && chown node:node /workspace /usr/local/lib/node_modules \
    && corepack use pnpm@10.16.1

WORKDIR /workspace
