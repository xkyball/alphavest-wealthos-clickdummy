FROM node:22-bookworm-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV ALPHAVEST_DATA_MODE=demo
ENV ALPHAVEST_REAL_CLIENT_DATA_ALLOWED=false
ENV ALPHAVEST_PILOT_RELEASE_STAGE=docker_demo

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@9.15.9

COPY package.json pnpm-lock.yaml ./

# Important:
# Install devDependencies too, because Prisma CLI and Next build tooling may be in devDependencies.
RUN pnpm install --frozen-lockfile --prod=false

COPY . .

RUN pnpm db:generate
RUN pnpm build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && pnpm start"]
