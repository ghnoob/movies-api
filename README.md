# movies-api

REST API made for [Alkemy](https://alkemy.org)'s Node.js Backend Challenge.

Manages information about movies, series and its characters.

## Start the app

```bash
npm install

# for debug mode: docker-compose -f docker-compose.yml -f docker-compose.debug.yml up --build -d
docker-compose up --build -d
```

## Docs

You can access the Swagger UI page at `/api`.

## Generating database migrations

Since the models are difined with
[sequelize-typescript](https://www.npmjs.com/package/sequelize-typescript),
The project uses
[sequelize-typescript-model-migration](https://www.npmjs.com/package/sequelize-typescript-model-migration)
to generate migration files from models.<br>
If you want to generate a new migration:

```bash
# npm
npm run migration:generate -- migrationName

# yarn
yarn migration:generate migrationName
```

Then you can use `sequelize-cli` to apply them as usual.

## Info

### Author

[ghnoob](https://github.com/ghnoob)

### License

See [LICENSE](./LICENSE)
