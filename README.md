# Alumni Connect System

A full-stack web platform that connects **students, alumni, and university administrators** in one digital ecosystem.

The platform allows students and alumni to interact professionally through jobs, messaging, mentorship, and events.

---

# Technologies Used

## Frontend

- React (TypeScript)
- React Router
- Tailwind CSS
- Axios

## Backend

- Node.js
- Express.js

## Database

- MongoDB

---

# Features

### Student

- Register account
- View job opportunities
- Apply for jobs
- View events
- Message alumni
- Save jobs

### Alumni

- Register account
- Post job opportunities
- Offer mentorship
- Communicate with students
- Participate in events

### Admin

- Manage users
- Approve alumni accounts
- Approve job postings
- Manage events
- Monitor platform activity

---

# Project Structure

```

src
ิ๖้
ิ๖ฃิ๖วิ๖ว api
ิ๖้ ิ๖ฃิ๖วิ๖ว authApi.ts
ิ๖้ ิ๖ฃิ๖วิ๖ว eventApi.ts
ิ๖้ ิ๖ฃิ๖วิ๖ว jobApi.ts
ิ๖้ ิ๖๖ิ๖วิ๖ว messageApi.ts
ิ๖้
ิ๖ฃิ๖วิ๖ว components
ิ๖้ ิ๖ฃิ๖วิ๖ว admin
ิ๖้ ิ๖ฃิ๖วิ๖ว auth
ิ๖้ ิ๖ฃิ๖วิ๖ว dashboard
ิ๖้ ิ๖ฃิ๖วิ๖ว events
ิ๖้ ิ๖ฃิ๖วิ๖ว jobs
ิ๖้ ิ๖ฃิ๖วิ๖ว layout
ิ๖้ ิ๖๖ิ๖วิ๖ว messaging
ิ๖้
ิ๖ฃิ๖วิ๖ว pages
ิ๖้ ิ๖ฃิ๖วิ๖ว admin
ิ๖้ ิ๖ฃิ๖วิ๖ว alumni
ิ๖้ ิ๖ฃิ๖วิ๖ว student
ิ๖้ ิ๖ฃิ๖วิ๖ว LoginPage.tsx
ิ๖้ ิ๖ฃิ๖วิ๖ว RegisterPage.tsx
ิ๖้ ิ๖ฃิ๖วิ๖ว JobsPage.tsx
ิ๖้ ิ๖ฃิ๖วิ๖ว EventsPage.tsx
ิ๖้ ิ๖๖ิ๖วิ๖ว MessagingPage.tsx
ิ๖้
ิ๖ฃิ๖วิ๖ว context
ิ๖้ ิ๖๖ิ๖วิ๖ว AuthContext.tsx
ิ๖้
ิ๖ฃิ๖วิ๖ว hooks
ิ๖้
ิ๖๖ิ๖วิ๖ว types

```

---

# Authentication

The system uses **JWT authentication**.

Process:

1. User registers
2. Password is encrypted
3. User logs in
4. Server returns JWT token
5. Token is used for secure API requests

---

# API Endpoints

## Authentication

POST /api/register
POST /api/login

## Jobs

GET /api/jobs
POST /api/jobs
DELETE /api/jobs/:id

## Messages

POST /api/messages
GET /api/messages

## Events

GET /api/events
POST /api/events

---

# Installation

Clone the repository

```

git clone [https://github.com/patrick516/alumni-connect.git](https://github.com/patrick516/alumni-connect.git)

```

Install dependencies

```

npm install

```

Run development server

```

npm run dev

```

---

# Future Improvements

- Mobile application
- Real-time chat
- AI career recommendations
- Video mentorship
- Internship matching

---

# Author

Developed as a university project to improve alumniิว๔student engagement and career networking.

```

---
```
