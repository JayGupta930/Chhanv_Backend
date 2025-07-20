# Medical Camp Management System - Complete API Documentation

## Overview

This is a comprehensive backend system for managing medical camps, built with Node.js, Express.js, and MongoDB using Mongoose ODM.

## Base URL

```
http://localhost:4000/api/v1
```

## Authentication

The system uses JWT-based authentication with httpOnly cookies for secure token storage.

---

## API Endpoints Summary

### User Endpoints (`/api/v1/user`)

| Method | Endpoint                                          | Auth Required | Description                         |
| ------ | ------------------------------------------------- | ------------- | ----------------------------------- |
| POST   | `/register`                                       | No            | Register new user                   |
| POST   | `/login`                                          | No            | User login                          |
| POST   | `/logout`                                         | Yes           | User logout                         |
| GET    | `/profile`                                        | Yes           | Get user profile                    |
| PUT    | `/profile/update`                                 | Yes           | Update user profile                 |
| PUT    | `/change-password`                                | Yes           | Change user password                |
| POST   | `/relatives/add`                                  | Yes           | Add relative (existing user or new) |
| GET    | `/relatives`                                      | Yes           | Get all relatives                   |
| PUT    | `/relatives/:relativeId`                          | Yes           | Update relative details             |
| DELETE | `/relatives/:relativeId`                          | Yes           | Remove relative                     |
| POST   | `/relatives/:relativeId/health-reports`           | Yes           | Add health report to relative       |
| GET    | `/relatives/:relativeId/health-reports`           | Yes           | Get relative health reports         |
| DELETE | `/relatives/:relativeId/health-reports/:reportId` | Yes           | Remove health report from relative  |

### Admin Endpoints (`/api/v1/admin`)

| Method | Endpoint                 | Auth Required | Description                |
| ------ | ------------------------ | ------------- | -------------------------- |
| POST   | `/camps/create`          | Yes           | Create new camp            |
| GET    | `/camps/all`             | Yes           | Get all camps              |
| GET    | `/camps/:id`             | Yes           | Get camp by ID             |
| PUT    | `/camps/:id`             | Yes           | Update camp                |
| DELETE | `/camps/:id`             | Yes           | Delete camp                |
| GET    | `/camps/upcoming`        | Yes           | Get upcoming camps         |
| GET    | `/camps/past/count`      | Yes           | Get past camps count       |
| GET    | `/camps/upcoming/count`  | Yes           | Get upcoming camps count   |
| GET    | `/camps/thismonth/count` | Yes           | Get this month camps count |

### Doctor Endpoints (`/api/v1/doctor`)

| Method | Endpoint                                                    | Auth Required | Description                    |
| ------ | ----------------------------------------------------------- | ------------- | ------------------------------ |
| POST   | `/health-reports/create`                                    | Yes           | Create new health report       |
| GET    | `/health-reports?doctorName=name`                           | Yes           | Get doctor's health reports    |
| GET    | `/health-reports/all`                                       | Yes           | Get all health reports (admin) |
| GET    | `/health-reports/:reportId`                                 | Yes           | Get health report by ID        |
| PUT    | `/health-reports/:reportId`                                 | Yes           | Update health report           |
| DELETE | `/health-reports/:reportId`                                 | Yes           | Delete health report           |
| GET    | `/patients/:patientId/health-reports`                       | Yes           | Get patient health reports     |
| GET    | `/patients/:patientId/relatives/:relativeId/health-reports` | Yes           | Get relative health reports    |

---

## Data Models

### User Schema

```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phoneNumber: String (required),
  dateOfBirth: Date (required),
  gender: String (required, enum: ["male", "female", "other"]),
  bloodGroup: String (enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  relatives: [
    {
      userId: ObjectId (ref: User), // Optional: if relative is existing user
      firstName: String, // Required for new relatives
      lastName: String, // Required for new relatives
      phoneNumber: String, // Required for new relatives
      dateOfBirth: Date, // Required for new relatives
      gender: String (enum: ["male", "female", "other"]), // Required for new relatives
      bloodGroup: String (enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
      relationship: String (required, enum: ["parent", "child", "sibling", "spouse", "grandparent", "grandchild", "uncle", "aunt", "cousin", "other"]),
      isExistingUser: Boolean (default: false),
      createdAt: Date (default: Date.now)
    }
  ],
  healthReports: [ObjectId] (ref: HealthReport),
  createdAt: Date (default: Date.now)
}
```

### Camp Schema

```javascript
{
  location: String (required),
  date: Date (required),
  startTime: String (required),
  endTime: String (required),
  address: String (required),
  conductedBy: [ObjectId] (required, ref: Doctor),
  limit: Number (required, min: 1),
  createdAt: Date (default: Date.now),
  createdBy: String (required)
}
```

### Doctor Schema

```javascript
{
  name: String (required),
  specialization: String (required),
  phoneNo: String (required),
  experience: Number (required, min: 0),
  email: String (required),
  qualification: String (required),
  location: String (required),
  createdAt: Date (default: Date.now)
}
```

### Health Report Schema

```javascript
{
  userId: ObjectId (required, ref: User),
  campId: ObjectId (required, ref: Camp),
  doctorId: ObjectId (required, ref: Doctor),
  symptoms: String (required),
  diagnosis: String (required),
  treatment: String (required),
  medicines: [String],
  followUpRequired: Boolean (default: false),
  followUpDate: Date,
  vitals: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number
  },
  createdAt: Date (default: Date.now)
}
```

---

## Environment Variables

Create a `secret.env` file in the root directory:

```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/medical_camp_db
JWT_SECRET_KEY=your_super_secret_jwt_key_here
JWT_EXPIRES=7d
COOKIE_EXPIRE=7
FRONTEND_URL=http://localhost:3000
```

---

## Installation & Setup

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Set Environment Variables:**
   Create `secret.env` file with required variables

3. **Start MongoDB:**
   Ensure MongoDB is running on your system

4. **Run the Server:**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

---

## Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Authentication:** Secure token-based auth
- **HttpOnly Cookies:** Secure token storage
- **CORS Configuration:** Configured for specific frontend URL
- **Input Validation:** Comprehensive request validation
- **Error Handling:** Centralized error handling middleware

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* response data */
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Testing with Postman/curl

### Register User

```bash
curl -X POST http://localhost:4000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phoneNumber": "1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
  }'
```

### Login User

```bash
curl -X POST http://localhost:4000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Camp (requires authentication)

```bash
curl -X POST http://localhost:4000/api/v1/admin/camps/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "location": "Community Center",
    "date": "2024-02-15",
    "startTime": "09:00",
    "endTime": "17:00",
    "address": "123 Main St, City",
    "conductedBy": ["doctor_id_here"],
    "limit": 100,
    "createdBy": "Admin User"
  }'
```

### Add New Relative (create from scratch)

```bash
curl -X POST http://localhost:4000/api/v1/user/relatives/add \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "phoneNumber": "9876543210",
    "dateOfBirth": "1985-03-20",
    "gender": "female",
    "bloodGroup": "B+",
    "relationship": "sibling"
  }'
```

### Add Existing User as Relative

```bash
curl -X POST http://localhost:4000/api/v1/user/relatives/add \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "userId": "existing_user_id_here",
    "relationship": "spouse"
  }'
```

### Get All Relatives

```bash
curl -X GET http://localhost:4000/api/v1/user/relatives \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Update Relative Details

```bash
curl -X PUT http://localhost:4000/api/v1/user/relatives/relative_id_here \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "firstName": "Janet",
    "bloodGroup": "AB+",
    "relationship": "cousin"
  }'
```

### Remove Relative

```bash
curl -X DELETE http://localhost:4000/api/v1/user/relatives/relative_id_here \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Add Health Report to Relative

```bash
curl -X POST http://localhost:4000/api/v1/user/relatives/relative_id_here/health-reports \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "healthReportId": "health_report_id_here"
  }'
```

### Get Relative Health Reports

```bash
curl -X GET http://localhost:4000/api/v1/user/relatives/relative_id_here/health-reports \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Remove Health Report from Relative

```bash
curl -X DELETE http://localhost:4000/api/v1/user/relatives/relative_id_here/health-reports/report_id_here \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Create Health Report

```bash
curl -X POST http://localhost:4000/api/v1/doctor/health-reports/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "patientId": "patient_user_id_here",
    "reportType": "blood_test",
    "doctorName": "Dr. John Smith",
    "hospitalName": "City General Hospital",
    "findings": "Blood pressure normal, glucose levels slightly elevated",
    "isNormal": false,
    "severity": "medium"
  }'
```

### Create Health Report for Relative

```bash
curl -X POST http://localhost:4000/api/v1/doctor/health-reports/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "patientId": "patient_user_id_here",
    "relativeId": "relative_id_here",
    "reportType": "x_ray",
    "doctorName": "Dr. Jane Smith",
    "findings": "No abnormalities detected",
    "isNormal": true,
    "severity": "low"
  }'
```

### Get Doctor's Health Reports

```bash
curl -X GET "http://localhost:4000/api/v1/doctor/health-reports?doctorName=Dr. John Smith" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Get All Health Reports with Filtering

```bash
curl -X GET "http://localhost:4000/api/v1/doctor/health-reports/all?page=1&limit=5&reportType=blood_test&severity=high" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Get Patient Health Reports

```bash
curl -X GET http://localhost:4000/api/v1/doctor/patients/patient_id_here/health-reports \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Update Health Report

```bash
curl -X PUT http://localhost:4000/api/v1/doctor/health-reports/report_id_here \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "findings": "Updated findings with new observations",
    "severity": "high"
  }'
```

---

For detailed endpoint documentation, refer to:

- `adminController.md` - Admin/Camp management endpoints
- `userController.md` - User management endpoints
