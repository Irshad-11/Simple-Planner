<h1 align="center">🚀 SYSTEM DESIGN (At a Glance)</h1> <br> 



# TOC

<details>
<summary>TABLE OF CONTENTS</summary>

- [🚀 SYSTEM DESIGN (At a Glance)](#-system-design-at-a-glance)

### 🏗 System Architecture
- [🏗 1. High-Level System Architecture Diagram](#-1-high-level-system-architecture-diagram)
- [🔄 2. Microservice Interaction Diagram](#-2-microservice-interaction-diagram)
- [👤 3. Use Case Diagram](#-3-use-case-diagram)
- [🧩 4. Component Diagram](#-4-component-diagram)
- [🗄 5. ER Diagram (Database Design)](#-5-er-diagram-database-design)
- [🔐 6. Authentication Flow Diagram](#-6-authentication-flow-diagram)
- [📊 7. Dashboard Analytics Flow](#-7-dashboard-analytics-flow)
- [🧠 8. Logical Layered Architecture](#-8-logical-layered-architecture)

### 🚀 SYSTEM DESIGN - DETAILED

#### 🔄 Sequence Diagrams
- [User Management](#sequence-diagrams)
  - [Registration](#registration-fr-um-1-fr-um-2-fr-um-3)
  - [Login](#login-fr-um-4-fr-um-5)
  - [Logout](#logout-fr-um-6)

- [Task Management](#task-management)
  - [Create Task](#create-task-fr-tm-1)
  - [View Tasks](#view-tasks-fr-tm-2-fr-tm-5)
  - [Update Task](#update-task-fr-tm-3)
  - [Delete Task](#delete-task-fr-tm-4)

- [Notes & Folder Management](#notes--folder-management)
  - [Create Folder](#create-folder-fr-fld-1)
  - [Create Note](#create-note-fr-note-1)
  - [Auto-Save Note](#auto-save-note-fr-note-3)

- [Dashboard & Analytics](#dashboard--analytics)
  - [Dashboard Load](#dashboard-load-fr-dash-1-to-fr-dash-4-fr-an-1-to-fr-an-5)


### 📊 Data Flow Diagrams (DFD)
- [DFD Level 0 - Context Diagram](#dfd-level-0---context-diagram)
- [DFD Level 1 - Major System Processes](#dfd-level-1---major-system-processes)

#### DFD Level 2
- [User Management](#dfd-level-2---user-management)
- [Task Management](#dfd-level-2---task-management)
- [Calendar Management](#dfd-level-2---calendar-management)
- [Notes & Folder Management](#dfd-level-2---notes--folder-management)
- [Dashboard & Analytics](#dfd-level-2---dashboard--analytics)

#### DFD Level 3
- [Microservice Analytics](#dfd-level-3---microservice-analytics)

</details>

---
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

# 🚀 SYSTEM DESIGN - DETAILED

## SEQUENCE DIAGRAMS 
### User Management
#### Registration (FR-UM-1, FR-UM-2, FR-UM-3)

```mermaid
sequenceDiagram
    participant U as Guest User
    participant R as React
    participant F as Flask API
    participant DB as PostgreSQL

    U->>R: Enter Registration Details
    R->>F: POST /register
    F->>DB: Check Username & Email Unique
    DB-->>F: Validation Result
    F->>F: Hash Password
    F->>DB: Save New User
    DB-->>F: Success
    F-->>R: Registration Success
    R-->>U: Redirect to Login

```

#### Login (FR-UM-4, FR-UM-5)

```mermaid
sequenceDiagram
    participant U as User
    participant R as React
    participant F as Flask
    participant DB as PostgreSQL

    U->>R: Enter Credentials
    R->>F: POST /login
    F->>DB: Fetch User Record
    DB-->>F: User Data
    F->>F: Verify Password Hash
    F-->>R: Create Session + Success
    R-->>U: Redirect to Dashboard

```


####  Logout (FR-UM-6)

```mermaid
sequenceDiagram
    participant U as User
    participant R as React
    participant F as Flask

    U->>R: Click Logout
    R->>F: POST /logout
    F->>F: Destroy Session
    F-->>R: Logout Success
    R-->>U: Redirect to Login

```



### Task Management

#### Create Task (FR-TM-1)

```mermaid
sequenceDiagram
    participant U as User
    participant R as React
    participant F as Flask
    participant DB as PostgreSQL

    U->>R: Enter Task Details
    R->>F: POST /tasks
    F->>F: Validate Session
    F->>DB: Insert Task (User ID)
    DB-->>F: Success
    F-->>R: Task Created
    R-->>U: Display Updated Task List

```


#### View Tasks (FR-TM-2, FR-TM-5)

```mermaid
sequenceDiagram
    participant U as User
    participant R as React
    participant F as Flask
    participant DB as PostgreSQL

    U->>R: Request Task List
    R->>F: GET /tasks
    F->>F: Validate Session
    F->>DB: Fetch Tasks by User ID
    DB-->>F: Task List
    F-->>R: JSON Task Data
    R-->>U: Render Task List

```

#### Update Task (FR-TM-3)

```mermaid
sequenceDiagram
    participant U
    participant R
    participant F
    participant DB

    U->>R: Edit Task
    R->>F: PUT /tasks/{id}
    F->>DB: Update Task where user_id matches
    DB-->>F: Success
    F-->>R: Updated Task
    R-->>U: Show Updated Task

```


#### Delete Task (FR-TM-4)

```mermaid
sequenceDiagram
    participant U
    participant R
    participant F
    participant DB

    U->>R: Delete Task
    R->>F: DELETE /tasks/{id}
    F->>DB: Delete Task (User Restricted)
    DB-->>F: Success
    F-->>R: Confirmation
    R-->>U: Remove from UI

```


### Notes & Folder Management
####  Create Folder (FR-FLD-1)

```mermaid
sequenceDiagram
    participant U
    participant R
    participant F
    participant DB

    U->>R: Create Folder
    R->>F: POST /folders
    F->>DB: Insert Folder
    DB-->>F: Success
    F-->>R: Folder Created
    R-->>U: Display Folder

```


#### Create Note (FR-NOTE-1)

```mermaid
sequenceDiagram
    participant U
    participant R
    participant F
    participant DB

    U->>R: Create Note in Folder
    R->>F: POST /notes
    F->>DB: Insert Note
    DB-->>F: Success
    F-->>R: Note Created
    R-->>U: Show Note Editor

```

#### Auto-Save Note (FR-NOTE-3)

```mermaid
sequenceDiagram
    participant R as React (Auto Save)
    participant F as Flask
    participant DB as PostgreSQL

    R->>F: PUT /notes/{id}
    F->>DB: Update Content + Timestamp
    DB-->>F: Success
    F-->>R: Save Confirmation

```

### Dashboard & Analytics
#### Dashboard Load (FR-DASH-1 to FR-DASH-4, FR-AN-1 to FR-AN-5)

```mermaid
sequenceDiagram
    participant U as User
    participant R as React
    participant F as Flask API
    participant S as Spring Boot Analytics
    participant DB as PostgreSQL

    U->>R: Open Dashboard
    R->>F: GET /dashboard
    F->>S: GET /analytics
    S->>DB: Fetch Task Data by User
    DB-->>S: Task Records
    S->>S: Compute Total, Completed, Pending, Weekly Stats
    S-->>F: JSON Analytics Data
    F-->>R: Combined Dashboard Response
    R-->>U: Render Dashboard Charts

```


## Data Flow Diagram (DFD)
### DFD Level 0 - Context Diagram

```mermaid
flowchart TB

    Guest[Guest User]
    User[Registered User]

    System((Simple Planner System))

    Guest -->|Register/Login Data| System
    System -->|Auth Response| Guest

    User -->|Tasks, Notes, Settings, Dashboard Requests| System
    System -->|System Responses| User

```

### DFD Level 1 - Major System Processes

```mermaid
flowchart TB

    %% External Entities
    Guest[Guest User]
    User[Registered User]

    %% Processes
    P1((User Management))
    P2((Task Management))
    P3((Calendar Management))
    P4((Notes & Folder Management))
    P5((Settings Management))
    P6((Dashboard & Analytics))

    %% Data Stores
    D1[(Users DB)]
    D2[(Tasks DB)]
    D3[(Folders DB)]
    D4[(Notes DB)]

    %% Guest Interactions
    Guest --> P1
    P1 --> Guest

    %% User Interactions
    User --> P2
    User --> P3
    User --> P4
    User --> P5
    User --> P6

    P2 --> User
    P3 --> User
    P4 --> User
    P5 --> User
    P6 --> User

    %% Data Store Connections
    P1 --> D1
    P2 --> D2
    P3 --> D2
    P4 --> D3
    P4 --> D4
    P5 --> D1
    P6 --> D2

```

### DFD LEVEL 2 - User Management

```mermaid
flowchart TB

    Guest[Guest/User]

    P11((Register))
    P12((Login))
    P13((Logout))
    P14((Update Profile))

    D1[(Users DB)]

    Guest --> P11
    Guest --> P12
    Guest --> P13
    Guest --> P14

    P11 --> D1
    P12 --> D1
    P14 --> D1

```


### DFD LEVEL 2 - Task Management 

```mermaid
flowchart TB

    User[Registered User]

    P21((Create Task))
    P22((View Tasks))
    P23((Update Task))
    P24((Delete Task))
    P25((Filter Task))

    D2[(Tasks DB)]

    User --> P21
    User --> P22
    User --> P23
    User --> P24
    User --> P25

    P21 --> D2
    P22 --> D2
    P23 --> D2
    P24 --> D2
    P25 --> D2

```


### DFD LEVEL 2 - Calendar Management


```mermaid
flowchart TB

    User[Registered User]

    P31((View Calendar))
    P32((Create Task via Calendar))
    P33((Edit Task via Calendar))
    P34((Delete Task via Calendar))

    D2[(Tasks DB)]

    User --> P31
    User --> P32
    User --> P33
    User --> P34

    P31 --> D2
    P32 --> D2
    P33 --> D2
    P34 --> D2

```


### DFD LEVEL 2 - Notes & Folder Management 

```mermaid
flowchart TB

    User[Registered User]

    P41((Create Folder))
    P42((Rename Folder))
    P43((Delete Folder))
    P44((Create Note))
    P45((Edit Note))
    P46((Auto Save Note))
    P47((Delete Note))
    P48((Retrieve Notes by Folder))

    D3[(Folders DB)]
    D4[(Notes DB)]

    User --> P41
    User --> P42
    User --> P43
    User --> P44
    User --> P45
    User --> P46
    User --> P47
    User --> P48

    P41 --> D3
    P42 --> D3
    P43 --> D3
    P44 --> D4
    P45 --> D4
    P46 --> D4
    P47 --> D4
    P48 --> D4

```

### DFD LEVEL 2 - Dashboard & Analytics

```mermaid
flowchart TB

    User[Registered User]

    P61((Request Dashboard))
    P62((Compute Analytics - Spring Boot))
    P63((Return Statistics))

    D2[(Tasks DB)]

    User --> P61
    P61 --> P62
    P62 --> D2
    D2 --> P62
    P62 --> P63
    P63 --> User

```


### DFD LEVEL 3 - Microservice Analytics


```mermaid
flowchart TB

    P62((Compute Analytics))

    P621((Fetch User Tasks))
    P622((Calculate Total Tasks))
    P623((Calculate Completed Tasks))
    P624((Calculate Pending Tasks))
    P625((Calculate Weekly Summary))
    P626((Generate JSON Response))

    D2[(Tasks DB)]

    P62 --> P621
    P621 --> D2
    D2 --> P621

    P621 --> P622
    P621 --> P623
    P621 --> P624
    P621 --> P625

    P622 --> P626
    P623 --> P626
    P624 --> P626
    P625 --> P626

```

