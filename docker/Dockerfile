FROM node:18.16.1 as build

WORKDIR /sources
COPY src ./src
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
RUN npm i
RUN npm run build

FROM node:18.16.1-alpine

ENV PORT=3000

WORKDIR /opt/app
COPY --from=build /sources/build /opt/app
COPY --from=build /sources/package-lock.json /opt/app/npm-shrinkwrap.json
RUN npm ci --omit=dev

ENTRYPOINT ["node", "main"]
EXPOSE 3000
