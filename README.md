# movies-api

REST API made for [Alkemy](https://alkemy.org)'s Node.js Backend Challenge.

Manages information about movies, series and its characters.

## Before running the app

This app uses [SendGrid](https://sendgrid.com) to send emails. You'll need an account, an API key and
a verified email address to being able to send emails.

Also make sure to create a file named `.env` in the project root. You can paste the contents from
[.env.example](./.env.example) in `.env` and add the required values.

## Start the app

### Development

```bash
docker-compose up --build -d
```

### Debug

```
docker-compose -f docker-compose.yml -f docker-compose.debug.yml up --build -d
```

## Docs

You can access the Swagger UI page at `/docs`.

## Migrations

You can run the migrations using `docker-compose exec app yarn migrator run`.
Also you can use `docker-compose exec app yarn migrator -h` to get more useful commands.

Seeders are run automatically when you start the app in dev or debug mode.

## E2E Testing

This application uses the [sendmail.app](https://sendmail.app) API to check if the welcome
email was sent successfully, so to run the e2e tests, you'll need an account in that service,
and provide an API key and a namespace in the .env file

## Info

### Author

[ghnoob](https://github.com/ghnoob)

### License

See [LICENSE](./LICENSE)
