# TickTick Clone - Complete API Endpoints

Base URL: `http://localhost:8080/api`

## 🔐 Authentication Endpoints

### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "provider": "LOCAL",
    "emailVerified": false,
    "roles": ["USER"],
    "darkMode": false,
    "timezone": "UTC",
    "createdAt": "2025-12-02T14:00:00"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "accessToken": "...",
  "refreshToken": "...",
  "tokenType": "Bearer",
  "user": { ... }
}
```

### Refresh Access Token
```http
POST /api/auth/refresh?refreshToken=YOUR_REFRESH_TOKEN

Response: 200 OK
{
  "accessToken": "...",
  "refreshToken": "...",
  "tokenType": "Bearer",
  "user": { ... }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN

Response: 200 OK
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe"
}
```

### Google OAuth Login
```http
GET /oauth2/authorization/google
# Redirects to Google OAuth consent screen
# After success, redirects to: http://localhost:3000/oauth2/redirect?token=...&refreshToken=...
```

---

## 📝 Task Endpoints

### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer YOUR_ACCESS_TOKEN

Response: 200 OK
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the TickTick clone",
    "notes": "Additional notes here",
    "priority": "HIGH",
    "status": "TODO",
    "dueDate": "2025-12-10T10:00:00",
    "startDate": null,
    "completedAt": null,
    "allDay": false,
    "sortOrder": 0,
    "isRecurring": false,
    "recurrenceType": null,
    "recurrenceInterval": null,
    "recurrenceEndDate": null,
    "recurrenceDays": null,
    "taskListId": 1,
    "taskListName": "Work",
    "parentTaskId": null,
    "tags": [
      {
        "id": 1,
        "name": "urgent",
        "color": "#ff0000",
        "createdAt": "2025-12-02T14:00:00"
      }
    ],
    "subtasks": [],
    "reminders": [],
    "attachments": [],
    "pomodoroCount": 0,
    "timeSpent": 0,
    "createdAt": "2025-12-02T14:00:00",
    "updatedAt": "2025-12-02T14:00:00"
  }
]
```

### Get Task by ID
```http
GET /api/tasks/{id}
Authorization: Bearer YOUR_ACCESS_TOKEN

Response: 200 OK
{ ... task object ... }
```

### Get Tasks by List
```http
GET /api/tasks/list/{listId}
Authorization: Bearer YOUR_ACCESS_TOKEN

Response: 200 OK
[ ... array of tasks ... ]
```

### Get Today's Tasks
```http
GET /api/tasks/today
Authorization: Bearer YOUR_ACCESS_TOKEN

Response: 200 OK
[ ... tasks due today ... ]
```

### Get Overdue Tasks
```http
GET /api/tasks/overdue
Authorization: Bearer YOUR_ACCESS_TOKEN

Response: 200 OK
[ ... overdue tasks ... ]
```

### Search Tasks
```http
GET /api/tasks/search?query=project
Authorization: Bearer YOUR_ACCESS_TOKEN

Response: 200 OK
[ ... matching tasks ... ]
```

### Create Task
```http
POST /api/tasks
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "notes": "Additional notes",
  "priority": "HIGH",
  "status": "TODO",
  "dueDate": "2025-12-10T10:00:00",
  "startDate": "2025-12-05T09:00:00",
  "allDay": false,
  "taskListId": 1,
  "parentTaskId": null,
  "tagIds": [1, 2],
  "isRecurring": true,
  "recurrenceType": "WEEKLY",
  "recurrenceInterval": 1,
  "recurrenceEndDate": "2026-12-10T10:00:00",
  "sortOrder": 0
}

Response: 201 Created
{ ... created task object ... }
```

### Update Task
```http
PUT /api/tasks/{id}
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "Updated Task",
  "description": "Updated description",
  "priority": "MEDIUM",
  "status": "IN_PROGRESS",
  ...
}

Response: 200 OK
{ ... updated task object ... }
```

### Delete Task
```http
DELETE /api/tasks/{id}
Authorization: Bearer YOUR_ACCESS_TOKEN

Response: 204 No Content
```

---

## 📋 Task List Endpoints

### Get All Task Lists
```http
GET /api/lists
Authorization: Bearer YOUR_ACCESS_TOKEN

Response: 200 OK
[
  {
    "id": 1,
    "name": "Work",
    "color": "#3b82f6",
    "icon": "briefcase",
    "viewType": "LIST",
    "sortOrder": 0,
    "isShared": false,
    "folderId": 1,
    "folderName": "Projects",
    "taskCount": 5,
    "createdAt": "2025-12-02T14:00:00",
    "updatedAt": "2025-12-02T14:00:00"
  }
]
```

### Get Task List by ID
```http
GET /api/lists/{id}
Authorization: Bearer YOUR_ACCESS_TOKEN

Response: 200 OK
{ ... task list object ... }
```

### Create Task List
```http
POST /api/lists
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Personal",
  "color": "#10b981",
  "icon": "home",
  "viewType": "LIST",
  "sortOrder": 1,
  "folderId": 1
}

Response: 201 Created
{ ... created task list object ... }
```

### Update Task List
```http
PUT /api/lists/{id}
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "color": "#ef4444",
  "viewType": "KANBAN",
  ...
}

Response: 200 OK
{ ... updated task list object ... }
```

### Delete Task List
```http
DELETE /api/lists/{id}
Authorization: Bearer YOUR_ACCESS_TOKEN

Response: 204 No Content
```

---

## 📁 Folder Endpoints (To be implemented)

```http
GET /api/folders
POST /api/folders
PUT /api/folders/{id}
DELETE /api/folders/{id}
```

---

## 🏷️ Tag Endpoints (To be implemented)

```http
GET /api/tags
POST /api/tags
PUT /api/tags/{id}
DELETE /api/tags/{id}
```

---

## 🔔 Reminder Endpoints (To be implemented)

```http
POST /api/tasks/{taskId}/reminders
DELETE /api/reminders/{id}
```

---

## 🌐 WebSocket Endpoints

### Connect to WebSocket
```javascript
// Connect to WebSocket
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
  // Subscribe to user-specific task updates
  stompClient.subscribe('/user/queue/tasks', function(message) {
    const update = JSON.parse(message.body);
    console.log('Task update:', update);
    // update.action: 'create' | 'update' | 'delete'
    // update.task: { ... task object ... }
  });
});
```

### WebSocket Message Format
```json
{
  "action": "create",
  "task": {
    "id": 1,
    "title": "New Task",
    ...
  }
}
```

---

## 📊 Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Resource deleted successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## 🔑 Authentication

All endpoints (except `/api/auth/*` and `/oauth2/*`) require authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Tokens expire after 24 hours. Use the refresh token to get a new access token:
```http
POST /api/auth/refresh?refreshToken=YOUR_REFRESH_TOKEN
```

---

## 📝 Request/Response Examples

### Priority Values
- `NONE`
- `LOW`
- `MEDIUM`
- `HIGH`

### Status Values
- `TODO`
- `IN_PROGRESS`
- `COMPLETED`

### Recurrence Types
- `DAILY`
- `WEEKLY`
- `MONTHLY`
- `YEARLY`
- `CUSTOM`

### View Types
- `LIST`
- `KANBAN`
- `TIMELINE`

### Reminder Types
- `NOTIFICATION`
- `EMAIL`
- `BOTH`

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Task
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Task",
    "priority": "HIGH",
    "status": "TODO"
  }'
```

### Get All Tasks
```bash
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🚀 Quick Start

1. **Start Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Test API**:
   ```bash
   # Register
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"test123"}'
   
   # Copy the accessToken from response
   
   # Get tasks
   curl http://localhost:8080/api/tasks \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

---

## 📖 Additional Resources

- **Swagger UI** (if configured): `http://localhost:8080/swagger-ui.html`
- **API Docs**: See `DEPLOYMENT.md` for more details
- **WebSocket Guide**: See frontend `src/services/websocket.ts`

---

**Happy Coding! 🎉**
