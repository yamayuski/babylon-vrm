# syntax=docker/dockerfile:1.4
# check=error=true

ARG NPM_VERSION=11.6.0

FROM --platform=${BUILDPLATFORM:-linux/amd64} mirror.gcr.io/node:24

ENV DEBIAN_FRONTEND=noninteractive

RUN npm install -g npm@${NPM_VERSION} \
    && mkdir -p /workspace \
    && chown node:node /workspace /usr/local/lib/node_modules

WORKDIR /workspace
