# Stage 1: build
FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: run
FROM node:20-alpine

WORKDIR /app

# Copy build artifacts
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev

# Receive port from build ARG, fallback to 3000
ARG HTTP_PORT=3000
ENV PORT=$HTTP_PORT

EXPOSE $PORT
CMD ["node", "build"]