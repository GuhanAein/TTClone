# TickTick Clone - Full-Stack Task Management Application

A complete, production-ready TickTick clone with identical UI and full feature parity.

## 🚀 Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL
- **Cache/Queue**: Redis
- **Authentication**: Spring Security + JWT + Google OAuth2
- **Real-time**: WebSocket (STOMP)
- **Email**: Spring Mail
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Query + Context API
- **Real-time**: SockJS + STOMP
- **Build Tool**: Vite

## ✨ Features

### Core Features
- ✅ User authentication (JWT + Google OAuth)
- ✅ Create/edit/delete tasks
- ✅ Subtasks, tags, folders, lists
- ✅ Priorities, sorting, drag & drop
- ✅ Recurring tasks (daily, weekly, monthly, yearly)
- ✅ Task notes and descriptions
- ✅ Multi-view calendar (day/week/month)
- ✅ Smart lists (Today, Tomorrow, Next 7 Days, Overdue)
- ✅ Full-text search + filters
- ✅ Real-time syncing across devices (WebSocket)
- ✅ Reminder notifications (email + push)
- ✅ Dark mode + responsive UI
- ✅ Pomodoro timer tracking
- ✅ File attachments

## 📋 Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Maven 3.8+
- Docker & Docker Compose (optional)

## 🛠️ Installation & Setup

### Option 1: Docker (Recommended)

```bash
# Clone the repository
cd /Users/guhannadin/Documents/tick\ tick

# Start all services with Docker Compose
docker-compose up -d

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8080
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

### Option 2: Manual Setup

#### Backend Setup

1. **Configure PostgreSQL**
```bash
# Create database
createdb ticktick

# Or using psql
psql -U postgres
CREATE DATABASE ticktick;
\q
```

2. **Configure Redis**
```bash
# Start Redis server
redis-server
```

3. **Configure Environment Variables**
```bash
cd backend

# Create .env file or export variables
export JWT_SECRET=your-secret-key-here
export GOOGLE_CLIENT_ID=your-google-client-id
export GOOGLE_CLIENT_SECRET=your-google-client-secret
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
export FIREBASE_CONFIG_PATH=path/to/firebase-config.json
```

4. **Build and Run Backend**
```bash
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Or run the JAR
java -jar target/ticktick-clone-1.0.0.jar
```

The backend will start on `http://localhost:8080`

#### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure Environment**
```bash
# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws
VITE_GOOGLE_CLIENT_ID=your-google-client-id
EOF
```

3. **Run Development Server**
```bash
npm run dev
```

The frontend will start on `http://localhost:3000` or `http://localhost:5173`

## 📁 Project Structure

```
tick-tick/
├── backend/
│   ├── src/main/java/com/ticktick/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA entities
│   │   ├── exception/      # Exception handling
│   │   ├── repository/     # Data repositories
│   │   ├── security/       # Security & JWT
│   │   └── service/        # Business logic
│   ├── src/main/resources/
│   │   └── application.yml # Application config
│   └── pom.xml            # Maven dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/{id}` - Get task by ID
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/today` - Get today's tasks
- `GET /api/tasks/overdue` - Get overdue tasks
- `GET /api/tasks/search?query=` - Search tasks

### Task Lists
- `GET /api/lists` - Get all lists
- `POST /api/lists` - Create list
- `PUT /api/lists/{id}` - Update list
- `DELETE /api/lists/{id}` - Delete list

### WebSocket
- Connect to: `ws://localhost:8080/ws`
- Subscribe to: `/user/queue/tasks`

## 🔐 Environment Variables

### Backend (.env or application.yml)
```properties
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/ticktick
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# Redis
SPRING_REDIS_HOST=localhost
SPRING_REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-minimum-256-bits
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# OAuth2
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Firebase
FIREBASE_CONFIG_PATH=classpath:firebase-config.json
```

### Frontend (.env)
```properties
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Production Build

### Backend
```bash
cd backend
mvn clean package -DskipTests
# JAR file will be in target/ticktick-clone-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Build files will be in dist/
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🔧 Database Schema

The application uses the following main tables:
- `users` - User accounts
- `folders` - Folder organization
- `task_lists` - Task lists/projects
- `tasks` - Main tasks table
- `tags` - Task tags
- `reminders` - Task reminders
- `attachments` - File attachments
- `task_tags` - Many-to-many relationship

## 🎨 UI Features

- Identical sidebar layout to TickTick
- Three-panel layout (sidebar, task list, detail panel)
- Drag and drop task reordering
- Calendar views (day/week/month)
- Dark mode toggle
- Responsive design for mobile/tablet
- Smooth animations and transitions

## 🚀 Performance Optimizations

- Redis caching for frequently accessed data
- Database indexing on common queries
- React Query for client-side caching
- WebSocket for real-time updates (no polling)
- Lazy loading of components
- Optimistic UI updates

## 🔒 Security Features

- JWT-based authentication
- Password hashing with BCrypt
- CORS configuration
- SQL injection prevention (JPA)
- XSS protection
- CSRF protection disabled (stateless API)

## 📝 License

This is a clone project for educational purposes.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using Spring Boot and React**
