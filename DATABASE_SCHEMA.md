# Database Schema Documentation

This document describes the MongoDB database schema for the Workforce Management System.

## Collections

### 1. Users Collection

Stores all user information including employees, managers, and admins.

**Collection Name:** `users`

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String,           // Required, trimmed
  email: String,          // Required, unique, lowercase, trimmed
  password: String,       // Required, hashed with bcrypt, min 6 chars
  role: String,           // Enum: ['admin', 'manager', 'employee'], default: 'employee'
  department: ObjectId,   // Reference to Department
  jobRole: ObjectId,      // Reference to JobRole
  manager: ObjectId,      // Reference to User (for employees)
  employeeId: String,     // Unique, auto-generated (e.g., EMP123456)
  phone: String,
  joiningDate: Date,      // Default: current date
  isActive: Boolean,      // Default: true
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

**Indexes:**
- `email` (unique)
- `employeeId` (unique)
- `role`
- `manager`
- `department`

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$xyz...",
  "role": "employee",
  "department": "507f1f77bcf86cd799439012",
  "jobRole": "507f1f77bcf86cd799439013",
  "manager": "507f1f77bcf86cd799439014",
  "employeeId": "EMP123456",
  "phone": "1234567890",
  "joiningDate": "2024-01-15T00:00:00.000Z",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Departments Collection

Stores organizational departments.

**Collection Name:** `departments`

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String,         // Required, unique, trimmed
  description: String,  // Trimmed
  isActive: Boolean,    // Default: true
  createdAt: Date,      // Auto-generated
  updatedAt: Date       // Auto-generated
}
```

**Indexes:**
- `name` (unique)

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Engineering",
  "description": "Software development and technical team",
  "isActive": true,
  "createdAt": "2024-01-10T09:00:00.000Z",
  "updatedAt": "2024-01-10T09:00:00.000Z"
}
```

---

### 3. JobRoles Collection

Stores job role definitions.

**Collection Name:** `jobroles`

**Schema:**
```javascript
{
  _id: ObjectId,
  title: String,        // Required, unique, trimmed
  description: String,  // Trimmed
  department: ObjectId, // Reference to Department
  isActive: Boolean,    // Default: true
  createdAt: Date,      // Auto-generated
  updatedAt: Date       // Auto-generated
}
```

**Indexes:**
- `title` (unique)
- `department`

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "title": "Senior Software Engineer",
  "description": "Full-stack development with 5+ years experience",
  "department": "507f1f77bcf86cd799439012",
  "isActive": true,
  "createdAt": "2024-01-10T09:15:00.000Z",
  "updatedAt": "2024-01-10T09:15:00.000Z"
}
```

---

### 4. Attendances Collection

Stores daily attendance records.

**Collection Name:** `attendances`

**Schema:**
```javascript
{
  _id: ObjectId,
  user: ObjectId,           // Required, reference to User
  date: Date,               // Required, start of day timestamp
  checkIn: {
    time: Date,
    location: {
      latitude: Number,
      longitude: Number,
      address: String
    }
  },
  checkOut: {
    time: Date,
    location: {
      latitude: Number,
      longitude: Number,
      address: String
    }
  },
  totalHours: Number,       // Calculated in hours, default: 0
  status: String,           // Enum: ['present', 'absent', 'half-day', 'on-leave']
  notes: String,
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

**Indexes:**
- `{user: 1, date: 1}` (unique compound index)
- `date`
- `status`

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "user": "507f1f77bcf86cd799439011",
  "date": "2024-01-15T00:00:00.000Z",
  "checkIn": {
    "time": "2024-01-15T09:05:23.000Z",
    "location": {
      "latitude": 12.9716,
      "longitude": 77.5946,
      "address": "Bangalore, Karnataka, India"
    }
  },
  "checkOut": {
    "time": "2024-01-15T18:10:45.000Z",
    "location": {
      "latitude": 12.9716,
      "longitude": 77.5946,
      "address": "Bangalore, Karnataka, India"
    }
  },
  "totalHours": 9.09,
  "status": "present",
  "createdAt": "2024-01-15T09:05:23.000Z",
  "updatedAt": "2024-01-15T18:10:45.000Z"
}
```

---

### 5. Leaves Collection

Stores leave applications and their status.

**Collection Name:** `leaves`

**Schema:**
```javascript
{
  _id: ObjectId,
  user: ObjectId,           // Required, reference to User
  leaveType: String,        // Required, enum: ['casual', 'sick', 'half-day', 'early-leave', 'work-from-home', 'field-visit']
  startDate: Date,          // Required
  endDate: Date,            // Required
  reason: String,           // Required, trimmed
  status: String,           // Enum: ['pending', 'approved', 'rejected'], default: 'pending'
  approvedBy: ObjectId,     // Reference to User (manager/admin)
  approvalDate: Date,
  rejectionReason: String,
  totalDays: Number,        // Required, calculated
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

**Indexes:**
- `user`
- `status`
- `startDate`
- `approvedBy`

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "user": "507f1f77bcf86cd799439011",
  "leaveType": "casual",
  "startDate": "2024-01-20T00:00:00.000Z",
  "endDate": "2024-01-22T00:00:00.000Z",
  "reason": "Personal work - family function",
  "status": "approved",
  "approvedBy": "507f1f77bcf86cd799439014",
  "approvalDate": "2024-01-16T11:30:00.000Z",
  "rejectionReason": null,
  "totalDays": 3,
  "createdAt": "2024-01-15T14:20:00.000Z",
  "updatedAt": "2024-01-16T11:30:00.000Z"
}
```

---

## Relationships

### User Relationships
- **User → Department**: One-to-Many (Many users belong to one department)
- **User → JobRole**: One-to-Many (Many users have one job role)
- **User → Manager**: Self-referencing (User has one manager who is also a User)

### Attendance Relationships
- **Attendance → User**: Many-to-One (Many attendance records belong to one user)

### Leave Relationships
- **Leave → User (applicant)**: Many-to-One (Many leaves belong to one user)
- **Leave → User (approver)**: Many-to-One (Many leaves approved by one user)

### JobRole Relationships
- **JobRole → Department**: Many-to-One (Many roles belong to one department)

---

## Data Validation Rules

### User
- Email must be valid and unique
- Password minimum 6 characters
- Role must be one of: admin, manager, employee
- Employee ID auto-generated and unique

### Attendance
- One attendance record per user per day (enforced by unique compound index)
- Check-out time must be after check-in time
- Total hours calculated automatically

### Leave
- End date must be >= start date
- Total days calculated automatically
- Status can only transition: pending → approved/rejected

---

## Queries and Operations

### Common Queries

#### Get Today's Attendance for All Employees
```javascript
db.attendances.find({
  date: { $gte: startOfToday, $lte: endOfToday }
}).populate('user')
```

#### Get Pending Leaves for a Manager
```javascript
db.leaves.find({
  user: { $in: teamMemberIds },
  status: 'pending'
}).populate('user')
```

#### Get Monthly Attendance for an Employee
```javascript
db.attendances.find({
  user: userId,
  date: {
    $gte: startOfMonth,
    $lte: endOfMonth
  },
  status: 'present'
})
```

#### Get Team Members for a Manager
```javascript
db.users.find({
  manager: managerId,
  isActive: true
})
```

---

## Performance Considerations

### Indexes
All critical queries are covered by indexes:
- User lookups by email and employeeId
- Attendance lookups by user and date
- Leave lookups by user and status
- Team lookups by manager

### Data Archival
For production systems:
- Consider archiving attendance records older than 2 years
- Archive approved/rejected leaves older than 1 year
- Keep active employee records in main collection

### Aggregation Pipelines
For dashboard statistics:
```javascript
// Example: Get attendance summary
db.attendances.aggregate([
  { $match: { date: todayDate } },
  { $group: {
      _id: '$status',
      count: { $sum: 1 }
    }
  }
])
```

---

## Backup Strategy

### Daily Backups
```bash
mongodump --uri="mongodb://..." --out=/backup/daily/$(date +%Y%m%d)
```

### Point-in-Time Recovery
MongoDB Atlas provides automated backups with point-in-time recovery.

---

## Migration Scripts

### Initial Setup
```javascript
// Create admin user
db.users.insertOne({
  name: "System Admin",
  email: "admin@example.com",
  password: hashedPassword,
  role: "admin",
  employeeId: "EMP000001",
  joiningDate: new Date(),
  isActive: true
})

// Create default department
db.departments.insertOne({
  name: "General",
  description: "Default department",
  isActive: true
})
```

### Seed Data
See `backend/seeds/` directory for sample data scripts.

---

## Data Integrity

### Constraints
- User email must be unique
- User employeeId must be unique
- Department name must be unique
- JobRole title must be unique
- One attendance record per user per day

### Referential Integrity
MongoDB doesn't enforce foreign key constraints. Application-level validation ensures:
- Department exists when assigning to user
- JobRole exists when assigning to user
- Manager exists and is active when assigning to employee
- User exists when creating attendance/leave records

---

## Security

### Password Storage
- Passwords hashed using bcrypt with salt rounds = 10
- Never store plain text passwords
- Password field excluded from queries by default

### Data Access
- Role-based access control at application level
- Employees can only see their own data
- Managers can see their team's data
- Admins can see all data

### Sensitive Fields
- Password field: `select: false` in schema
- JWT tokens stored client-side only, never in database
