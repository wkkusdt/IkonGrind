# Документация API - IkonGrind

## Аутентификация

Все защищённые endpoints требуют JWT токена в header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /api/auth/init
Инициализация пользователя через Telegram

**Request:**
```json
{
  "telegramId": 123456789
}
```

**Response:**
```json
{
  "_id": "...",
  "telegramId": 123456789,
  "username": "user123",
  "firstName": "John",
  "level": 1,
  "experience": 0,
  "gold": 100,
  "gems": 0,
  "selectedCharacterId": "...",
  "loginStreak": 1,
  "statistics": {...}
}
```

---

### User Profile

#### GET /api/user/profile
Получить профиль пользователя

**Headers:** Authorization required

**Response:**
```json
{
  "_id": "...",
  "telegramId": 123456789,
  "firstName": "John",
  "level": 5,
  "experience": 250,
  "gold": 500,
  "gems": 15,
  "loginStreak": 7,
  "statistics": {
    "totalQuestsCompleted": 10,
    "totalGamesPlayed": 25,
    "totalGamesWon": 18,
    "totalGoldEarned": 2500
  }
}
```

#### POST /api/user/gold
Добавить золото (администратор)

**Request:**
```json
{
  "amount": 100
}
```

**Response:** Updated user object

#### POST /api/user/experience
Добавить опыт

**Request:**
```json
{
  "amount": 50
}
```

**Response:** Updated user object with level check

---

### Daily Quests

#### GET /api/quests
Получить ежедневные задания (генерирует, если их нет)

**Headers:** Authorization required

**Response:**
```json
[
  {
    "_id": "...",
    "questId": "play_games",
    "title": "Геймер",
    "description": "Сыграй в 3 мини-игры",
    "difficulty": "normal",
    "requiredLevel": 1,
    "objectives": [
      {
        "type": "games_played",
        "target": 3,
        "current": 0
      }
    ],
    "rewards": {
      "gold": 100,
      "experience": 50
    },
    "expiresAt": "2024-01-20T23:59:59Z",
    "isCompleted": false,
    "progress": 0
  }
]
```

#### POST /api/quests/:questId/complete
Выполнить задание

**Headers:** Authorization required

**Response:**
```json
{
  "quest": {...},
  "rewards": {
    "gold": 100,
    "experience": 50
  }
}
```

#### GET /api/quests/active
Получить активные (невыполненные) задания

**Headers:** Authorization required

**Response:** Array of active quests

---

### Games

#### POST /api/games/start
Начать игру

**Headers:** Authorization required

**Request:**
```json
{
  "gameType": "clicker"
}
```

**Response:**
```json
{
  "gameType": "clicker",
  "startTime": 1705747200000,
  "maxDuration": 60000
}
```

#### POST /api/games/end
Закончить игру и получить награды

**Headers:** Authorization required

**Request:**
```json
{
  "gameType": "clicker",
  "score": 250,
  "result": "win",
  "duration": 60000
}
```

**Response:**
```json
{
  "session": {
    "_id": "...",
    "gameType": "clicker",
    "score": 250,
    "result": "win",
    "duration": 60000,
    "goldEarned": 75,
    "experienceEarned": 37,
    "rewards": {
      "gold": 75,
      "experience": 37
    }
  },
  "rewards": {
    "gold": 75,
    "experience": 37
  }
}
```

#### GET /api/games/stats
Получить статистику игр за день

**Headers:** Authorization required

**Response:**
```json
{
  "gamesPlayed": 2,
  "gamesWon": 1,
  "totalGoldEarned": 150,
  "totalExpEarned": 75,
  "gamesRemaining": 3
}
```

---

### Leaderboard

#### GET /api/leaderboard/top
Получить топ игроков

**Query params:**
- `limit` (optional, default: 100)

**Response:**
```json
[
  {
    "_id": "...",
    "userId": "...",
    "username": "Player1",
    "level": 25,
    "score": 25000,
    "rank": 1,
    "seasonNumber": 1
  },
  {
    "_id": "...",
    "userId": "...",
    "username": "Player2",
    "level": 24,
    "score": 24500,
    "rank": 2,
    "seasonNumber": 1
  }
]
```

#### GET /api/leaderboard/rank
Получить ранг текущего пользователя

**Headers:** Authorization required

**Response:**
```json
{
  "_id": "...",
  "userId": "...",
  "username": "CurrentUser",
  "level": 15,
  "score": 15000,
  "rank": 45,
  "seasonNumber": 1
}
```

#### GET /api/leaderboard/season
Получить информацию текущего сезона

**Response:**
```json
{
  "seasonNumber": 1,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-04-01T00:00:00Z",
  "daysRemaining": 72
}
```

---

## Ошибки

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- 100 requests per minute per IP
- 5 games per user per day
- Daily quest limit: 5 per day

---

## WebSocket Events (Socket.io)

### Leaderboard Updates
```javascript
socket.on('leaderboard:updated', (data) => {
  console.log('Leaderboard updated:', data);
});
```

### User Level Up
```javascript
socket.on('user:levelup', (data) => {
  console.log('User leveled up:', data.newLevel);
});
```

### Quest Completed
```javascript
socket.on('quest:completed', (data) => {
  console.log('Quest completed:', data.quest);
});
```

---

## Примеры использования

### Получить профиль
```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer <token>"
```

### Выполнить задание
```bash
curl -X POST http://localhost:3000/api/quests/123/complete \
  -H "Authorization: Bearer <token>"
```

### Закончить игру
```bash
curl -X POST http://localhost:3000/api/games/end \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "gameType": "clicker",
    "score": 250,
    "result": "win",
    "duration": 60000
  }'
```

### Получить топ игроков
```bash
curl -X GET "http://localhost:3000/api/leaderboard/top?limit=50"
```
