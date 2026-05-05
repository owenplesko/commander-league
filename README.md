# Commander League

## Setup

### 1. Environment Variables

In `apps/api`, create a `.env` file with the following:

```env
# A random secret used to sign auth tokens — generate one with: openssl rand -base64 32
BETTER_AUTH_SECRET=

# The base URL of the API server
BETTER_AUTH_URL=http://localhost:3000

# Discord OAuth app credentials — create an app at https://discord.com/developers/applications
# Under OAuth2, add http://localhost:3000/api/auth/callback/discord as a redirect URI
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
```

### 2. Initialize the Database

Run migrations to set up the database schema:

```bash
bun run --filter @commander-league/api db:migrate
```

### 3. Load Cards

Download and load MTG card data into the database:

```bash
bun run --filter @commander-league/api mtg:load-cards
```

## Running the Project

Start all apps in development mode:

```bash
bun run --workspaces dev
```

## Workspace Scripts Reference

| Command                                                 | Description                  |
| ------------------------------------------------------- | ---------------------------- |
| `bun run --workspaces dev`                              | Start all apps in dev mode   |
| `bun run --filter @commander-league/api db:migrate`     | Run database migrations      |
| `bun run --filter @commander-league/api mtg:download`   | Force download MTG card data |
| `bun run --filter @commander-league/api mtg:load-cards` | Seed database with card data |
