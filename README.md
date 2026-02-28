
<div align="center">

<img src="https://github.com/Irshad-11/Documents/blob/main/Simple%20Planner.png?raw=true" width="100%" />

# 🗂️ Simple Planner

### Multi-User Web-Based Task Scheduling, Notes, and Productivity Monitoring System  
🎓 Academic Coursework Project – System Analysis and Design

</div>


## 📌 Overview

**Simple Planner** is a multi-user web-based productivity system that integrates:

- 📝 Task Management  
- 📅 Calendar Scheduling  
- ✅ To-Do & Task Management with Calendar Sync  
- 📂 Folder-based Notes Management
- 📊 Dashboard Analytics (Task Summary & Weekly Overview)

> [!NOTE]
> 📘 For detailed information about problem analysis, methodology, feasibility study, and system planning,  
> please review the official **Project Proposal**:  
> 👉 [Project Proposal (PDF)](https://github.com/Irshad-11/Simple-Planner/blob/main/docs/ProjectProposal.pdf)

# 🏗️ System Architecture

## 🔄 High-Level Flow

```mermaid
flowchart TD

A[User] --> B[React Frontend]

B --> C[Flask Backend API]
C --> D[(PostgreSQL Database)]

C --> E[Spring Boot Analytics]
E --> D

E --> C
C --> B
````

### 🏗️ Design Choice

- React is used to build a dynamic and responsive user interface.
- Flask manages authentication, session handling, CRUD operations, and API routing.
- PostgreSQL stores structured relational data including users, tasks, notes, and folders.
- Spring Boot is implemented as a dedicated Analytics Microservice (Course Requirement) to process dashboard-related data.
- Flask communicates with the Spring Boot microservice and forwards analytics results to the frontend dashboard.


# 🚀 Core Features

## 👤 User Management

* Registration & Login (Session-based)
* Unique Email & Username validation
* Secure password hashing
* Profile update & logout

## 📋 Task Management

* Create, Read, Update, Delete tasks
* Status tracking (Done, Progress, Waiting)
* Priority & due date filtering
* Task ownership isolation

## 📅 Calendar Integration

* View tasks in calendar format
* Real-time sync with To-Do list
* Edit & delete directly from calendar

## 📝 Notes & Folder Management

* Folder creation & organization
* Rich note editing
* Auto-save feature
* Tag support

## 📊 Dashboard & Analytics

* Total / Completed / Pending tasks
* Completion percentage
* Weekly performance chart
* Productivity score calculation
* Analytics via Spring Boot microservice

## 🔐 Security

* Session validation
* Authentication required for protected routes
* Data isolation between users


# 🛠️ Technology Stack

| Layer                  | Technology         | Icon                                                                                             |
| ---------------------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| Frontend               | React (JavaScript) | <img src="https://img.icons8.com/?size=100&id=asWSSTBrDlTW&format=png&color=000000" width="40"/> |
| Backend API            | Flask (Python)     | <img src="https://img.icons8.com/?size=100&id=5mbMwDZ796xj&format=png&color=000000" width="40"/> |
| Analytics Microservice | Spring Boot (Java) | <img src="https://img.icons8.com/?size=100&id=90519&format=png&color=000000" width="40"/>        |
| Database               | PostgreSQL         | <img src="https://img.icons8.com/?size=100&id=38561&format=png&color=000000" width="40"/>        |


# 📂 Documentation

This project is thoroughly documented as part of academic coursework.

📘 You can explore:

* Software Requirements Specification (SRS)
* System Design
* API Design
* UML Diagrams
* Project Proposal
* Testing Documents

**Explore Full Documentation Here:**
🔗 [Docs - *Simple Planner*](https://github.com/Irshad-11/Simple-Planner/tree/main/docs)


# 🎓 Coursework Information

* Course: System Analysis and Design Sessional (SE 118)
* University: University of Frontier Technology, Bangladesh
* Department: Software Engineering
* Irshad Hossain (ID: 2303030)

# 📅 Project Timeline

```mermaid
gantt
    title Simple Planner Development Timeline
    dateFormat  YYYY-MM-DD
    section Research & Planning
    SRS and Data Collection     :done,    r1, 2024-01-01, 7d
    Requirement Finalization    :done,    r2, 2024-01-08, 7d
    section Design
    System Design & Modeling    :done,    d1, 2024-01-15, 7d
    section Implementation
    System Development          :active,  i1, 2024-01-22, 14d
    section Testing
    System Testing              :         t1, 2024-02-05, 7d
    section Deployment
    Documentation & Deployment  :         dp1, 2024-02-12, 7d
```


<div align="center">

This project is open-source, and contributions are welcome.

</div>




