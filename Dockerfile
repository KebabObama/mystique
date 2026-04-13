FROM oven/bun:latest

WORKDIR /app

# install deps (cached)
COPY package.json bun.lock* ./
RUN bun install

# copy only needed files
COPY . .

# reduce memory pressure
# ENV NODE_OPTIONS="--max-old-space-size=1024"

# build
RUN bun run build

CMD ["bun", "run", "start"]
