# movies-api

REST API made for [Alkemy](https://alkemy.org)'s Node.js Backend Challenge.

Manages information about movies, series and its characters.

## Before running the app

This app uses [SendGrid](https://sendgrid.com) to send emails. You'll need an account, an API key and
a verified email address to being able to send emails.

Also make sure to create a file named `.env` in the project root. You can paste the contents from
[.env.example](./.env.example) in `.env` and add the required values.

## Start the app

```bash
yarn install

# for debug mode: docker-compose -f docker-compose.yml -f docker-compose.debug.yml up --build -d
docker-compose up --build -d
```

## Docs

You can access the Swagger UI page at `/docs`.

## Migrations and seeders

Migrations and seeders are written in TypeScript. [sequelize-cli](https://www.npmjs.com/package/sequelize-cli)
does not support TS, so you'll need to compile them before running the project if you don't have a `dist` folder
in the project root with the compiled files, or after changing or creating the migrations and the seeders.

To compile the `src/database` folder, use one of the following commands:

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

Then you can use `sequelize-cli` (inside the docker container) to run them as usual.

## Info

### Author

[ghnoob](https://github.com/ghnoob)

### License

See [LICENSE](./LICENSE)
