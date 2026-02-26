# CipherSQL Studio

A full-stack SQL assessment platform that allows users to:

* Browse SQL challenges
* Execute sandboxed SQL queries (PostgreSQL)
* Receive AI-generated hints (Gemini)
* Track query attempts and performance
* Work within isolated schemas per assignment

---

## Architecture Overview

```
Frontend (React + Vite + Monaco Editor)
        ↓
REST API (Node.js + Express)
        ↓
MongoDB (Assignments + Attempts)
        ↓
PostgreSQL (Isolated execution schemas)
        ↓
Gemini API (AI Hint Generation)
```

### Responsibilities

| Layer      | Responsibility                             |
| ---------- | ------------------------------------------ |
| React      | UI, Editor, API communication              |
| Express    | API routing, validation, execution control |
| MongoDB    | Stores assignments & user attempts         |
| PostgreSQL | Executes sandboxed SQL queries             |
| Gemini     | Generates contextual SQL hints             |

---

# Tech Stack

### Backend

* Node.js
* Express
* MongoDB (Mongoose)
* PostgreSQL (pg)
* Gemini API

### Frontend

* React (Vite)
* Axios
* Monaco Editor
* React Router

---

# Project Structure

```
cipher-sql-studio/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── pages/
│   │   ├── components/
│   │   └── main.jsx
│
└── README.md
```

---

# Environment Variables

---

## Backend `.env.example`

```env
POSTGRES_URI=
MONGO_URI=
PORT=3000
GEMINI_API_KEY=
```

### Explanation

| Variable       | Description                  |
| -------------- | ---------------------------- |
| POSTGRES_URI   | PostgreSQL connection string |
| MONGO_URI      | MongoDB connection string    |
| PORT           | Backend server port          |
| GEMINI_API_KEY | Google Gemini API key        |

---

## Frontend `.env.example`

```env
VITE_API_BASE_URL=
```

### Example

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

# Installation Guide

---

## 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd cipher-sql-studio
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```bash
cp .env.example .env
```

Fill in environment variables.

Start server:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:3000
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```bash
cp .env.example .env
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# API Documentation

---

## Get All Assignments

```
GET /api/assignments
```

### Response

```json
[
  {
    "_id": "string",
    "title": "string",
    "difficulty": "easy | medium | hard",
    "description": "string"
  }
]
```

---

## Get Assignment By ID

```
GET /api/assignments/:id
```

---

## Execute SQL Query

```
POST /api/query/execute
```

### Body

```json
{
  "assignmentId": "string",
  "query": "SELECT * FROM users"
}
```

### Response

```json
{
  "rows": [],
  "rowCount": 0,
  "executionTime": 12
}
```

### Validation Rules

* Only `SELECT` queries allowed
* No semicolons allowed
* Executes inside isolated schema
* Automatically rolled back

---

## Generate AI Hint

```
POST /api/hint
```

### Body

```json
{
  "assignmentId": "string",
  "userQuery": "SELECT * FROM users",
  "errorMessage": null
}
```

### Response

```json
{
  "hint": "Try using GROUP BY..."
}
```

---

# Security Features

* Prevents multi-statement execution
* Restricts to SELECT queries only
* Uses transaction rollback for sandboxing
* Schema-based query isolation
* Validates schema name with regex

---

# Database Design

---

## MongoDB Collections

### Assignments

Stores:

* Title
* Difficulty
* Question
* PostgreSQL schema name
* Tables structure

### Attempts

Stores:

* Assignment reference
* Query text
* Execution time
* Error message
* Result preview
* Success flag

---

## PostgreSQL Design

Each assignment has:

```
schema_name/
    ├── table1
    ├── table2
```

Queries are executed with:

```
SET LOCAL search_path TO "schema_name"
```

Then rolled back.

---

# Deployment Guide

---

## Backend

Recommended:

* Railway
* Render
* Fly.io
* VPS (PM2 + Nginx)

Set environment variables in production.

---

## Frontend

Build production:

```bash
npm run build
```

Deploy to:

* Vercel
* Netlify
* Cloudflare Pages

Set:

```
VITE_API_BASE_URL=https://your-backend-url/api
```

---

# Production Considerations

* Add JWT authentication
* Add rate limiting
* Add query timeout protection
* Add SQL parser validation
* Add request logging (Winston)
* Add monitoring (Sentry)

---

# Future Improvements

* Leaderboard system
* Query history panel
* Real-time query execution timer
* Schema visualizer
* Role-based admin dashboard

---

# Development Scripts

## Backend

```bash
npm run dev
npm start
```

## Frontend

```bash
npm run dev
npm run build
```

---

# Troubleshooting

### 400 Bad Request

* Query contains semicolon
* Query does not start with SELECT
* Missing assignmentId

### 500 Internal Server Error

* Gemini API key missing
* Invalid assignment ID
* Database connection failure

---

# License

MIT License

---
