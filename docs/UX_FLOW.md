# UX Flow - IkonGrind

## Пользовательский путь

### Шаг 1: Запуск бота
1. Пользователь находит бота в Telegram (@IkonGrindBot)
2. Нажимает /start
3. Бот показывает приветственное сообщение с меню

### Шаг 2: Первый запуск Mini App
1. Нажимает кнопку "🎮 Открыть игру"
2. Mini App загружается (инициализация Telegram WebApp API)
3. Автоматическая авторизация через Telegram ID
4. Создание профиля и стартового персонажа (Воин, уровень 1)

### Шаг 3: Главный экран (Home)
**Видит:**
- Профиль в центре
- 4 быстрые статистики (Уровень, Стрик, Золото, Кристаллы)
- Полоса опыта
- 4 кнопки меню

**Может:**
- Открыть профиль
- Перейти на задания
- Перейти на мини-игры
- Открыть рейтинг

### Шаг 4: Задания (Quests)
1. Видит 5 ежедневных заданий
2. Каждое задание показывает:
   - Название и описание
   - Сложность (Easy/Normal/Hard/Legendary)
   - Прогресс бара
   - Награды (золото + опыт)
   - Время истечения
3. Может выполнять задание (TBD - какое конкретно действие)
4. При выполнении получает награду с анимацией

### Шаг 5: Мини-игры (Games)
1. Видит 4 типа мини-игр
2. Стата о количестве игр, сыгранных сегодня
3. Нажимает на игру → переходит на экран игры

### Шаг 6: Игра (Game Play)
1. Экран с игровым процессом
2. Таймер и счётчик в шапке
3. Игровая зона в центре
4. После завершения → экран результата

**Игровые результаты:**
- Победа (анимация 🎉)
- Проигрыш (анимация 😢)
- Награды показываются с анимацией

### Шаг 7: Профиль (Profile)
**Видит:**
- Аватар (emoji персонажа)
- Имя, username
- Общие статистики (5 блоков)
- Детальные достижения (4 строки)
- Бейджи достижений (4 блока)
- Реферральный код

**Может:**
- Скопировать реферальный код
- Открыть детали персонажа (TBD)

### Шаг 8: Рейтинг (Leaderboard)
1. Видит текущий рейтинг пользователя (если в top 100)
2. Таблица топ игроков с их:
   - Рангом (#1, #2, #3 с медалями)
   - Ником
   - Уровнем
   - Очками
3. Может скролить список

## Интеракции и микро-моменты

### Loading States
- Спиннер при загрузке
- Skeleton screens для списков
- Плавный fade-in для данных

### Animations
- Fade-in при открытии страницы
- Scale при нажатии кнопок
- Progress bar с плавностью
- Pulse эффект на важных элементах
- Float анимация для иконок

### Feedback
- Toast notifications при действиях (нет уведомлений в Mini App)
- Haptic feedback (вибрация)
- Visual feedback при нажатии

### Error Handling
- Graceful errors с понятными сообщениями
- Retry buttons при ошибке
- Fallback UI

## Navigation Flow

```
Home (/)
├── Profile (/profile)
├── Quests (/quests)
├── Games (/games)
│   └── Game Play (/games/:gameType)
└── Leaderboard (/leaderboard)
```

## Telegram Bot Flow

```
User /start
  ↓
Bot creates user profile
  ↓
Shows menu with:
  - Open Mini App button
  - /profile command
  - /quests command
  - /leaderboard command
  - /help command
  ↓
User selects action
  ↓
Bot responds with info
  (or opens Mini App)
```

## Retention Flow

```
Day 1: User joins
  ↓
  - Gets 100 gold
  - Creates character
  - Sees 5 quests
  - Plays 1 game
  - Gets level-up animation

Day 2: User returns
  ↓
  - Gets login bonus (50 gold)
  - Streak counter = 2
  - Does quests
  - Gets leaderboard position

Day 7: Special reward
  ↓
  - Gets +200 gold
  - +5 crystals
  - Achievement unlocked
  - Special badge shown

Day 30: Season end
  ↓
  - Final leaderboard position
  - Seasonal rewards based on rank
  - Season 2 starts
  - Progress resets for ranking
```

## UX Best Practices Implemented

✅ **Responsive Design**
- Optimized for mobile (Telegram is mobile-first)
- Touch-friendly buttons (min 44x44px)
- Full-screen usage

✅ **Performance**
- Lazy loading of images
- Minimal re-renders with Zustand
- Optimized animations with Framer Motion

✅ **Accessibility**
- Semantic HTML
- Color contrast > 4.5:1
- Readable fonts

✅ **Feedback**
- Clear error messages
- Success animations
- Loading indicators

✅ **Retention**
- Clear progression systems
- Daily rewards
- Social features (leaderboard)
- Achievements
- FOMO mechanics

✅ **Gamification**
- Level ups with celebrations
- Badges and achievements
- Ranking system
- Streaks
- Seasonal goals

## Key Metrics to Track

1. **DAU (Daily Active Users)**
   - Goal: Increase each week

2. **Session Duration**
   - Goal: >5 minutes per session

3. **Retention**
   - Day 1: 100%
   - Day 7: >60%
   - Day 30: >30%

4. **Monetization** (future)
   - Ads impressions
   - Premium subscriptions
   - In-app purchases

5. **Engagement**
   - Quests completed per day
   - Games played per day
   - Leaderboard changes

## Testing Checklist

- [ ] Load Mini App from Telegram
- [ ] Login works
- [ ] Can complete quests
- [ ] Can play games
- [ ] Rewards appear correctly
- [ ] Leaderboard updates
- [ ] Animations are smooth
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Offline handling
