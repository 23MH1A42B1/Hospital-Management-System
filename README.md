# Hospital Management System

A comprehensive, role-based Hospital Management System built with React, Vite, and Redux Toolkit. This application provides entirely customized portals and workflows for Admins, Doctors, Patients, Nurses, and Receptionists/Staff elements.

## Features

- **Multi-role Access**: Distinct dashboards and capabilities for:
  - **Admin**: System analytics, staff management, department oversight.
  - **Doctor**: Appointment scheduling, electronic health records (EHR), prescriptions, lab orders.
  - **Patient**: Personal medical history, appointment booking, secure messaging, test results.
  - **Nurse**: Patient vitals tracking, ward management, doctor orders execution.
  - **Receptionist/Staff**: Patient intake, billing, simple inventory/pharmacy management.
- **Redux State Management**: Centralized application state for users, appointments, and modules.
- **Responsive Design**: Mobile-friendly interfaces built with modern foundational CSS.
- **Dynamic Profiles**: Customized, highly detailed profile settings and display options per role.

## Technologies Used

- React 19
- Vite
- Redux Toolkit
- React Router DOM
- Date-fns (date formatting)
- Recharts (data visualization dashboards)
- Lucide React (icons)
- Vanilla CSS (for layout and thematic styling)

## Local Development Setup

To run this application locally on your machine for development without Docker:

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd hospital-tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the application at `http://localhost:5173`. You can log in with demo credentials provided on the login page (or create a new user profile).

## Docker Deployment (Production)

This project includes a multi-stage `Dockerfile` optimizing the build for production and using Nginx to serve the fast, static application bundle.

### Prerequisites
- Docker installed on your machine.

### Build the Docker Image
From the root of the project, run:
```bash
docker build -t hospital-tracker:latest .
```

### Run the Docker Container
Launch the built image on port 8080 (or any preferred port):
```bash
docker run -d -p 8080:80 --name hospital-tracker-app hospital-tracker:latest
```
Access the production-ready application at `http://localhost:8080`.

### Notes on Nginx Configuration
A custom `nginx.conf` is included to ensure that React Router (client-side routing) works correctly by redirecting all 404 endpoints directly back to `index.html`.

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
