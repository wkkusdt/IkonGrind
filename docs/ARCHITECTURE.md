# Архитектура системы - IkonGrind

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Telegram Users                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
   ┌────▼────┐              ┌────────▼──────────┐
   │Telegram │              │ Telegram Mini App │
   │  Bot    │              │    (React)        │
   └────┬────┘              └────────┬──────────┘
        │                            │
        │                            │
        └────────────┬───────────────┘
                     │
             ┌───────▼──────────┐
             │  Backend API     │
             │  (Node.js/Exp)   │
             │  :3000           │
             └───────┬──────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼────┐   ┌──▼────┐  ┌──▼──────┐
   │ MongoDB │   │Socket │  │  Cron   │
   │  Atlas  │   │  IO   │  │  Jobs   │
   └─────────┘   └───────┘  └─────────┘
```

## Component Diagram

### Backend Architecture

```
HTTP Requests
    ↓
┌─────────────────┐
│  Express.js     │
│  Server         │
└────────┬────────┘
         │
    ┌────┴────────────────────────┐
    │                             │
    ▼                             ▼
┌──────────────┐           ┌─────────────────┐
│  Auth Layer  │           │  API Routes     │
│  - JWT       │           │  - /api/users   │
│  - Telegram  │           │  - /api/quests  │
└──────┬───────┘           │  - /api/games   │
       │                   │  - /api/ranking │
       │                   └────────┬────────┘
       │                            │
       └────────────┬───────────────┘
                    │
            ┌───────▼─────────┐
            │ Controllers     │
            │ (Business Logic)│
            └────────┬────────┘
                     │
            ┌────────▼──────────┐
            │ Services Layer    │
            │ - UserService     │
            │ - QuestService    │
            │ - GameService     │
            │ - LeaderboardSvc  │
            │ - CharacterSvc    │
            └────────┬──────────┘
                     │
            ┌────────▼──────────┐
            │ Models/Schemas    │
            │ (Mongoose)        │
            └────────┬──────────┘
                     │
            ┌────────▼──────────┐
            │   MongoDB         │
            │                   │
            │ - Users           │
            │ - Characters      │
            │ - DailyQuests     │
            │ - GameSessions    │
            │ - Leaderboard     │
            │ - Achievements    │
            └───────────────────┘
```

### Frontend Architecture

```
React App (entry: src/main.tsx)
    │
    ├─ App.tsx (Router)
    │
    ├─ Pages/
    │  ├─ HomePage
    │  ├─ ProfilePage
    │  ├─ QuestsPage
    │  ├─ GamesPage
    │  ├─ GamePlayPage
    │  └─ LeaderboardPage
    │
    ├─ Store/
    │  └─ gameStore.ts (Zustand)
    │     ├─ user state
    │     ├─ character state
    │     ├─ loading state
    │     └─ error state
    │
    ├─ API/
    │  └─ client.ts (Axios)
    │     ├─ initUser()
    │     ├─ getQuests()
    │     ├─ endGame()
    │     └─ getLeaderboard()
    │
    ├─ Components/
    │  ├─ StatBadge
    │  ├─ GameCard
    │  ├─ QuestCard
    │  └─ LeaderboardEntry
    │
    ├─ Utils/
    │  ├─ telegram.ts (Telegram WebApp API)
    │  ├─ animations.tsx (Framer Motion)
    │  └─ helpers.ts
    │
    └─ Styles/
       └─ globals.css (Tailwind)
```

## Data Flow

### Quest Completion Flow

```
User clicks "Complete Quest"
    ↓
QuestPage.tsx (handleCompleteQuest)
    ↓
API: POST /api/quests/:questId/complete
    ↓
Backend:
  1. QuestController.completeQuest()
  2. QuestService.completeQuest()
  3. Update: quest.isCompleted = true
  4. Update: user.gold += rewards.gold
  5. Update: user.experience += rewards.experience
    ↓
Response: { quest, rewards }
    ↓
Frontend: gameStore.updateGold() + updateExperience()
    ↓
UI: Show reward animation
    ↓
Reload quests list
```

### Game Session Flow

```
User starts game
    ↓
API: POST /api/games/start
    ↓
Frontend: Render game component
    ↓
User plays game (60-120 seconds)
    ↓
Game ends with result (win/loss/draw)
    ↓
API: POST /api/games/end
    {gameType, score, result, duration}
    ↓
Backend:
  1. GameController.endGame()
  2. Calculate rewards based on result
  3. Update GameSession in DB
  4. Update user.gold and user.experience
  5. Update user.statistics
    ↓
Response: { session, rewards }
    ↓
Frontend: Show victory/defeat screen
    ↓
Display earned rewards with animation
```

### Leaderboard Update Flow

```
Every hour (Cron job)
    ↓
LeaderboardService.updateLeaderboard()
    ↓
1. Get current season number
2. Delete old leaderboard entries
3. Get all users sorted by level + experience
4. Create new leaderboard entries with ranks
5. Insert into DB
    ↓
Frontend: (WebSocket or polling)
    ↓
socket.on('leaderboard:updated')
    ↓
Fetch new leaderboard data
    ↓
Update UI with animation
```

## State Management

### Zustand Store (gameStore)

```typescript
{
  user: {
    _id, telegramId, firstName,
    level, experience, gold, gems,
    loginStreak, statistics
  },
  character: {
    _id, name, class, level,
    stats, skills, equipment
  },
  isLoading: boolean,
  error: string | null,
  
  // Actions
  setUser(),
  setCharacter(),
  updateGold(),
  updateExperience(),
  ...
}
```

### API Client (Singleton)

- Centralized HTTP requests
- Token management
- Error handling
- Interceptors for auth

## Database Schema Relationships

```
User (1) ──┬─→ (Many) Character
           ├─→ (Many) DailyQuest
           ├─→ (Many) GameSession
           ├─→ (Many) Achievement
           └─→ (1) Leaderboard

Character (1) ←── (1) User
                   (selector)

DailyQuest (Many) ←── (1) User
GameSession (Many) ←── (1) User
Achievement (Many) ←── (1) User
```

## Indexes for Performance

```
User:
- { telegramId: 1 } [UNIQUE]
- { level: -1, experience: -1 }
- { createdAt: -1 }

DailyQuest:
- { userId: 1, isCompleted: 1 }
- { expiresAt: 1 }

GameSession:
- { userId: 1, playedAt: -1 }
- { playedAt: -1 }

Leaderboard:
- { seasonNumber: 1, score: -1 }
- { userId: 1, seasonNumber: 1 }
```

## Error Handling

### Frontend
```
Try-catch in API calls
    ↓
setError() in store
    ↓
Show error toast/modal
    ↓
Allow retry
```

### Backend
```
Express error middleware
    ↓
ValidationError → 400
NotFoundError → 404
UnauthorizedError → 401
InternalError → 500
    ↓
Log error
    ↓
Send JSON response
```

## Security Layers

1. **Telegram Authentication**
   - Verify initDataUnsafe
   - Match telegramId

2. **JWT Tokens**
   - Issued on auth
   - Expire after 30 days
   - Validated on protected routes

3. **Input Validation**
   - Schema validation
   - Sanitization
   - Type checking

4. **Rate Limiting**
   - 100 req/min per IP
   - 5 games/day per user
   - 5 quests/day per user

5. **CORS**
   - Whitelist allowed origins
   - Validate requests

## Scalability Considerations

### Horizontal Scaling

**Backend:**
- Stateless Express servers
- Load balancer (Nginx/HAProxy)
- Session store (Redis, optional)

**Database:**
- MongoDB Atlas handles replication
- Sharding for large data
- Read replicas for queries

**Frontend:**
- CDN for static files (CloudFlare)
- Caching strategy

### Caching Strategy

**Redis Cache (Optional):**
```
- leaderboard:top100 (1 hour)
- user:profile:{userId} (5 minutes)
- season:info (1 day)
```

**Browser Cache:**
```
- Static assets: 1 month
- API responses: 5 minutes (with stale-while-revalidate)
```

### Database Optimization

- Connection pooling
- Query optimization with indexes
- Aggregate pipelines for complex queries
- Pagination for large result sets

## Monitoring & Logging

**Backend:**
- Winston/Bunyan for logs
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Health checks endpoint

**Frontend:**
- Google Analytics
- Error tracking (Sentry)
- Performance metrics
- User session tracking

## Backup & Disaster Recovery

**Database:**
- MongoDB Atlas automated backups
- Point-in-time recovery
- Cross-region replication

**Code:**
- Git version control
- GitHub backup
- CI/CD pipeline

**Assets:**
- CDN with geo-redundancy
- Regular backups
- Disaster recovery plan
