#!/usr/bin/env bash
# Petrol full stack installer for Hostinger VPS (Ubuntu/Debian)
#
# Private GitHub repos require a Personal Access Token (PAT):
#   export GITHUB_TOKEN=ghp_xxxxxxxx
#   curl -fsSL https://raw.githubusercontent.com/asaf959/petrol/main/deploy/install-vps.sh | bash
#
# Create token: GitHub → Settings → Developer settings → Personal access tokens
#   classic token with "repo" scope is enough.
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/petrol}"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

# Never prompt for GitHub username/password in non-interactive VPS consoles
export GIT_TERMINAL_PROMPT=0

if [ -n "$GITHUB_TOKEN" ]; then
  BACKEND_REPO="https://x-access-token:${GITHUB_TOKEN}@github.com/asaf959/petrol.git"
  FRONTEND_REPO="https://x-access-token:${GITHUB_TOKEN}@github.com/asaf959/Petrol-react.git"
  echo "==> Using GITHUB_TOKEN for private repo access"
else
  BACKEND_REPO="${BACKEND_REPO:-https://github.com/asaf959/petrol.git}"
  FRONTEND_REPO="${FRONTEND_REPO:-https://github.com/asaf959/Petrol-react.git}"
  echo "==> No GITHUB_TOKEN set — public clone only (private repos will fail)"
fi

echo "==> Installing Docker (if needed)"
if ! command -v docker >/dev/null 2>&1; then
  apt-get update -y
  apt-get install -y ca-certificates curl git
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
fi

if ! docker compose version >/dev/null 2>&1; then
  apt-get update -y
  apt-get install -y docker-compose-plugin || true
fi

echo "==> Preparing app directory: $APP_DIR"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

clone_or_pull() {
  local url="$1"
  local dir="$2"
  if [ -d "$dir/.git" ]; then
    echo "==> Updating $dir"
    if [ -n "$GITHUB_TOKEN" ]; then
      git -C "$dir" remote set-url origin "$url"
    fi
    git -C "$dir" pull --ff-only || true
  else
    echo "==> Cloning $dir"
    if ! git clone "$url" "$dir"; then
      echo ""
      echo "❌ Failed to clone: $dir"
      echo "   Your GitHub repo is private. GitHub no longer accepts account passwords."
      echo ""
      echo "   Fix — create a token, then re-run:"
      echo "   1) GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)"
      echo "   2) Generate new token (classic) with scope: repo"
      echo "   3) On the VPS run:"
      echo "      export GITHUB_TOKEN=ghp_your_token_here"
      echo "      curl -fsSL https://raw.githubusercontent.com/asaf959/petrol/main/deploy/install-vps.sh | bash"
      echo ""
      echo "   Or make both repos Public, then re-run the curl|bash command."
      exit 1
    fi
  fi
}

clone_or_pull "$BACKEND_REPO" petrol
clone_or_pull "$FRONTEND_REPO" petrol-react

mkdir -p deploy
cd deploy

# Prefer compose files from backend repo if present
if [ -f ../petrol/deploy/docker-compose.yml ]; then
  cp -f ../petrol/deploy/docker-compose.yml ./docker-compose.yml
  cp -f ../petrol/deploy/nginx.conf ./nginx.conf
  # Local build contexts when compose lives next to cloned repos
  sed -i 's|context: \.\./petrol|context: ../petrol|g' docker-compose.yml
  sed -i 's|context: \.\./petrol-react|context: ../petrol-react|g' docker-compose.yml
else
  cat > docker-compose.yml <<'YAML'
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-petrol_user}
      POSTGRES_PASSWORD: ${DB_PASS:-petrol_pass_change_me}
      POSTGRES_DB: ${DB_NAME:-petrol_db}
    volumes:
      - petrol_pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-petrol_user} -d ${DB_NAME:-petrol_db}"]
      interval: 5s
      timeout: 5s
      retries: 10

  api:
    build:
      context: ../petrol
      dockerfile: Dockerfile
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      PORT: 2018
      NODE_ENV: production
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: ${DB_USER:-petrol_user}
      DB_PASS: ${DB_PASS:-petrol_pass_change_me}
      DB_NAME: ${DB_NAME:-petrol_db}
      JWT_SECRET: ${JWT_SECRET:-change_me_jwt_secret_please}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-3h}
      ADMIN_SECRET: ${ADMIN_SECRET:-change_me_admin_secret}

  web:
    build:
      context: ../petrol-react
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_PETROL_API_URL: ${NEXT_PUBLIC_PETROL_API_URL:-/api}
    restart: unless-stopped
    depends_on:
      - api

  nginx:
    image: nginx:1.27-alpine
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - web
      - api

volumes:
  petrol_pg_data:
YAML

  cat > nginx.conf <<'NGINX'
server {
    listen 80;
    server_name _;
    client_max_body_size 20M;

    location /api/ {
        proxy_pass http://api:2018/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /docs {
        proxy_pass http://api:2018/docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /docs/ {
        proxy_pass http://api:2018/docs/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://web:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX
fi

if [ ! -f .env ]; then
  DB_PASS=$(openssl rand -hex 16)
  JWT_SECRET=$(openssl rand -hex 32)
  ADMIN_SECRET=$(openssl rand -hex 12)
  cat > .env <<EOF
DB_USER=petrol_user
DB_PASS=${DB_PASS}
DB_NAME=petrol_db
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=3h
ADMIN_SECRET=${ADMIN_SECRET}
NEXT_PUBLIC_PETROL_API_URL=/api
EOF
  echo "==> Created deploy/.env with random secrets"
  echo "    ADMIN_SECRET=${ADMIN_SECRET}"
else
  echo "==> Using existing deploy/.env"
fi

# Open HTTP if ufw is active
if command -v ufw >/dev/null 2>&1; then
  ufw allow OpenSSH || true
  ufw allow 80/tcp || true
  ufw --force enable || true
fi

echo "==> Building and starting stack (this may take several minutes)"
docker compose down --remove-orphans || true
docker compose up -d --build

echo ""
echo "✅ Deploy complete"
echo "   App:     http://$(curl -s ifconfig.me || hostname -I | awk '{print $1}')"
echo "   Swagger: http://$(curl -s ifconfig.me || hostname -I | awk '{print $1}')/docs"
echo "   Dir:     $APP_DIR/deploy"
echo "   Logs:    cd $APP_DIR/deploy && docker compose logs -f"
echo ""
grep ADMIN_SECRET .env || true
