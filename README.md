# 🏥 MediCare HMS — Hospital Management System

> ⚠️ **DEMO APPLICATION ONLY** — This project uses entirely fictional data and is intended for demonstration and portfolio purposes only. It is **not** intended for real clinical or medical use.

---

## 📋 Overview

**MediCare HMS** is a full-featured, role-based Hospital Management System built with **React 19**, **Redux Toolkit**, **React Router v7**, and **Recharts**. It simulates a real-world hospital workflow with six distinct user roles, each with their own dedicated dashboard and feature set.

---

## 🚀 Features

### 👤 Role-Based Access Control
Six distinct portals, each with protected routes:

| Role | Access |
|------|--------|
| 🔐 Admin | Full system control — analytics, staff, inventory, billing, reports |
| 👨‍⚕️ Doctor | Appointment requests (approve/reject), patient records |
| 🤒 Patient | Book appointments, view records, billing history, notifications |
| 🏥 Receptionist | Appointment management, patient registration |
| 👩‍⚕️ Nurse | Patient record view and updates |
| 💊 Pharmacist | Medication inventory, prescription dispensing |

### 📊 Admin Dashboard
- KPI cards: Total patients, appointments, revenue, staff
- Recharts line chart — appointment trends (6 months)
- Bar chart — monthly revenue
- Pie charts — department revenue & patient demographics

### 📅 Appointment Workflow
- Multi-step appointment request: Department → Doctor → Form → Confirm
- Approval workflow: `pending → approved / rejected`
- In-app notifications triggered on every status change

### 🏥 15 Doctors Across All Departments
Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, Gynecology, Oncology, Emergency, Radiology, Psychiatry, ENT, Urology, Gastroenterology, Nephrology, Pulmonology

### 💊 Inventory Management
- Real-time stock tracking with reorder level alerts
- Expiry date tracking with colour-coded warnings
- Categorised: Medicines, Surgical Supplies, Equipment, General Supplies

### 💳 Billing & Finance
- Invoice generation with line items, tax, and discounts
- Payment status tracking: Paid / Pending / Overdue
- Reports with downloadable breakdowns

### 🔔 Notification System
- In-app notification bell with unread badge
- Notification types: appointment approved/rejected, low stock, expiry alerts, reminders

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 19 + Vite 7 |
| State Management | Redux Toolkit |
| Routing | React Router v7 |
| Charts | Recharts |
| Icons | Lucide React |
| Forms | React Hook Form |
| Styling | Vanilla CSS with CSS variables |
| Date Utilities | date-fns |

---

## 📁 Project Structure

```
src/
├── app/
│   └── store.js              # Redux store
├── components/
│   ├── NotificationBell.jsx  # In-app notifications
│   └── Toast.jsx             # Toast notification system
├── data/
│   └── mockData.js           # All mock data (15 doctors, patients, staff, etc.)
├── layouts/
│   ├── AdminLayout.jsx
│   ├── DoctorLayout.jsx
│   ├── PatientLayout.jsx
│   └── StaffLayout.jsx
├── pages/
│   ├── Login.jsx
│   ├── admin/               # Dashboard, PatientMgmt, StaffMgmt, Inventory, Billing, Reports
│   ├── doctor/              # DoctorDashboard, AppointmentRequests, PatientRecords
│   ├── patient/             # Dashboard, RequestAppointment, MyAppointments, MedicalRecords, BillingHistory, Notifications
│   └── staff/               # ReceptionistDashboard, NurseDashboard, PharmacistDashboard
├── slices/
│   ├── authSlice.js
│   ├── appointmentsSlice.js  # Approval workflow
│   ├── patientsSlice.js
│   ├── doctorsSlice.js
│   ├── inventorySlice.js
│   ├── billingSlice.js
│   ├── notificationsSlice.js
│   └── staffSlice.js
└── styles/
    └── global.css
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | doctor@hospital.com | doc123 |
| Patient | patient@hospital.com | pat123 |
| Receptionist | receptionist@hospital.com | rec123 |
| Nurse | nurse@hospital.com | nurse123 |
| Pharmacist | pharmacist@hospital.com | pharma123 |

---

## ⚡ Getting Started

```bash
# Clone the repository
git clone https://github.com/23MH1A42B1/Hospital-Management-System.git
cd Hospital-Management-System

# Install dependencies
npm install

# Start development server
npm run dev
```

App will be available at **http://localhost:5173**

---

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

---

## 📸 Screenshots

> Login page with role-based quick access, Admin analytics dashboard with charts, Doctor appointment approval workflow, Patient appointment booking flow.

---

## ⚠️ Disclaimer

This is a **demo application** with entirely fictional patient data, doctor names, and medical records. It must **not** be deployed for real medical operations, used for actual clinical decisions, or used to store real patient information.

---

## 📄 License

MIT License — Free to use for educational and portfolio purposes.

---

<div align="center">
  Built with ❤️ using React + Redux Toolkit &nbsp;|&nbsp; <strong>MediCare HMS Demo</strong>
</div>
