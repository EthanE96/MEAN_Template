# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /api

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /api

COPY package.json package-lock.json* ./
RUN npm ci --only=production

COPY --from=builder /api/dist ./dist

CMD ["node", "dist/server.js"]