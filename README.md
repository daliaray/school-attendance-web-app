# School Attendance Web App

## Description
A full-stack SaaS platform to manage student attendance efficiently. Built with Angular (frontend), Node.js (backend), MySQL (database), and Docker for containerization.

This project allows teachers and admins to track attendance, generate reports, and analyze student data easily.

---

## Features
- User authentication (Admin & Teacher roles)
- Track student attendance in real-time
- Generate attendance reports and analytics
- Responsive and user-friendly frontend interface
- Dockerized deployment for easy setup

---

## Project Structure
att/           # Angular frontend
backend/       # Node.js backend
Dockerfile     # Docker configuration
.gitignore     # Git ignore configuration
README.md      # Project documentation


## Technologies Used
- Frontend: Angular, TypeScript, HTML, CSS
- Backend: Node.js, Express.js
- Database: MySQL
- DevOps: Docker
- Version Control: Git & GitHub
## Installation & Running the App

### Backend
cd backend
npm install
npm start
# Backend runs at http://localhost:3000

### Frontend
cd att
npm install
ng serve
# Frontend runs at http://localhost:4200

### Docker (Optional)
docker build -t attendance-app .
docker run -p 3000:3000 attendance-app
# App accessible at http://localhost:3000

## Usage
1. Log in as Admin or Teacher
2. Add students and classes
3. Mark daily attendance
4. Generate attendance reports

## Author
Dalia Rayane – [GitHub Profile](https://github.com/daliaray)

## License
MIT License
