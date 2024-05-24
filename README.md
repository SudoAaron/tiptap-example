## This repo is for an example usage of TipTap Editor. It includes basic configurations, lists, code blocks, history, image uploads, image resizing, and image alignment.

## Getting Started

First, Spin up a minio server with `docker-compose up`. Access it [http://localhost:9001](http://localhost:9001) with your browser. Login with the credentials set in docker-compose.yml and .env.example.

Login to minio and change the `images` bucket to a public bucket.

Rename .env.example to .env

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Enjoy.