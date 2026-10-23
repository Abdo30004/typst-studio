# Production Deployment & Operations Guide

This guide covers deploying Typst Studio to production using Docker, Docker Compose, or bare-metal Linux servers.

---

## 1. Quickstart with Docker Compose

The simplest way to run Typst Studio in production is using Docker Compose:

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  typst-studio:
    image: typst-studio:latest
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=file:/data/typst-builder.db
    volumes:
      - ./data:/data
      - ./uploads:/app/public/uploads
```

### Starting the Service
```bash
docker compose up --build -d
```

### Checking Container Health
```bash
docker compose ps
docker compose logs -f
```

---

## 2. Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Execution environment mode. |
| `PORT` | `3000` | Port on which the HTTP server listens. |
| `DATABASE_URL` | `file:/data/typst-builder.db` | SQLite connection string for Prisma. |
| `TYPST_BIN` | `typst` | Path to the Typst CLI binary (defaults to system PATH). |

---

## 3. Persistent Volumes

To prevent data loss across container restarts, two directories must be mounted to persistent host storage:

1. **/data**: Stores the SQLite database file (`typst-builder.db`) containing saved projects and metadata.
2. **/app/public/uploads**: Stores user-uploaded media files and images referenced in document blocks.

---

## 4. Production Reverse Proxy (Nginx)

When deploying behind an Nginx reverse proxy, configure proper timeout and body-size limits to accommodate large document compilations and PDF downloads:

```nginx
server {
    listen 80;
    server_name docs.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name docs.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/docs.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/docs.yourdomain.com/privkey.pem;

    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

---

## 5. Security & Isolation Hardening

1. **Unprivileged Execution**: The application runs under standard non-root service constraints in production.
2. **Subprocess Isolation**: Typst CLI compilation is spawned inside ephemeral temporary directories (`/tmp/typst-export-*`) with immediate teardown on completion.
3. **MIME Verification**: The upload endpoint enforces strict MIME inspection and size limits (10 MB).
