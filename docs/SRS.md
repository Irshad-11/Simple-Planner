
# Software Requirements Specification (SRS)

## Simple Planner
### Multi-User Web-Based Task Scheduling, Notes, and Productivity Monitoring System



# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) document describes the functional and non-functional requirements of the **Simple Planner** system.

The purpose of this system is to provide a unified web-based platform for task management, calendar scheduling, notes organization, and dashboard analytics.

This document is intended for:

* Developers
* Course instructors
* Academic evaluators
* Project reviewers



## 1.2 Document Conventions

* “Shall” indicates a mandatory requirement.
* “Should” indicates a recommended requirement.
* “May” indicates an optional feature.



## 1.3 Intended Audience and Reading Suggestions

This document is intended for:

* Developers implementing the system
* Academic supervisors evaluating the project
* Students reviewing system design documentation

Readers may begin from Section 2 for overall understanding and Section 3 for detailed requirements.



## 1.4 Project Scope

The **Simple Planner** is a web-based multi-user productivity system that provides:

* User registration and authentication (session-based)
* Task management (CRUD operations)
* Calendar-based task scheduling
* To-Do list synchronization with calendar
* Folder-based notes management
* User settings management
* Dashboard with task statistics
* Analytics computation through a Spring Boot microservice (Course Requirement)

Technologies used:

* React (Frontend)
* Flask (Main Backend API)
* Spring Boot (Analytics Microservice)
* PostgreSQL (Relational Database)



## 1.5 Definitions, Acronyms, and Abbreviations

* SRS – Software Requirements Specification
* CRUD – Create, Read, Update, Delete
* API – Application Programming Interface
* UI – User Interface
* DB – Database



# 2. Overall Description

## 2.1 Product Perspective

The system is a standalone web-based application composed of:

* A React frontend interface
* A Flask backend API
* A Spring Boot analytics microservice
* A PostgreSQL relational database

The analytics component is separated to demonstrate microservice architecture as required for the academic coursework.



## 2.2 Product Functions

The system shall allow authenticated users to:

* Register and log in securely
* Create, update, delete, and view tasks
* View tasks in both list and calendar formats
* Manage To-Do items synchronized with the calendar
* Organize notes in folders
* Modify user settings (theme and profile)
* View dashboard statistics including:

  * Total tasks
  * Completed tasks
  * Pending tasks
  * Weekly completion summary



## 2.3 User Classes and Characteristics

| User Type        | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| Registered User  | A user who has successfully registered and authenticated in the system.    |
| Guest User       | A user who has not authenticated and can only access login and registration pages. |

Users are expected to have basic knowledge of web applications.



## 2.4 Operating Environment

* Web Browser (Chrome, Firefox, Edge)
* Backend Server (Flask + Spring Boot)
* PostgreSQL Database Server
* Internet connection required



## 2.5 Design and Implementation Constraints

* Java (Spring Boot) must be used for analytics microservice (course requirement).
* Session-based authentication shall be used.
* Relational database shall be PostgreSQL.
* The system is developed for academic purposes.



## 2.6 Assumptions and Dependencies

* Users have internet access.
* Database server is operational.
* Backend services are running correctly.



# 3. Specific Requirements



# 3.1 Functional Requirements

## 3.1.1 User Management

FR-UM-1: The system shall allow new users to register with:

* Username
* First Name
* Last Name
* Email
* Password

FR-UM-2: The system shall ensure username and email are unique.

FR-UM-3: The system shall store passwords using secure hashing.

FR-UM-4: The system shall allow login using username or email and password.

FR-UM-5: The system shall create a server-side session upon successful login.

FR-UM-6: The system shall allow users to log out.

FR-UM-7: The system shall allow profile retrieval.

FR-UM-8: The system shall allow updating username, email, and password.



## 3.1.2 Task Management

FR-TM-1: The system shall allow task creation with:

* Title
* Description
* Due Date
* Priority
* Status (Done, Progress, Waiting)

FR-TM-2: The system shall allow users to view all tasks.

FR-TM-3: The system shall allow updating task details.

FR-TM-4: The system shall allow deleting tasks.

FR-TM-5: The system shall ensure users access only their own tasks.

FR-TM-6: The system shall allow filtering by:

* Status
* Due Date
* Priority



## 3.1.3 Calendar Management

FR-CAL-1: The system shall display tasks in a calendar view.

FR-CAL-2: The system shall synchronize tasks between calendar and list view.

FR-CAL-3: The system shall allow task creation via calendar.

FR-CAL-4: The system shall allow editing tasks via calendar.

FR-CAL-5: The system shall allow deleting tasks via calendar.



## 3.1.4 Notes and Folder Management

FR-FLD-1: Users shall create folders.

FR-FLD-2: Users shall rename folders.

FR-FLD-3: Users shall delete folders.

FR-NOTE-1: Users shall create notes inside folders.

FR-NOTE-2: Users shall edit note title and content.

FR-NOTE-3: The system shall auto-save notes.

FR-NOTE-4: Users shall delete notes.

FR-NOTE-5: Users shall retrieve notes by folder.



## 3.1.5 Settings Management

FR-SET-1: Users shall access a settings page.

FR-SET-2: Users shall switch between light and dark mode.

FR-SET-3: Selected theme shall persist across sessions.

FR-SET-4: Users shall update account credentials.



## 3.1.6 Dashboard & Analytics

FR-DASH-1: The system shall provide a dashboard view.

FR-DASH-2: The dashboard shall display:

* Total tasks
* Completed tasks
* Pending tasks

FR-DASH-3: The system shall calculate and display completion percentage.

FR-DASH-4: The dashboard shall display weekly task completion summary.



## 3.1.7 Analytics Microservice (Spring Boot)

FR-AN-1: The microservice shall expose a REST endpoint for analytics data.

FR-AN-2: The microservice shall compute:

* Total tasks
* Completed tasks
* Pending tasks
* Weekly completion statistics

FR-AN-3: The microservice shall retrieve data from PostgreSQL.

FR-AN-4: The microservice shall return JSON response.

FR-AN-5: Flask backend shall integrate analytics response to frontend.



## 3.1.8 Security Requirements

FR-SEC-1: Authentication shall be required for protected routes.

FR-SEC-2: The system shall validate user session before processing requests.

FR-SEC-3: Users shall not access other users’ data.



# 4. Non-Functional Requirements

## 4.1 Performance Requirements

* The system shall respond within 3 seconds for standard operations.
* Dashboard data shall load within 5 seconds.

## 4.2 Security Requirements

* Passwords shall be hashed.
* Sessions shall expire after logout.
* Data isolation shall be maintained.

## 4.3 Usability Requirements

* The interface shall be simple and user-friendly.
* Navigation shall be intuitive.
* Theme toggle shall improve accessibility.

## 4.4 Reliability Requirements

* The system shall maintain consistent data storage.
* The system shall handle invalid input gracefully.



# 5. External Interface Requirements

## 5.1 User Interface

* Web-based graphical interface.
* Calendar view.
* Dashboard charts.
* Folder navigation panel.

## 5.2 Software Interfaces

* React frontend communicates with Flask API via HTTP.
* Flask communicates with Spring Boot microservice via REST.
* Both backend services connect to PostgreSQL.



# 6. Conclusion

The Simple Planner system is an academic full-stack web application that integrates task management, calendar scheduling, notes organization, and dashboard analytics using a microservice architecture.

The system demonstrates structured system analysis, modular backend design, and secure multi-user web application development.
