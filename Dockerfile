FROM node:8-alpine
COPY . .
EXPOSE 8080
CMD node app.js

