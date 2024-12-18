Edu-Tech Platform
Overview
Edu-Tech Platform is a project management and collaboration tool designed for educational purposes. It provides functionality for candidates to log in, view available projects, accept and manage their assigned projects, and track progress through tasks. The platform also features a leaderboard to rank candidates based on their performance.

This application includes:

A backend API built using Node.js, Express, and mock data for simplicity.
A frontend UI built with HTML, CSS, and JavaScript to interact with the API.
A visually appealing design for a seamless user experience.
Features
Backend
View Available Projects: Fetch and display all unassigned projects.
Project Acceptance: Assign projects to candidates, ensuring no duplication.
Task Management: Update task completion statuses for assigned projects.
Project Submission: Lock completed projects and calculate scores based on task completion.
Candidate Leaderboard: View rankings based on total scores of submitted projects.
Frontend
Login Section: Candidate ID-based authentication.
Available Projects Section: View and accept projects.
Assigned Projects Section: Manage tasks and submit completed projects.
Leaderboard Section: Displays ranked candidates.
Installation
Prerequisites
Node.js (v14 or later)
NPM (Node Package Manager)
Backend Setup
Clone the repository:
bash
Copy code
git clone https://github.com/yourusername/edu-tech-platform.git
Navigate to the backend directory:
bash
Copy code
cd edu-tech-platform
Install dependencies:
bash
Copy code
npm install
Start the server:
bash
Copy code
node server.js
The server will start on http://localhost:3000.
Frontend Setup
Navigate to the frontend directory:
bash
Copy code
cd frontend
Open index.html in a web browser.
API Endpoints
Projects
GET /projects: Fetch all available projects.
POST /projects/accept: Assign a project to a candidate.
POST /projects/update-task: Update the completion status of a task in an assigned project.
POST /projects/submit: Submit a completed project.
GET /projects/assigned/:candidateId: Fetch all projects assigned to a candidate.
GET /projects/rankings: View the leaderboard.
Error Handling
All API responses include status codes and descriptive error messages for invalid requests.

Project Structure
graphql
Copy code
edu-tech-platform/
├── backend/
│   ├── server.js         # Express server with API logic
│   └── package.json      # Backend dependencies
├── frontend/
│   ├── index.html        # Main UI
│   ├── styles.css        # Styling for the frontend
│   ├── app.js            # JavaScript for frontend logic
│   └── assets/           # Static files (images, icons, etc.)
└── README.md             # Project documentation
How to Use
Login: Enter a candidate ID to access the platform.
View Projects: Browse available projects and accept one.
Manage Tasks: Mark tasks as completed and track your progress.
Submit Project: Finalize your work and submit it for evaluation.
View Leaderboard: Check your ranking among other candidates.
Technologies Used
Backend: Node.js, Express.js, CORS, Body-parser, UUID
Frontend: HTML, CSS, JavaScript
Styling: Font Awesome, Responsive Design
Future Enhancements
Database Integration: Replace mock data with a persistent database (e.g., MongoDB, PostgreSQL).
Authentication: Add secure login functionality with JWT or OAuth.
Email Notifications: Notify candidates about project updates.
Analytics Dashboard: Provide insights into project performance.
Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch:
bash
Copy code
git checkout -b feature/your-feature-name
Commit your changes:
bash
Copy code
git commit -m "Add your message"
Push to the branch:
bash
Copy code
git push origin feature/your-feature-name
Create a pull request.
Contact
Author: Shashank Bhushan
Email: s.bhushan910@gmail.com
