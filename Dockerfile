FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve build result
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

RUN npm install vite

EXPOSE 3000
CMD ["npx", "vite", "preview", "--port", "3000", "--host"]
