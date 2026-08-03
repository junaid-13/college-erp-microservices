FROM node:20-slim AS base

WORKDIR /admin-portal/

COPY package.json package-lock.json /admin-portal/

COPY frontend/admin-portal/package.json /admin-portal/frontend/admin-portal/

RUN npm ci --workspace frontend/admin-portal

COPY frontend/admin-portal/ /admin-portal/frontend/admin-portal/

RUN npm run build --workspace frontend/admin-portal

FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

COPY --from=base /admin-portal/frontend/admin-portal/dist ./dist
COPY --from=base /admin-portal/frontend/admin-portal/server.mjs ./server.mjs

EXPOSE 5177

CMD ["server.mjs"]
