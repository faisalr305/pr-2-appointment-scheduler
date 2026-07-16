# Appointment Scheduler

## Overview

Appointment Scheduler is a full-stack web application that allows users to book, manage, and organize appointments with service providers. Users can register, log in, create appointments, edit or cancel bookings, and view their appointment history. Service providers can manage their availability and scheduled appointments.


## Screenshots


## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- bcrypt

### Tools
- Git
- GitHub
- VS Code

---

## Getting Started

1. Clone the repository.
2. Install dependencies.
3. Create a `.env` file.
4. Start the server.
5. Open the application in your browser.


## Installation

bash
git clone

cd appointment-scheduler

npm install

npm run dev


Create a `.env` file:
env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

---

## User Stories

As a user I can:

- Register an account
- Log in 
- log out
- View my dashboard
- Book an appointment
- Edit an appointment
- Cancel an appointment
- Delete an appointment
- View appointment history
- Manage my availability
- View appointments
- Update appointment status



## Database Design

### User

| Field | Type |
|-------|------|
| _id | ObjectId |
| name | String |
| email | String |
| password | String |
| role | String |

### Appointment

| Field | Type |
|-------|------|
| _id | ObjectId |
| user | ObjectId |
| provider | ObjectId |
| title | String |
| service | String |
| date | Date |
| startTime | String |
| endTime | String |
| status | String |
| notes | String |

### Availability

| Field | Type |
|-------|------|
| _id | ObjectId |
| provider | ObjectId |
| day | String |
| availableSlots | Array |

---

## Routes

### USER

| Method | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/register | Register a user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | View user profile |

### Appointments

| Method | Route | Description |
|---------|-------|-------------|
| GET | /api/appointments | View all appointments |
| POST | /api/appointments | Create an appointment |
| GET | /api/appointments/:id | View appointment details |
| PUT | /api/appointments/:id | Update an appointment |
| DELETE | /api/appointments/:id | Delete an appointment |
| PATCH | /api/appointments/:id/status | Update appointment status |

### Availability

| Method | Route | Description |
|---------|-------|-------------|
| GET | /api/availability | View all availability |
| POST | /api/availability | Add availability |
| GET | /api/availability/:providerId | View provider availability |
| PUT | /api/availability/:id | Update availability |
| DELETE | /api/availability/:id | Delete availability |

---

## Features

- User authentication
- Book appointments
- Edit appointments
- Delete appointments
- Manage provider availability
- Appointment status tracking
- Responsive design
- MongoDB database

---

## Future Enhancements

- Calendar view
- Email reminder
- Search and filter appointments
- Dark mode

---

## Credits

