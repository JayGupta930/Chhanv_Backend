# User Controller API Documentation

This document describes all user-related API endpoints for the Medical Camp Management System.

## Base URL

All user endpoints are prefixed with `/api/v1/user`

## Authentication

- Protected endpoints require a valid JWT token sent as a cookie
- The token is automatically set upon successful login/registration
- Use the logout endpoint to clear the authentication token

---

## 1. Register User

**Endpoint:** `POST /api/v1/user/register`

**Description:** Register a new user in the system.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phoneNumber": "1234567890",
  "dateOfBirth": "1990-01-15",
  "gender": "male"
}
```

**Required Fields:**

- `firstName` (string): User's first name
- `lastName` (string): User's last name
- `email` (string): Valid email address (must be unique)
- `password` (string): Password (minimum 6 characters)
- `phoneNumber` (string): User's phone number
- `dateOfBirth` (string): Date in ISO format (YYYY-MM-DD)
- `gender` (string): "male", "female", or "other"

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "userId",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "gender": "male",
    "createdAt": "2024-01-20T10:30:00.000Z"
  },
  "token": "jwt_token_here"
}
```

**Error Responses:**

- `400`: Missing required fields or user already exists
- `500`: Server error

---

## 2. Login User

**Endpoint:** `POST /api/v1/user/login`

**Description:** Authenticate user and get access token.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Required Fields:**

- `email` (string): User's registered email
- `password` (string): User's password

**Success Response (200):**

```json
{
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "_id": "userId",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "gender": "male"
  },
  "token": "jwt_token_here"
}
```

**Error Responses:**

- `400`: Missing email or password
- `401`: Invalid email or password
- `500`: Server error

---

## 3. Logout User

**Endpoint:** `POST /api/v1/user/logout`

**Description:** Logout user by clearing authentication token.

**Authentication:** Required (JWT token)

**Request Body:** None

**Success Response (200):**

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

**Error Responses:**

- `401`: Not authenticated
- `500`: Server error

---

## 4. Get User Profile

**Endpoint:** `GET /api/v1/user/profile`

**Description:** Get current user's profile information.

**Authentication:** Required (JWT token)

**Request Body:** None

**Success Response (200):**

```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "user": {
    "_id": "userId",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "gender": "male",
    "bloodGroup": "O+",
    "relatives": [],
    "healthReports": [],
    "createdAt": "2024-01-20T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `401`: Not authenticated
- `404`: User not found
- `500`: Server error

---

## 5. Update User Profile

**Endpoint:** `PUT /api/v1/user/profile/update`

**Description:** Update user's profile information.

**Authentication:** Required (JWT token)

**Request Body (all fields optional):**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phoneNumber": "9876543210",
  "dateOfBirth": "1992-05-20",
  "gender": "female",
  "bloodGroup": "A+"
}
```

**Optional Fields:**

- `firstName` (string): Updated first name
- `lastName` (string): Updated last name
- `email` (string): Updated email (must be unique)
- `phoneNumber` (string): Updated phone number
- `dateOfBirth` (string): Updated date of birth
- `gender` (string): Updated gender
- `bloodGroup` (string): Updated blood group

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "userId",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "9876543210",
    "dateOfBirth": "1992-05-20T00:00:00.000Z",
    "gender": "female",
    "bloodGroup": "A+",
    "createdAt": "2024-01-20T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `400`: Email already exists
- `401`: Not authenticated
- `404`: User not found
- `500`: Server error

---

## 6. Change Password

**Endpoint:** `PUT /api/v1/user/change-password`

**Description:** Change user's password.

**Authentication:** Required (JWT token)

**Request Body:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Required Fields:**

- `currentPassword` (string): User's current password
- `newPassword` (string): New password (minimum 6 characters)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**

- `400`: Missing current or new password, or new password too short
- `401`: Not authenticated or current password incorrect
- `404`: User not found
- `500`: Server error

---

## 7. Add Relative

**Endpoint:** `POST /api/v1/user/relatives/add`

**Description:** Add a relative to the user's profile. Can add either an existing user as relative or create a new relative with details.

**Authentication:** Required (JWT token)

**Request Body (Option 1 - Add existing user as relative):**

```json
{
  "userId": "existing_user_id_here",
  "relationship": "sibling"
}
```

**Request Body (Option 2 - Create new relative from scratch):**

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "phoneNumber": "9876543210",
  "dateOfBirth": "1985-03-20",
  "gender": "female",
  "bloodGroup": "B+",
  "relationship": "sibling"
}
```

**Required Fields for new relative:**

- `firstName` (string): Relative's first name
- `lastName` (string): Relative's last name
- `phoneNumber` (string): Relative's phone number
- `dateOfBirth` (string): Date in ISO format
- `gender` (string): "male", "female", or "other"
- `relationship` (string): Relationship type

**Optional Fields:**

- `bloodGroup` (string): Relative's blood group
- `userId` (string): ID of existing user to add as relative

**Relationship Types:**

- "parent", "child", "sibling", "spouse", "grandparent", "grandchild", "uncle", "aunt", "cousin", "other"

**Success Response (200):**

```json
{
  "success": true,
  "message": "Relative added successfully",
  "relative": {
    "_id": "relative_id",
    "firstName": "Jane",
    "lastName": "Doe",
    "phoneNumber": "9876543210",
    "dateOfBirth": "1985-03-20T00:00:00.000Z",
    "gender": "female",
    "bloodGroup": "B+",
    "relationship": "sibling",
    "isExistingUser": false,
    "createdAt": "2024-01-20T10:30:00.000Z"
  },
  "totalRelatives": 1
}
```

**Error Responses:**

- `400`: Missing required fields, relative already exists, or validation errors
- `401`: Not authenticated
- `404`: User not found (when adding existing user)
- `500`: Server error

---

## 8. Get Relatives

**Endpoint:** `GET /api/v1/user/relatives`

**Description:** Get all relatives of the current user.

**Authentication:** Required (JWT token)

**Request Body:** None

**Success Response (200):**

```json
{
  "success": true,
  "message": "Relatives fetched successfully",
  "relatives": [
    {
      "_id": "relative_id",
      "firstName": "Jane",
      "lastName": "Doe",
      "phoneNumber": "9876543210",
      "dateOfBirth": "1985-03-20T00:00:00.000Z",
      "gender": "female",
      "bloodGroup": "B+",
      "relationship": "sibling",
      "isExistingUser": false,
      "createdAt": "2024-01-20T10:30:00.000Z"
    }
  ],
  "totalRelatives": 1
}
```

**Error Responses:**

- `401`: Not authenticated
- `404`: User not found
- `500`: Server error

---

## 9. Update Relative

**Endpoint:** `PUT /api/v1/user/relatives/:relativeId`

**Description:** Update details of a relative (only for relatives created from scratch, not existing users).

**Authentication:** Required (JWT token)

**URL Parameters:**

- `relativeId` (string): ID of the relative to update

**Request Body (all fields optional):**

```json
{
  "firstName": "Janet",
  "lastName": "Smith",
  "phoneNumber": "9876543211",
  "dateOfBirth": "1985-03-21",
  "gender": "female",
  "bloodGroup": "AB+",
  "relationship": "cousin"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Relative updated successfully",
  "relative": {
    "_id": "relative_id",
    "firstName": "Janet",
    "lastName": "Smith",
    "phoneNumber": "9876543211",
    "dateOfBirth": "1985-03-21T00:00:00.000Z",
    "gender": "female",
    "bloodGroup": "AB+",
    "relationship": "cousin",
    "isExistingUser": false,
    "createdAt": "2024-01-20T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `400`: Cannot update existing user relative
- `401`: Not authenticated
- `404`: User or relative not found
- `500`: Server error

---

## 10. Remove Relative

**Endpoint:** `DELETE /api/v1/user/relatives/:relativeId`

**Description:** Remove a relative from the user's profile.

**Authentication:** Required (JWT token)

**URL Parameters:**

- `relativeId` (string): ID of the relative to remove

**Request Body:** None

**Success Response (200):**

```json
{
  "success": true,
  "message": "Relative removed successfully",
  "totalRelatives": 0
}
```

**Error Responses:**

- `401`: Not authenticated
- `404`: User or relative not found
- `500`: Server error

---

## 11. Add Health Report to Relative

**Endpoint:** `POST /api/v1/user/relatives/:relativeId/health-reports`

**Description:** Add a health report to a specific relative.

**Authentication:** Required (JWT token)

**URL Parameters:**

- `relativeId` (string): ID of the relative

**Request Body:**

```json
{
  "healthReportId": "health_report_id_here"
}
```

**Required Fields:**

- `healthReportId` (string): ID of the health report to add

**Success Response (200):**

```json
{
  "success": true,
  "message": "Health report added to relative successfully",
  "relative": {
    "_id": "relative_id",
    "firstName": "Jane",
    "lastName": "Doe",
    "relationship": "sibling",
    "healthReports": ["health_report_id"]
  }
}
```

**Error Responses:**

- `400`: Missing health report ID or report already exists
- `401`: Not authenticated
- `404`: User or relative not found
- `500`: Server error

---

## 12. Get Relative Health Reports

**Endpoint:** `GET /api/v1/user/relatives/:relativeId/health-reports`

**Description:** Get all health reports for a specific relative.

**Authentication:** Required (JWT token)

**URL Parameters:**

- `relativeId` (string): ID of the relative

**Request Body:** None

**Success Response (200):**

```json
{
  "success": true,
  "message": "Relative health reports fetched successfully",
  "relative": {
    "_id": "relative_id",
    "firstName": "Jane",
    "lastName": "Doe",
    "relationship": "sibling",
    "healthReports": [
      {
        "_id": "report_id",
        "symptoms": "Fever, headache",
        "diagnosis": "Viral infection",
        "treatment": "Rest and medication",
        "createdAt": "2024-01-20T10:30:00.000Z"
      }
    ]
  },
  "totalReports": 1
}
```

**Error Responses:**

- `401`: Not authenticated
- `404`: User or relative not found
- `500`: Server error

---

## 13. Remove Health Report from Relative

**Endpoint:** `DELETE /api/v1/user/relatives/:relativeId/health-reports/:reportId`

**Description:** Remove a health report from a specific relative.

**Authentication:** Required (JWT token)

**URL Parameters:**

- `relativeId` (string): ID of the relative
- `reportId` (string): ID of the health report to remove

**Request Body:** None

**Success Response (200):**

```json
{
  "success": true,
  "message": "Health report removed from relative successfully",
  "totalReports": 0
}
```

**Error Responses:**

- `401`: Not authenticated
- `404`: User, relative, or health report not found
- `500`: Server error

---
