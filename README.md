# HRMS Lite

A lightweight Human Resource Management System for managing employee records and daily attendance. Built as a full-stack web application with a React frontend and FastAPI backend.

## Features

- **Employee Management**: Add, view, and delete employees (Employee ID, Full Name, Email, Department)
- **Attendance Management**: Mark attendance (Date, Present/Absent) and view records per employee or globally
- **Dashboard**: Summary of total employees and total present days; present days per employee table
- **Filter attendance** by employee and by date range
- **Server-side validation**: Required fields, email format, duplicate employee ID/email handling
- **UI states**: Loading, empty, and error states with clear feedback

## Tech Stack

| Layer    | Technology        |
|----------|-------------------|
| Frontend | React 18, Vite, React Router |
| Backend  | Python 3.10+, FastAPI       |
| Database | MongoDB (PyMongo)           |

## Project Structure

```
HRMS_lite/
├── backend/           # FastAPI app (MongoDB)
│   ├── main.py
│   ├── database.py
│   ├── schemas.py
│   ├── routers/
│   │   ├── employees.py
│   │   └── attendance.py
│   └── requirements.txt
├── frontend/          # React (Vite) app
│   ├── src/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── styles.css
│   │   ├── components/
│   │   └── pages/
│   ├── index.html
│   └── package.json
└── README.md
```

## Running Locally

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **MongoDB** (local installation or a connection string, e.g. MongoDB Atlas)

### Backend

1. Set the MongoDB connection string (optional if using local MongoDB on default port):

   ```bash
   # Windows PowerShell:
   $env:MONGODB_URI = "mongodb://localhost:27017"
   # Or use MongoDB Atlas: "mongodb+srv://user:pass@cluster.mongodb.net/"
   ```

2. Create a virtual environment (recommended):

   ```bash
   cd backend
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies and run:

   ```bash
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. API will be at **http://127.0.0.1:8000**  
   - Docs: http://127.0.0.1:8000/docs

   The app uses database name `hrms_lite` by default; override with `MONGODB_DB_NAME` if needed.

### Frontend

1. From project root:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. In development, the app runs at **http://localhost:5173** and is configured to proxy `/api` to `http://127.0.0.1:8000`, so no extra env is needed locally.

3. To point at another backend (e.g. deployed API), create `frontend/.env`:

   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

   Then rebuild: `npm run build`.

## Deployment

### Backend (e.g. Render)

- **Build**: (none for Python)
- **Start**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment**: Set `MONGODB_URI` to your MongoDB connection string (e.g. MongoDB Atlas). Optionally set `MONGODB_DB_NAME` (default: `hrms_lite`).

### Frontend (e.g. Vercel / Netlify)

1. Set **VITE_API_URL** to your live backend URL (e.g. `https://hrms-lite-api.onrender.com`).
2. Build command: `npm run build`
3. Publish directory: `dist`

### Checklist

- [ ] Deploy backend and note the base URL.
- [ ] Set `VITE_API_URL` for the frontend build and deploy.
- [ ] Ensure backend CORS allows your frontend origin (this app uses `allow_origins=["*"]` for assignment ease).

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/employees` | List all employees |
| POST   | `/api/employees` | Add employee (body: `employee_id`, `full_name`, `email`, `department`) |
| DELETE | `/api/employees/{employee_id}` | Delete employee by Employee ID |
| POST   | `/api/attendance` | Mark attendance (body: `employee_id`, `date`, `status` = Present/Absent) |
| GET    | `/api/attendance` | List attendance; optional query: `employee_id`, `from_date`, `to_date` |
| GET    | `/api/attendance/employee/{employee_id}` | Attendance for one employee; optional `from_date`, `to_date` |
| GET    | `/api/attendance/summary` | Present days per employee (bonus) |

## Assumptions & Limitations

- **Single admin**: No authentication; the app assumes one admin user.
- **Scope**: Leave, payroll, and advanced HR features are out of scope.
- **Database**: MongoDB; use a local instance or MongoDB Atlas. Set `MONGODB_URI` (default: `mongodb://localhost:27017`) and optionally `MONGODB_DB_NAME` (default: `hrms_lite`).
- **CORS**: Backend allows all origins for easy testing; restrict in production if needed.

## License

MIT.
