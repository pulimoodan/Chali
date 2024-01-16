<div style="text-align:center">

<a href="https://chali.onrender.com/">
    <img src="./apps/client/src/assets/logo.png" alt="Aimeos logo" title="Aimeos" align="center" height="60" />
</a>

# Chali App

:star: Star us on GitHub — it motivates us a lot!

[Chali](https://chali.onrender.com) is a social media platform, where you can share memes and get reactions from the fellow users.

</div>

## Screenshots

![chali-frontend](./screenshots/1.png)
![chali-profile-page](./screenshots/2.png)

## Tech stack

- [Turbo](https://turbo.build/) for the repo management

- [Prisma](https://www.prisma.io/) for ORM

- [Postgresql](https://www.postgresql.org/) for database

- [Vite + React](https://vitejs.dev/) for frontend

- [Nest JS](https://nestjs.com/) for backend

## Features

- Email verification
- Updating profile
- Creating posts
- Follow user
- View posts from following profiles
- View trending posts
- View bookmarked posts
- View notifications about reactions and comments
- View other users' profile
- Search posts
- Change theme (dark and light)
- Comment to posts
- Chat (PENDING)

## Installation

### Install packages

**Note:** Node version 18.18.0+ is preferred!

Use yarn to install packages

```bash
yarn
```

### Environment setup

Copy the `.env.example` file, rename to `.env` and provide these details:

```bash
# create a secret fro authentication process
JWT_SECRET="AbCdEfGhIjKL"

# get cloudinary account access to handle images
CLOUDINARY_CLOUD_NAME= 'abcdefghi'
CLOUDINARY_API_KEY= '1234567890'
CLOUDINARY_API_SECRET= 'xxxxx-XXXXX-xxxxx'

# the host url without the slash at the end
HOST="http://localhost:5173"

# gmail access for mail deliveries
MAIL_PASS="abcd efgh ijkl mnop"
MAIL_USER="example@gmail.com"
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=465
```

Go to `./packages/database` directory. Copy the `.env.example` to create a `.env` and provide:

```bash
# you postgres database url
DATABASE_URL="postgresql://user:pass@localhost:5432/dot-chali?schema=public"
```

### Migrate the database

```bash
cd packages/database

yarn prisma migrate dev
```

### Start the app

Run the app from the root directory

```bash
yarn dev
```

## Contributing

Contributions are always welcome. Please follow the steps:

- Open an issue before you start working on a feature

- Fork the repository

- Create a new branch

- Make the changes

- Create a pull request

## License

The Chali app is licensed under the terms of the [MIT Open Source license](./LICENCE.md) and is available for free.

## Live app

[Click here](https://chali.onrender.com) to view the app which is temporarily hosted on render.
Please wait a few minutes if it's not responding.
We are using the start plan and it will spin down with a 15 minutes of inactivity.
