# API Dockerfile (Node 20 Alpine)
FROM node:20-alpine
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy server source
COPY server ./server

ENV NODE_ENV=production
EXPOSE 8787
CMD ["node", "server/index.js"]

