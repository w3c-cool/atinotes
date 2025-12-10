# Save your Markdown notes online with Atinotes 🖌️

Read more on https://notes.atinux.com

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
pnpm run dev
```

Copy the `.env.example` to `.env` and update the variables to your own.

## Production

Build the application for production:

```bash
pnpm run build
```

Locally preview production build:

```bash
pnpm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Deploy

Add the following environement variables:

```
ADMIN_PASSWORD=<your-password>
NUXT_SESSION_PASSWORD=<a-32-characters-long-password>
```

Next, make sure to add your KV namespace to the `wrangler.jsonc` file.

Once saved, the deployment will be updated with the new environment variables.

That's all :sparkles:

## License

[MIT](./LICENSE) - Sébastien Chopin
