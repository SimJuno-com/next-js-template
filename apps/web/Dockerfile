FROM node:24-slim AS builder
COPY --from=oven/bun:1 /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
ENV SKIP_ENV_VALIDATION=1
# the build evaluates the auth config; the real values come from compose at runtime
ENV BETTER_AUTH_SECRET=build-time-placeholder-secret-not-used-at-runtime
ENV BETTER_AUTH_URL=http://localhost:3000

COPY . .
RUN --mount=type=cache,target=/root/.bun/install/cache bun install

ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_TKIT_WIDGET_ID
ENV NODE_ENV=production
RUN cd apps/web && bun run build
# standalone output excludes public/; ensure it exists so the runner copy never fails
RUN mkdir -p apps/web/public

FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

ENV HOSTNAME=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
