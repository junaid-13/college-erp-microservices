# College ERP

Modern College ERP powered by microservices, enabling seamless academic, administrative, library, attendance, and payroll management.

## Project Summary

College ERP is a full-stack, microservices-based Enterprise Resource Planning platform designed to streamline academic and administrative operations within educational institutions. The system provides dedicated web portals for students, faculty, department heads, administrators, librarians, and payroll administrators, ensuring role-based access and efficient workflow management.

Built with React (Vite) on the frontend and Node.js/Express on the backend, the platform follows a scalable microservices architecture with services for authentication, student and faculty management, attendance tracking, assessments, marks, timetables, leave management, library operations, payroll processing, notifications, and more. AWS S3 is used for cloud storage, and PM2 manages service deployment and monitoring through a centralized API gateway.

## Tech Stack

- **Frontend:** ReactJS (Vite)
- **Backend:** NodeJS, ExpressJS
- **Database:** MongoDB
- **Cloud:** AWS (S3)
- **Process Manager:** PM2

## Repository Structure

```text
college-erp/
├── frontend/
│   ├── student-portal/      # React (Vite) app — student self-service (port 5173)
│   ├── hod-portal/          # React (Vite) app — HOD student + faculty management (port 5174)
│   ├── admin-portal/        # React (Vite) app — Admin department management (port 5175)
│   ├── faculty-portal/      # React (Vite) app — faculty self-profile (port 5176)
│   ├── librarian-portal/    # React (Vite) app — Librarian library back-office (port 5177)
│   └── payroll-admin-portal/ # React (Vite) app — Payroll Admin / HR (port 5178)
├── backend/
│   ├── api-gateway/         # Central API gateway + routing + health dashboard
│   ├── auth-service/
│   ├── student-service/
│   ├── faculty-service/
│   ├── department-service/
│   ├── attendance-service/
│   ├── marks-service/
│   ├── leave-service/
│   ├── subject-service/
│   ├── timetable-service/
│   ├── assessment-service/
│   ├── feedback-service/
│   ├── library-service/
│   ├── payroll-service/
│   └── notification-service/
├── shared/                  # Reusable libs (db, logger, middleware, aws)
├── infrastructure/
│   └── pm2/                 # PM2 ecosystem config
├── docs/
├── package.json
├── README.md
└── .gitignore
```

## Getting Started

### 1. Install dependencies

Each service and the frontend manage their own dependencies. Install the shared
package and any service you want to run:

```bash
cd shared && npm install
cd ../backend/api-gateway && npm install
cd ../../frontend/student-portal && npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` at the root and in each service directory, then
fill in MongoDB Atlas URI, AWS credentials, etc.

```bash
cp .env.example .env
```

### 3. Run the frontend

```bash
cd frontend/student-portal
npm run dev
```

### 4. Run a backend service

```bash
cd backend/api-gateway
npm run dev
```

### 5. Run everything with PM2

```bash
pm2 start infrastructure/pm2/ecosystem.config.js
pm2 logs
```
