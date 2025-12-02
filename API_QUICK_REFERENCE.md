# TickTick Clone - Quick API Reference

## 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |
| GET | `/oauth2/authorization/google` | Google OAuth login |

## 📝 Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get task by ID |
| GET | `/api/tasks/list/{listId}` | Get tasks by list |
| GET | `/api/tasks/today` | Get today's tasks |
| GET | `/api/tasks/overdue` | Get overdue tasks |
| GET | `/api/tasks/search?query=` | Search tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |

## 📋 Task Lists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lists` | Get all lists |
| GET | `/api/lists/{id}` | Get list by ID |
| POST | `/api/lists` | Create list |
| PUT | `/api/lists/{id}` | Update list |
| DELETE | `/api/lists/{id}` | Delete list |

## 🌐 WebSocket
- **URL**: `ws://localhost:8080/ws`
- **Subscribe**: `/user/queue/tasks`
- **Message Format**: `{ action: "create|update|delete", task: {...} }`

## 🔑 Authentication Header
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 📊 Enums
- **Priority**: `NONE`, `LOW`, `MEDIUM`, `HIGH`
- **Status**: `TODO`, `IN_PROGRESS`, `COMPLETED`
- **Recurrence**: `DAILY`, `WEEKLY`, `MONTHLY`, `YEARLY`, `CUSTOM`
- **View Type**: `LIST`, `KANBAN`, `TIMELINE`

## 🚀 Quick Test
```bash
# 1. Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# 2. Login (copy accessToken from response)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# 3. Create Task
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"My First Task","priority":"HIGH"}'

# 4. Get All Tasks
curl http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

See `API_ENDPOINTS.md` for complete documentation.
