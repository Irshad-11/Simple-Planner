<h1 align="center">🚀 SYSTEM DESIGN</h1> <br> 

# 🏗 1. High-Level System Architecture Diagram

```mermaid
flowchart LR
    User[User Browser]

    subgraph Frontend
        React[React Frontend UI]
    end

    subgraph Backend
        Flask[Flask Backend API]
        Spring[Spring Boot Analytics Microservice]
    end

    subgraph Database
        DB[(PostgreSQL Database)]
    end

    User -->|HTTP Requests| React
    React -->|REST API Calls| Flask
    Flask -->|SQL Queries| DB
    Flask -->|REST Call| Spring
    Spring -->|SQL Queries| DB
    Spring -->|JSON Response| Flask
    Flask -->|JSON Response| React
```



# 🔄 2. Microservice Interaction Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant R as React Frontend
    participant F as Flask API
    participant S as Spring Boot Analytics
    participant DB as PostgreSQL

    U->>R: Request Dashboard
    R->>F: GET /dashboard
    F->>S: GET /analytics
    S->>DB: Fetch Task Data
    DB-->>S: Task Records
    S-->>F: JSON (Total, Completed, Pending, Weekly Summary)
    F-->>R: Combined Dashboard Data
    R-->>U: Render Dashboard View
```



# 👤 3. Use Case Diagram

```mermaid
flowchart TB
    User((Registered User))
    Guest((Guest User))

    User --> UC1[Manage Tasks]
    User --> UC2[Calendar View]
    User --> UC3[Manage Notes & Folders]
    User --> UC4[Dashboard View]
    User --> UC5[Settings Management]
    User --> UC6[Profile Management]

    Guest --> UC7[Register]
    Guest --> UC8[Login]
```



# 🧩 4. Component Diagram

```mermaid
flowchart TB

    subgraph Client Layer
        UI[React Components]
        CalendarComp[Calendar Module]
        TaskComp[Task Module]
        NotesComp[Notes Module]
        DashboardComp[Dashboard Module]
    end

    subgraph API Layer
        FlaskAPI[Flask REST API]
        Auth[Authentication Service]
        TaskService[Task Service]
        NoteService[Note Service]
        SettingsService[Settings Service]
    end

    subgraph Analytics Layer
        AnalyticsAPI[Spring Boot Analytics API]
        AnalyticsEngine[Analytics Computation Module]
    end

    subgraph Data Layer
        PostgreSQL[(PostgreSQL DB)]
    end

    UI --> FlaskAPI
    FlaskAPI --> Auth
    FlaskAPI --> TaskService
    FlaskAPI --> NoteService
    FlaskAPI --> SettingsService

    FlaskAPI --> AnalyticsAPI
    AnalyticsAPI --> AnalyticsEngine

    TaskService --> PostgreSQL
    NoteService --> PostgreSQL
    Auth --> PostgreSQL
    AnalyticsEngine --> PostgreSQL
```



# 🗄 5. ER Diagram (Database Design)

```mermaid
erDiagram

    USERS {
        int id PK
        string username
        string first_name
        string last_name
        string email
        string password_hash
        string theme
    }

    TASKS {
        int id PK
        int user_id FK
        string title
        string description
        date due_date
        string priority
        string status
    }

    FOLDERS {
        int id PK
        int user_id FK
        string folder_name
    }

    NOTES {
        int id PK
        int folder_id FK
        int user_id FK
        string title
        text content
        datetime updated_at
    }

    USERS ||--o{ TASKS : owns
    USERS ||--o{ FOLDERS : creates
    FOLDERS ||--o{ NOTES : contains
    USERS ||--o{ NOTES : writes
```



# 🔐 6. Authentication Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant React
    participant Flask
    participant DB

    User->>React: Enter Credentials
    React->>Flask: POST /login
    Flask->>DB: Verify Username/Email
    DB-->>Flask: User Record
    Flask->>Flask: Verify Password Hash
    Flask-->>React: Create Session + Success
    React-->>User: Redirect to Dashboard
```



# 📊 7. Dashboard Analytics Flow

```mermaid
flowchart LR

    Tasks[(Tasks Table)]
    Analytics[Spring Boot Analytics Engine]
    FlaskAPI[Flask API]
    ReactUI[React Dashboard UI]

    Tasks --> Analytics
    Analytics -->|Compute Total, Completed, Pending, Weekly| FlaskAPI
    FlaskAPI --> ReactUI
```



# 🧠 8. Logical Layered Architecture

```mermaid
flowchart TB

    Presentation["Presentation Layer<br>(React)"]
    Application["Application Layer<br>(Flask API)"]
    AnalyticsLayer["Analytics Layer<br>(Spring Boot Microservice)"]
    DataLayer["Data Layer<br>(PostgreSQL)"]

    Presentation --> Application
    Application --> DataLayer
    Application --> AnalyticsLayer
    AnalyticsLayer --> DataLayer
```
