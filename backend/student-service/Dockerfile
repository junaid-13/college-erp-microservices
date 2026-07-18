FROM node:26-slim 
WORKDIR /student-service/
COPY package.json /student-service/
COPY /src /student-service/src
RUN npm install --production
EXPOSE 4002
CMD ["node", "src/server.js"]