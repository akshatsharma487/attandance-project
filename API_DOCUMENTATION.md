# API Documentation

Base URL: `http://localhost:5000/api` (Development)  
Production URL: `https://your-backend-url/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## Endpoints

### Authentication

#### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "employeeId": "EMP123456",
    "token": "jwt_token_here"
  }
}
```

#### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "employeeId": "EMP123456",
    "department": { ... },
    "jobRole": { ... },
    "manager": { ... },
    "token": "jwt_token_here"
  }
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "employeeId": "EMP123456",
    "department": { ... },
    "jobRole": { ... },
    "manager": { ... }
  }
}
```

---

### Attendance

#### Check In
```
POST /attendance/check-in
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "address": "Bangalore, India"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "attendanceId",
    "user": "userId",
    "date": "2024-01-15T00:00:00.000Z",
    "checkIn": {
      "time": "2024-01-15T09:00:00.000Z",
      "location": {
        "latitude": 12.9716,
        "longitude": 77.5946,
        "address": "Bangalore, India"
      }
    },
    "status": "present"
  }
}
```

#### Check Out
```
POST /attendance/check-out
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "address": "Bangalore, India"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "attendanceId",
    "user": "userId",
    "date": "2024-01-15T00:00:00.000Z",
    "checkIn": { ... },
    "checkOut": {
      "time": "2024-01-15T18:00:00.000Z",
      "location": { ... }
    },
    "totalHours": 9,
    "status": "present"
  }
}
```

#### Get Today's Attendance
```
GET /attendance/today
Authorization: Bearer <token>
```

#### Get My Attendance History
```
GET /attendance/my-history?startDate=2024-01-01&endDate=2024-01-31&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): Start date for filtering
- `endDate` (optional): End date for filtering
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 30,
    "pages": 3
  }
}
```

#### Get Team Attendance (Manager/Admin)
```
GET /attendance/team?date=2024-01-15
Authorization: Bearer <token>
```

#### Get All Attendance (Admin)
```
GET /attendance/all?date=2024-01-15&status=present&page=1&limit=20
Authorization: Bearer <token>
```

---

### Leaves

#### Apply for Leave
```
POST /leaves/apply
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "leaveType": "casual",
  "startDate": "2024-01-20",
  "endDate": "2024-01-22",
  "reason": "Personal work"
}
```

**Leave Types:**
- `casual`
- `sick`
- `half-day`
- `early-leave`
- `work-from-home`
- `field-visit`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "leaveId",
    "user": "userId",
    "leaveType": "casual",
    "startDate": "2024-01-20",
    "endDate": "2024-01-22",
    "reason": "Personal work",
    "status": "pending",
    "totalDays": 3
  }
}
```

#### Get My Leaves
```
GET /leaves/my-leaves?status=pending&page=1&limit=10
Authorization: Bearer <token>
```

#### Get Team Leaves (Manager/Admin)
```
GET /leaves/team?status=pending
Authorization: Bearer <token>
```

#### Get All Leaves (Admin)
```
GET /leaves/all?status=approved&page=1&limit=20
Authorization: Bearer <token>
```

#### Approve Leave (Manager/Admin)
```
PUT /leaves/:id/approve
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Leave approved successfully"
}
```

#### Reject Leave (Manager/Admin)
```
PUT /leaves/:id/reject
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rejectionReason": "Insufficient team coverage"
}
```

---

### Employees

#### Get All Employees (Admin/Manager)
```
GET /employees?department=deptId&role=employee&isActive=true&page=1&limit=20
Authorization: Bearer <token>
```

#### Get Employee (Admin/Manager)
```
GET /employees/:id
Authorization: Bearer <token>
```

#### Create Employee (Admin)
```
POST /employees
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "employee",
  "department": "departmentId",
  "jobRole": "roleId",
  "manager": "managerId",
  "phone": "9876543210"
}
```

#### Update Employee (Admin)
```
PUT /employees/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "department": "newDeptId",
  "isActive": true
}
```

#### Delete Employee (Admin)
```
DELETE /employees/:id
Authorization: Bearer <token>
```

#### Get My Team (Manager)
```
GET /employees/my-team
Authorization: Bearer <token>
```

---

### Departments

#### Get All Departments
```
GET /departments
Authorization: Bearer <token>
```

#### Get Department
```
GET /departments/:id
Authorization: Bearer <token>
```

#### Create Department (Admin)
```
POST /departments
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Engineering",
  "description": "Software development team"
}
```

#### Update Department (Admin)
```
PUT /departments/:id
Authorization: Bearer <token>
```

#### Delete Department (Admin)
```
DELETE /departments/:id
Authorization: Bearer <token>
```

---

### Roles

#### Get All Roles
```
GET /roles?department=deptId
Authorization: Bearer <token>
```

#### Get Role
```
GET /roles/:id
Authorization: Bearer <token>
```

#### Create Role (Admin)
```
POST /roles
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Software Engineer",
  "description": "Full-stack development",
  "department": "departmentId"
}
```

#### Update Role (Admin)
```
PUT /roles/:id
Authorization: Bearer <token>
```

#### Delete Role (Admin)
```
DELETE /roles/:id
Authorization: Bearer <token>
```

---

### Dashboard

#### Get Admin Dashboard
```
GET /dashboard/admin
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalEmployees": 100,
      "presentToday": 85,
      "absentToday": 10,
      "onLeaveToday": 5,
      "pendingLeaves": 8
    },
    "recentAttendance": [ ... ],
    "recentLeaves": [ ... ]
  }
}
```

#### Get Manager Dashboard
```
GET /dashboard/manager
Authorization: Bearer <token>
```

#### Get Employee Dashboard
```
GET /dashboard/employee
Authorization: Bearer <token>
```

---

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API calls are limited to prevent abuse. Current limits:
- 100 requests per 15 minutes per IP address

## Postman Collection

Import this into Postman for easy testing:

1. Create a new collection named "Workforce Management API"
2. Add environment variables:
   - `base_url`: `http://localhost:5000/api`
   - `token`: (will be set after login)
3. Import the endpoints above
4. Use `{{base_url}}` and `{{token}}` in your requests

## Testing with curl

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Check In Example
```bash
curl -X POST http://localhost:5000/api/attendance/check-in \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"latitude":12.9716,"longitude":77.5946,"address":"Bangalore"}'
```
