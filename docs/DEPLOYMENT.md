# Deployment Guide - IkonGrind

## Предварительные требования

- Node.js 18+ 
- MongoDB (local или MongoDB Atlas)
- Git
- Telegram Bot Token
- Domain для Mini App

## Local Development

### Backend

1. **Clone и установка**
```bash
cd backend
npm install
```

2. **Конфигурация .env**
```env
NODE_ENV=development
PORT=3000
TELEGRAM_BOT_TOKEN=your_bot_token
MONGODB_URI=mongodb://localhost:27017/ikongrid
JWT_SECRET=your_secret_key
CORS_ORIGIN=*
```

3. **Запуск MongoDB локально**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Windows
# Скачай MongoDB из https://www.mongodb.com/try/download/community
# Установи и запусти как сервис

# Docker
docker run -d -p 27017:27017 mongo
```

4. **Запуск сервера**
```bash
npm run dev
# Сервер запустится на http://localhost:3000
```

### Mini App

1. **Installation**
```bash
cd webapp
npm install
```

2. **.env.local**
```env
VITE_API_URL=http://localhost:3000/api
```

3. **Запуск**
```bash
npm run dev
# Mini App на http://localhost:5173
```

## Production Deployment

### 1. Database Setup (MongoDB Atlas)

1. Перейди на https://www.mongodb.com/cloud/atlas
2. Создай бесплатный cluster
3. Создай database user
4. Получи connection string
5. Скопируй в переменную `MONGODB_URI`

### 2. Backend Deployment

#### Option A: Railway (Рекомендуется)

1. **Создай аккаунт на Railway**
https://railway.app

2. **Push код на GitHub**
```bash
git init
git remote add origin https://github.com/yourusername/ikongrid.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

3. **Деплой на Railway**
- Открой https://railway.app
- "New Project" → "GitHub Repo"
- Выбери ikongrid
- Выбери директорию: `backend`

4. **Установи переменные окружения**
```
TELEGRAM_BOT_TOKEN=your_token
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
NODE_ENV=production
```

5. **Деплой произойдёт автоматически**
- Railway даст тебе URL вроде `https://ikongrid-backend.up.railway.app`

#### Option B: Heroku (Legacy)

```bash
heroku create ikongrid-backend
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main
```

#### Option C: AWS Lambda + API Gateway

1. Установи Serverless Framework
```bash
npm install -g serverless
serverless login
```

2. Deploy
```bash
serverless deploy --region us-east-1
```

### 3. Frontend Deployment

#### Option A: Vercel (Рекомендуется)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd webapp
vercel
```

3. **Environment Variables**
```
VITE_API_URL=https://ikongrid-backend.up.railway.app/api
```

4. **Custom Domain**
- Vercel → Settings → Domains
- Добавь свой домен

#### Option B: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Deploy**
```bash
cd webapp
npm run build
netlify deploy --prod --dir=dist
```

#### Option C: AWS S3 + CloudFront

```bash
cd webapp
npm run build

# Upload to S3
aws s3 sync dist/ s3://ikongrid-webapp --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### 4. Telegram Bot Setup

1. **Получи Bot Token**
- Напиши @BotFather в Telegram
- /newbot
- Получишь TOKEN

2. **Установи Webhook**
```bash
curl -X POST \
  https://api.telegram.org/botYOUR_TOKEN/setWebhook \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-backend-url/telegram/webhook"}'
```

3. **Установи Mini App URL**
```bash
curl -X POST \
  https://api.telegram.org/botYOUR_TOKEN/setWebAppInfo \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-webapp-url"}'
```

## Docker Deployment

### Build images

```bash
# Backend
docker build -t ikongrid-backend ./backend

# Frontend  
docker build -t ikongrid-webapp ./webapp
```

### Docker Compose

Создай `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: ikongrid
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      MONGODB_URI: mongodb://mongodb:27017/ikongrid
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      - mongodb

  webapp:
    build: ./webapp
    ports:
      - "80:5173"
    environment:
      VITE_API_URL: http://backend:3000/api

volumes:
  mongo-data:
```

### Запуск

```bash
docker-compose up -d
```

## Настройка Domain

### Пример: using Cloudflare

1. Добавь твой домен в Cloudflare
2. Обнови nameservers у регистратора
3. Создай A record:
   - Name: `api`
   - Type: `A`
   - Content: IP твоего backend сервера

4. Для Mini App:
   - Name: `app`
   - Type: `CNAME`
   - Content: твой Vercel домен

## SSL Certificate

### Автоматически (Vercel, Railway)
- Выдаётся автоматически при деплое
- Обновляется автоматически

### Manual с Let's Encrypt
```bash
sudo apt-get install certbot
sudo certbot certonly --standalone -d api.yourdomain.com
```

## Мониторинг

### Logs

**Railway:**
```
Railway Dashboard → Logs
```

**Heroku:**
```bash
heroku logs --tail
```

### Error Tracking (Optional)

Добавь Sentry:

```bash
npm install @sentry/node
```

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Backup

### MongoDB Backup

```bash
# Локальный бэкап
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/ikongrid"

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/ikongrid" ./dump
```

### Автоматический бэкап на MongoDB Atlas

- Включен по умолчанию в Atlas
- Хранится 7 дней
- Можно восстановить в любой момент

## Scaling

### Кэширование (Redis)

```typescript
import redis from 'redis';

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

// Кэш лидерборда
await redisClient.setEx(
  'leaderboard:top100',
  3600, // 1 час
  JSON.stringify(topPlayers)
);
```

### Load Balancing

На Railway / AWS автоматически делится нагрузка.

### Database Indexing

Уже оптимизировано в моделях:
- Index на userId
- Index на createdAt
- Compound index на seasonNumber и score

## CI/CD Pipeline

### GitHub Actions

Создай `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Backend
        run: |
          cd backend
          npm install
          npm run build
          # Deploy to Railway
          
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Frontend
        run: |
          cd webapp
          npm install
          npm run build
          # Deploy to Vercel
```

## Troubleshooting

### Backend не запускается
```bash
# Проверь порт
lsof -i :3000

# Проверь MongoDB
mongo --eval "db.adminCommand('ping')"

# Проверь переменные окружения
echo $MONGODB_URI
echo $TELEGRAM_BOT_TOKEN
```

### Mini App не загружается
- Проверь VITE_API_URL
- Открой DevTools → Console для ошибок
- Проверь CORS в backend

### Telegram Bot не отвечает
```bash
# Проверь webhook
curl https://api.telegram.org/botYOUR_TOKEN/getWebhookInfo
```

## Дальнейшие шаги

1. Добавь Analytics (Google Analytics, Mixpanel)
2. Настрой Email notifications (SendGrid)
3. Добавь Push notifications (OneSignal)
4. Настрой CDN для статики (CloudFlare)
5. Добавь API versioning (v1, v2)
