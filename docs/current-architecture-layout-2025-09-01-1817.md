# ProcessFlow - Current Architecture Layout
*Generated on: September 1, 2025 at 18:17*

## Executive Summary

ProcessFlow is a modern web-based process mapping and improvement platform built with React frontend and Node.js backend. The system enables users to visually model, analyze, and optimize business processes through an intuitive drag-and-drop interface with real-time collaboration capabilities.

**Key Metrics:**
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + SQLite
- **Architecture**: Monolithic with clear separation of concerns
- **Database**: 6 core tables with relational design
- **Authentication**: JWT-based with role-based access control

## Architecture Overview

### High-Level System Architecture

```
┌─────────────────┐    HTTP/WebSocket    ┌─────────────────┐
│   React Frontend │ ◄──────────────────► │  Node.js Backend │
│   (Port 5173)   │                      │   (Port 3001)   │
└─────────────────┘                      └─────────────────┘
         │                                        │
         │                                        │
         ▼                                        ▼
┌─────────────────┐                      ┌─────────────────┐
│   Browser       │                      │   SQLite DB     │
│   Local Storage │                      │   (File-based)  │
└─────────────────┘                      └─────────────────┘
```

### Technology Stack

#### Frontend Stack
- **Framework**: React 18.2.0
- **Build Tool**: Vite 4.4.5
- **Styling**: Tailwind CSS 3.3.3
- **State Management**: Context API + Zustand 4.4.1
- **Routing**: React Router DOM 6.8.1
- **UI Components**: Lucide React 0.263.1
- **Drag & Drop**: React DnD 16.0.1 + React Beautiful DnD 13.1.1
- **Real-time**: Socket.io Client 4.7.2
- **Export**: jsPDF 2.5.1 + html2canvas 1.4.1
- **Charts**: Recharts 2.8.0
- **Notifications**: React Hot Toast 2.4.1

#### Backend Stack
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: SQLite (better-sqlite3 9.2.2)
- **Authentication**: JWT 9.0.2 + bcryptjs 2.4.3
- **Validation**: Joi 17.9.2
- **Security**: Helmet 7.0.0 + Express Rate Limit 6.7.0
- **Logging**: Winston 3.10.0
- **File Upload**: Multer 1.4.5-lts.1
- **Compression**: Compression 1.7.4
- **Real-time**: Socket.io 4.7.2

## Core Components Architecture

### Frontend Component Hierarchy

```
App.jsx
├── AuthProvider
├── LanguageProvider
├── ProcessProvider
├── Header
└── MainContent
    ├── AuthWrapper
    └── View Components
        ├── WorkspaceManagement
        ├── ProcessManagement
        ├── ProcessEditor
        ├── TemplatesView
        ├── AnalyticsView
        ├── SettingsView
        └── ProfileView
```

### Backend Service Architecture

```
server.js (Express App)
├── Middleware Stack
│   ├── CORS
│   ├── JSON Parser
│   ├── Authentication
│   ├── Rate Limiting
│   ├── Security Headers
│   └── Compression
├── Route Groups
│   ├── Authentication (/api/auth/*)
│   ├── Workspaces (/api/workspaces/*)
│   ├── Processes (/api/processes/*)
│   ├── Elements (/api/processes/:id/elements/*)
│   ├── Connections (/api/processes/:id/connections/*)
│   └── Analytics (/api/analytics/*)
└── Database Layer
    └── ProcessFlowDatabase
        ├── User Management
        ├── Workspace Management
        ├── Process Management
        ├── Element Management
        └── Connection Management
```

## Data Architecture

### Database Schema

#### Core Tables

1. **users**
   - Primary key: `id` (INTEGER, AUTOINCREMENT)
   - Fields: username, email, password_hash, full_name, role, timestamps
   - Constraints: UNIQUE(username), UNIQUE(email)

2. **workspaces**
   - Primary key: `id` (INTEGER, AUTOINCREMENT)
   - Fields: name, description, owner_id, is_public, timestamps
   - Foreign key: owner_id → users(id)

3. **workspace_members**
   - Primary key: `id` (INTEGER, AUTOINCREMENT)
   - Fields: workspace_id, user_id, role, joined_at
   - Foreign keys: workspace_id → workspaces(id), user_id → users(id)
   - Constraint: UNIQUE(workspace_id, user_id)

4. **processes**
   - Primary key: `id` (INTEGER, AUTOINCREMENT)
   - Fields: name, description, workspace_id, created_by, status, timestamps
   - Foreign keys: workspace_id → workspaces(id), created_by → users(id)

5. **process_elements**
   - Primary key: `id` (INTEGER, AUTOINCREMENT)
   - Fields: process_id, element_type, label, x_position, y_position, properties, timestamps
   - Foreign key: process_id → processes(id)

6. **process_connections**
   - Primary key: `id` (INTEGER, AUTOINCREMENT)
   - Fields: process_id, source_element_id, target_element_id, label, properties, timestamps
   - Foreign keys: process_id → processes(id), source_element_id → process_elements(id), target_element_id → process_elements(id)

### Data Flow Architecture

```
User Action → React Component → API Service → Express Route → Database → Response
     ↓
Real-time Updates via Socket.io
     ↓
State Update → UI Re-render
```

## Security Architecture

### Authentication & Authorization
- **JWT-based authentication** with 24-hour token expiration
- **Role-based access control** (user, admin roles)
- **Password hashing** using bcryptjs with salt rounds
- **Token validation** middleware on protected routes

### Security Measures
- **CORS configuration** for specific origins
- **Rate limiting** to prevent abuse
- **Security headers** via Helmet
- **Input validation** using Joi schemas
- **SQL injection prevention** via parameterized queries

## Performance Architecture

### Frontend Optimization
- **Vite build tool** for fast development and optimized production builds
- **Code splitting** via React Router
- **Lazy loading** of components
- **Tailwind CSS** for optimized CSS bundle
- **React.memo** for component memoization

### Backend Optimization
- **Connection pooling** for database connections
- **Compression middleware** for response optimization
- **Caching strategies** for frequently accessed data
- **Efficient SQL queries** with proper indexing

## Scalability Considerations

### Current Limitations
- **SQLite database** limits concurrent users
- **Single-threaded Node.js** for CPU-intensive operations
- **File-based storage** for uploads
- **In-memory state management** for real-time features

### Scalability Path
- **Database migration** to PostgreSQL/MySQL for higher concurrency
- **Redis integration** for session management and caching
- **Microservices architecture** for service separation
- **Cloud storage** for file uploads
- **Load balancing** for horizontal scaling

## Integration Points

### External Dependencies
- **Socket.io** for real-time communication
- **jsPDF + html2canvas** for PDF export
- **Recharts** for analytics visualization
- **Date-fns** for date manipulation

### API Endpoints
- **RESTful API** design with consistent patterns
- **WebSocket connections** for real-time updates
- **File upload endpoints** for document attachments
- **Analytics endpoints** for data aggregation

## Deployment Architecture

### Development Environment
- **Frontend**: Vite dev server on port 5173
- **Backend**: Nodemon on port 3001
- **Database**: Local SQLite file
- **Hot reloading** enabled for both frontend and backend

### Production Considerations
- **Static file serving** via Express
- **Environment variables** for configuration
- **Process management** with PM2
- **Reverse proxy** with Nginx
- **SSL/TLS termination** for HTTPS

## Monitoring & Observability

### Current State
- **Console logging** for debugging
- **Error handling** with try-catch blocks
- **HTTP status codes** for API responses

### Recommended Improvements
- **Structured logging** with Winston
- **Application metrics** collection
- **Health check endpoints**
- **Performance monitoring**
- **Error tracking** integration

## Development Workflow

### Code Organization
```
processflow/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   └── styles/            # CSS files
├── backend/               # Backend source
│   ├── database.js        # Database operations
│   ├── server.js          # Express server
│   └── test-api.js        # API tests
├── docs/                  # Documentation
└── public/                # Static assets
```

### Build & Deployment
- **Frontend build**: `npm run build` (Vite)
- **Backend start**: `npm start` (Node.js)
- **Development**: `npm run dev` (Vite + Nodemon)
- **Testing**: `npm test` (Backend API tests)

## Risk Assessment

### High Risk Areas
1. **SQLite limitations** for production scale
2. **Single-threaded backend** for concurrent users
3. **File-based storage** for reliability
4. **In-memory state** for real-time features

### Medium Risk Areas
1. **JWT secret** hardcoded in development
2. **CORS configuration** for production domains
3. **Rate limiting** configuration
4. **Error handling** completeness

### Low Risk Areas
1. **Frontend build optimization**
2. **Code organization and structure**
3. **API design consistency**
4. **Component reusability**

## Future Architecture Roadmap

### Phase 1: Production Readiness
- Database migration to PostgreSQL
- Redis integration for caching
- Environment-based configuration
- Comprehensive error handling

### Phase 2: Scalability
- Microservices architecture
- API gateway implementation
- Load balancing setup
- Cloud deployment

### Phase 3: Advanced Features
- Real-time collaboration
- Advanced analytics
- Workflow automation
- Integration APIs

---

*This architecture document provides a comprehensive overview of the current ProcessFlow system architecture. It serves as a foundation for understanding the system's current state and planning future improvements.*
