# context must be the project root
FROM cypress/base:10

WORKDIR /app

COPY ["e2e/package.json", "./"]

ENV CI=1
RUN yarn
RUN yarn run cypress verify

CMD ["tail", "-f", "/dev/null"]