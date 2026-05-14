# FarmLink Backend

NestJS backend for FarmLink Cambodia.

This service runs with Docker and connects to PostgreSQL. In normal local development, you do not need to run the backend manually with `npm run start` every time. If Docker is already up, the backend container is already running.

## What this backend does

- Manages users, farmers, products, orders, rewards, admin, and notifications.
- Stores data in PostgreSQL through TypeORM.
- Exposes REST endpoints for the frontend and for Postman testing.
- Uses Docker so the backend and database can start together in one command.

## Tech Stack

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Docker / Docker Compose
- class-validator and class-transformer for DTO validation

## Why you do not need to run the backend again manually

When you start Docker Compose, it starts both services:

- `postgres` for the database
- `backend` for the NestJS API

The backend container is configured in `docker-compose.yml` and listens on port `3001` on your machine, while the app inside the container still runs on port `3000`.

That means:

- Open Docker once, and the backend starts automatically.
- You do not need to open another terminal and run `npm run start` just to use the API.
- You only need to restart or rebuild the container if you change backend code and your Docker setup does not hot reload files.

## Ports

- PostgreSQL: `5432`
- Backend API: `3001` on your machine -> `3000` inside the container

Use `http://localhost:3001` in Postman.

## Environment Variables

Copy `.env.example` to `.env` and fill in the database values.

Required values:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=
DB_PASS=
DB_NAME=
```

When Docker runs the backend, it overrides the database host to use the `postgres` service inside the Compose network.

## How to run locally

### Option 1: Docker only

Start the whole backend stack with:

```bash
docker compose up -d --build
```

This starts:

- PostgreSQL
- NestJS backend

If the containers are already running, you can just open Docker Desktop and use the API immediately.

### Option 2: Run NestJS without Docker

Use this only if you want to run the backend directly on your machine:

```bash
npm install
npm run start:dev
```

This is optional. For this project, Docker is the preferred way to run the backend locally.

## Project Structure

- `src/auth` - authentication, JWT strategy, roles, guards, and auth DTOs
- `src/users` - user profile, favorites, and user-related database entities
- `src/farmers` - farmer profile features
- `src/products` - products, categories, and product images
- `src/orders` - cart and order logic
- `src/rewards` - reward points and transactions
- `src/admin` - admin-related endpoints
- `src/notifications` - notification handling
- `src/core` - shared database and core application setup
- `src/common` - shared decorators, enums, filters, interceptors, and pipes

## Database Notes

TypeORM is configured in development mode to synchronize entities automatically.

That means:

- If a new entity or relationship is added, the schema updates when the backend starts.
- Data is stored in the Docker PostgreSQL volume, so it stays between container restarts.
- If you want a clean database, remove the Docker volume and start again.

## User Module Summary

The `users` module currently supports:

- Reading all users
- Reading one user by ID
- Updating a user profile
- Deleting a user
- Managing favorite farms
- Managing favorite products

Helpful files:

- [src/users/users.controller.ts](src/users/users.controller.ts)
- [src/users/users.service.ts](src/users/users.service.ts)
- [src/users/users.module.ts](src/users/users.module.ts)
- [src/users/user.entity.ts](src/users/user.entity.ts)
- [src/users/favorite-farm.entity.ts](src/users/favorite-farm.entity.ts)
- [src/users/favorite-product.entity.ts](src/users/favorite-product.entity.ts)

## API Quick Reference

Base URL while using Docker:

```text
http://localhost:3001
```

### Users

- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`
- `GET /users/profile`
- `PATCH /users/profile`

### Favorites

- `GET /users/:id/favorites/farms`
- `POST /users/:id/favorites/farms/:farmerId`
- `DELETE /users/:id/favorites/farms/:farmerId`
- `GET /users/:id/favorites/products`
- `POST /users/:id/favorites/products/:productId`
- `DELETE /users/:id/favorites/products/:productId`

## How to Test in Postman

1. Start Docker Compose.
2. Open Postman.
3. Set the base URL to `http://localhost:3001`.
4. Test `GET /users` first.
5. Use a real user ID for `GET /users/:id`, `PATCH /users/:id`, and favorite routes.

Example `PATCH /users/:id` body:

```json
{
	"firstName": "Vireak",
	"lastName": "La",
	"phoneNumber": "+855 12 345 678",
	"languagePref": "kh"
}
```

## Useful Docker Commands

```bash
docker compose up -d
docker compose up -d --build
docker compose logs -f backend
docker compose logs -f postgres
docker exec -it farmlink-postgres psql -U postgres -d farmlink
```

## How to Test Docker

Use this flow to confirm Docker is running the backend correctly:

1. Start Docker Desktop.
2. Open a terminal in `farmlink-backend`.
3. Run:

```bash
docker compose up -d --build
```

4. Check the running containers:

```bash
docker ps
```

You should see both `farmlink-postgres` and `farmlink-backend`.

5. Check backend logs if something looks wrong:

```bash
docker compose logs -f backend
```

6. Test the API in Postman or browser:

```text
http://localhost:3001/users
```

7. Test the database directly:

```bash
docker exec -it farmlink-postgres psql -U postgres -d farmlink
```

Then run:

```sql
\dt
SELECT * FROM users;
```

If these commands work, Docker, PostgreSQL, and the NestJS backend are connected correctly.

Inside `psql`, useful commands are:

```sql
\dt
SELECT * FROM users;
SELECT * FROM favorite_farms;
SELECT * FROM favorite_products;
```

## Notes for Teammates

- This backend is designed to work with Docker, so the normal workflow is to start Docker and use the API immediately.
- The backend port exposed to your machine is `3001`.
- The database uses PostgreSQL and persistent Docker storage.
- DTO validation is handled with `class-validator`.
- User profile and favorite endpoints are currently available for testing.

## Production Reminder

Before production, make sure the auth flow, guards, and any temporary testing routes are finalized.
