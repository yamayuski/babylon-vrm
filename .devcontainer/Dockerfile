# syntax=docker/dockerfile:1.4
# check=error=true

ARG NPM_VERSION=11.5.2

FROM --platform=${BUILDPLATFORM:-linux/amd64} mcr.microsoft.com/devcontainers/typescript-node:2-22-bookworm

ENV DEBIAN_FRONTEND=noninteractive

RUN su node -c "umask 0002 && npm install -g npm@${NPM_VERSION}" \
    && mkdir -p /workspace \
    && chown node:node /workspace

WORKDIR /workspace
