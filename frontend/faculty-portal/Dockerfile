
FROM node:26-slim AS base

WORKDIR /faculty-portal/

COPY package.json package-lock.json /faculty-portal/

COPY frontend/faculty-portal/package.json /faculty-portal/frontend/faculty-portal/

RUN npm ci --workspace frontend/faculty-portal

COPY frontend/faculty-portal/ /faculty-portal/frontend/faculty-portal/

RUN npm run build --workspace frontend/faculty-portal

FROM gcr.io/distroless/nodejs26-debian13

WORKDIR /app

COPY --from=base /faculty-portal/frontend/faculty-portal/dist ./dist
COPY --from=base /faculty-portal/frontend/faculty-portal/server.mjs ./server.mjs

EXPOSE 5177

CMD ["server.mjs"]
