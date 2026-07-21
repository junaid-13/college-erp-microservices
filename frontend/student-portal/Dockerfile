FROM node:20-slim AS base

WORKDIR /student-portal/

COPY package.json package-lock.json /student-portal/

COPY frontend/student-portal/package.json /student-portal/frontend/student-portal/

RUN npm ci --workspace frontend/student-portal

COPY frontend/student-portal/ /student-portal/frontend/student-portal/

RUN npm run build --workspace frontend/student-portal

FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

COPY --from=base /student-portal/frontend/student-portal/dist ./dist
COPY --from=base /student-portal/frontend/student-portal/server.mjs ./server.mjs

EXPOSE 5173

CMD ["server.mjs"]
