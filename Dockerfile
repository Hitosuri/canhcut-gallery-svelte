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
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev


ENV PORT=3000
EXPOSE ${PORT}
CMD ["node", "build"]