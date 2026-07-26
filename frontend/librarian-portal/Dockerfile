FROM node:20-slim AS base

WORKDIR /librarian-portal/

COPY package.json package-lock.json /librarian-portal/

COPY frontend/librarian-portal/package.json /librarian-portal/frontend/librarian-portal/

RUN npm ci

COPY frontend/librarian-portal/ /librarian-portal/frontend/librarian-portal/

RUN npm --prefix /librarian-portal/frontend/librarian-portal/ run build

RUN npm run build

FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

COPY --from=base /librarian-portal/frontend/librarian-portal/dist ./dist
COPY --from=base /librarian-portal/frontend/librarian-portal/server.mjs ./server.mjs

EXPOSE 5177

CMD ["server.mjs"]
