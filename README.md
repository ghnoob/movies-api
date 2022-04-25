# movies-api

REST API made for [Alkemy](https://alkemy.org)'s Node.js Backend Challenge.

Manages information about movies, series and its characters.

## Start the app

```bash
yarn install

# for debug mode: docker-compose -f docker-compose.yml -f docker-compose.debug.yml up --build -d
docker-compose up --build -d
```

## Docs

You can access the Swagger UI page at `/api`.

## Running migrations

Since the migrations are written in TypeScript, you should compile them first using one of the
following commands:
```bash
# Compile database folder only

## npm
npm run build:database

## yarn
yarn build:database


# Compile whole project (so you can run the project using `node ./dist/index.js` too)

## npm
npm run build

## yarn
yarn build
```

Then you can use [sequelize-cli](https://www.npmjs.com/package/sequelize-cli) (inside the
docker container) to apply them as usual.

## Info

### Author

[ghnoob](https://github.com/ghnoob)

### License

See [LICENSE](./LICENSE)
