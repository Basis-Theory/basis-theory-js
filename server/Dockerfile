# context must be the project root
FROM node:lts-alpine

WORKDIR /usr/src/app

COPY ["server/package.json", "server/dist/*", "./"]

RUN yarn install --production

EXPOSE 3000

RUN ls

CMD [ "node", "index.js" ]