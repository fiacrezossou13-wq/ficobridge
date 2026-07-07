FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Générer Prisma client
RUN npx prisma generate

CMD ["npx", "tsx", "src/index.ts"]