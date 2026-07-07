FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ne compile pas, exécute directement avec tsx
CMD ["npx", "tsx", "src/index.ts"]
