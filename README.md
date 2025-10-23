# INFS605-Assignment2
This is a completed INFS605 Microservices Programming Assignment.It extends the original

starter application by adding multiple new microservices to create a small-scale distributed 

student management system.

The system now includes:
- A student-profile service (Python + Flask)
- A course-catalogue service
- A feedback service (with YouTube-style comment interface)
- An enrolment service (linking students and courses)
- A PostgreSQL database for persistence
- A React (Vite) frontend with sections for Students, Courses, Feedback, and Enrolments
- A shared Docker Compose file to orchestrate all services

## Microservices Assignment Summary

This repository is the final implementation for the INFS605 Microservices course (BCIS Year 2).
It demonstrates a fully containerized microservices architecture with distinct service responsibilities and a shared Postgres database.

## Directory Structure
```
microservices-assignment/
├── docker-compose.yml
├── README.md
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── course-catalogue.jsx
│   │   ├── feedback.jsx
│   │   ├── enrolment.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── student-profile/
│   ├── app.py
│   ├── Dockerfile
│   ├── init.sql
│   ├── wait-for-it.sh
│   └── requirements.txt
├── course-catalogue/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── feedback/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── enrolment/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── postgres
│   └── init.sql
└── LICENSE
```


## Technologies Used
- Python + Flask for backend microservices
- React (Vite) for the admin frontend
- PostgreSQL for persistence
- Docker & Docker Compose for deployment and networking
- Flask-CORS for service-to-frontend communication

## Added Microservices 
 - student-profile : http://localhost:5001
 - course-catalogue : http://localhost:5002
 - feedback : http://localhost:5003
 - enrolment : http://localhost:5004

## Getting Started

### 1. Prerequisites
running this code locally on your laptop you will need: 
- Docker Desktop
- Python3

### 2. Clone The Repository

git clone https://github.com/BonecaAmbalabu/NEW-22170632-Microservices
cd NEW-22170632-Microservices

### 3. Build and Run the System

docker compose up --build

Wait for the containers to build and initialize 
Then open the following URLs

 - student-profile : http://localhost:5001
 - course-catalogue : http://localhost:5002
 - feedback : http://localhost:5003
 - enrolment : http://localhost:5004

## Data Initialisation

The Postgres container runs `postgres/init.sql` on first build. This script:

-   Creates tables for students, courses, feedback, and enrolments
-   Inserts some sample data for testing.

## Key API Endpoints

### 1. Student Profile Service (:5001)
 - GET /students
 - POST /students → { name, email }
 - PUT /students/:id
 - DELETE /students/:id
 - POST /students/:id/attendance

 ### 2. Course Catalogue Service (:5002)
 - GET /courses
 - POST /courses → { code, name, description }

### 3. Feedback (:5003)
 - GET /feedback
 - POST /feedback → { student_name, course, comment }

### 4. Enrolment Service (:5004)
 - GET /enrolments
 - POST /enrolments → { student_name, course_code }
 - DELETE / enrolments/:id

## Frontend Features 

The React Admin UI provides:
- Student Management: add, search, delete, and record attendance
- Course Catalogue: View and add courses dynamically
- Feedback Section: Submit Feedback using dropdown of existing courses
- Enrolment Section Assign students to courses using dropdowns to ensure valid data

## Known Behavior / Notes

- If new courses or students are added refresh the page to see it.
- make sure Docker desktop is on when running ( docker compose up )
- If containers fail to start, try: 
docker compose down -v
docker compose up --build
