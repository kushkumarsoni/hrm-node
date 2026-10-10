# HRM Panel — Node.js (Laravel-style) + React

Roles: **Admin**, **Manager**, **Employee** · Stack: Express, Sequelize (MySQL), Joi, JWT, React (Vite).

## Backend structure (Laravel mapping)

```
backend/
├── server.js                      # artisan serve (boot + DB connect)
├── .sequelizerc                   # artisan config (migrations/seeders paths)
└── src/
    ├── app.js                     # bootstrap/app.php
    ├── config/                    # config/*.php  (app, auth, database, roles)
    ├── routes/                    # routes/*.php  (auth, employee, attendance, leave ...)
    ├── middleware/                # authenticate (JWT), authorize(role), validate, errorHandler
    ├── requests/                  # FormRequest  (Joi schemas)
    ├── controllers/               # thin controllers
    ├── services/                  # business logic (Service layer)
    ├── models/                    # Eloquent-like models + relations
    ├── helpers/                   # response, pagination, date, jwt, asyncHandler
    ├── exceptions/AppError.js     # custom exception (Handler.php style)
    └── database/{migrations,seeders}
```

Request flow: `route → middleware(auth, role, validate) → controller → service → model → response helper`

## Setup

```bash
# 1. Database
mysql -u root -e "CREATE DATABASE hrm_db CHARACTER SET utf8mb4;"

# 2. Backend
cd backend
cp .env.example .env        # set DB_* and JWT_SECRET
npm install
npm run migrate
npm run seed
npm run dev                 # http://localhost:5000/api/v1

# 3. Frontend
cd ../frontend
npm install
npm run dev                 # http://localhost:5173
```

Demo logins (password `Password@123`): `admin@hrm.test`, `manager@hrm.test`, `employee@hrm.test`

## API (prefix `/api/v1`, Bearer JWT)

| Method | Endpoint | Roles |
|---|---|---|
| POST | /auth/login | public |
| GET | /auth/me · POST /auth/change-password | all |
| GET | /dashboard | all (role-wise data) |
| GET/POST | /employees | admin |
| GET/PUT/DELETE | /employees/:id (DELETE = deactivate) | admin |
| GET | /employees/team | manager |
| GET/POST | /departments | admin, manager (GET) / admin (POST) |
| POST | /attendance/check-in · /attendance/check-out | all |
| GET | /attendance/today · /attendance/me?month=YYYY-MM | all |
| GET | /attendance/team?date=YYYY-MM-DD | admin (all), manager (own team) |
| POST | /leaves | all |
| GET | /leaves/me · DELETE /leaves/:id (pending only) | all |
| GET | /leaves/requests?status=pending | admin (all), manager (own team) |
| PATCH | /leaves/:id/review `{status, note}` | admin, manager (own team) |

## Business rules
- Manager sirf apni team (`manager_id`) ki attendance/leave dekh aur approve kar sakta hai; admin sabki.
- Koi apni khud ki leave review nahi kar sakta.
- Overlapping leave dates reject hoti hain.
- Check-out par 4 ghante se kam kaam = `half_day`, warna `present`.
- Employee delete = `inactive` (history safe rehti hai, login band).
- Passwords model hook me bcrypt se hash hote hain; response me kabhi nahi aate (defaultScope).
