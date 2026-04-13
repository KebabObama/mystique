FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN NEXT_IGNORE_TYPECHECK=1 npm run build
CMD ["npm", "run", "start"]