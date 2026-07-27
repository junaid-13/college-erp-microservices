
FROM node:20-slim AS base

WORKDIR /librarian-portal/

COPY package.json package-lock.json /librarian-portal/

COPY frontend/librarian-portal/package.json /librarian-portal/frontend/librarian-portal/

RUN npm ci --workspace frontend/librarian-portal

COPY frontend/librarian-portal/ /librarian-portal/frontend/librarian-portal/

RUN npm run build --workspace frontend/librarian-portal

FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

COPY --from=base /librarian-portal/frontend/librarian-portal/dist ./dist
COPY --from=base /librarian-portal/frontend/librarian-portal/server.mjs ./server.mjs

EXPOSE 5177

CMD ["server.mjs"]
