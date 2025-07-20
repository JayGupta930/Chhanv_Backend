# Doctor Controller API Documentation

This document describes all doctor-related API endpoints for the Medical Camp Management System, focusing on health report management.

## Base URL

All doctor endpoints are prefixed with `/api/v1/doctor`

## Authentication

- All endpoints require a valid JWT token sent as a cookie
- Doctors need to be authenticated to create and manage health reports

---

## 1. Create Health Report

**Endpoint:** `POST /api/v1/doctor/health-reports/create`

**Description:** Create a new health report for a patient or their relative.

**Authentication:** Required (JWT token)

**Request Body:**

```json
{
  "patientId": "patient_user_id_here",
  "relativeId": "relative_id_here",
  "reportType": "blood_test",
  "reportDate": "2024-01-20",
  "doctorName": "Dr. John Smith",
  "hospitalName": "City General Hospital",
  "findings": "Blood pressure normal, glucose levels slightly elevated",
  "isNormal": false,
  "severity": "medium"
}
```

**Required Fields:**

- `patientId` (string): ID of the patient (User)
- `reportType` (string): Type of report - "blood_test", "x_ray", "mri", "ct_scan", "general_checkup", "other"
- `doctorName` (string): Name of the doctor creating the report
- `findings` (string): Medical findings and observations

**Optional Fields:**

- `relativeId` (string): ID of relative (if report is for a relative)
- `reportDate` (string): Date of the report (defaults to current date)
- `hospitalName` (string): Name of the hospital/clinic
- `isNormal` (boolean): Whether results are normal (defaults to true)
- `severity` (string): Severity level - "low", "medium", "high", "critical" (defaults to "low")

**Success Response (201):**

```json
{
  "success": true,
  "message": "Health report created successfully",
  "healthReport": {
    "_id": "report_id",
    "reportId": "HR-1642681800000-abc123def",
    "patientId": "patient_id",
    "reportType": "blood_test",
    "reportDate": "2024-01-20T00:00:00.000Z",
    "doctorName": "Dr. John Smith",
    "hospitalName": "City General Hospital",
    "findings": "Blood pressure normal, glucose levels slightly elevated",
    "isNormal": false,
    "severity": "medium",
    "createdAt": "2024-01-20T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `400`: Missing required fields
- `401`: Not authenticated
- `404`: Patient or relative not found
- `500`: Server error

---

## 2. Get Doctor's Health Reports

**Endpoint:** `GET /api/v1/doctor/health-reports?doctorName=Dr. John Smith`

**Description:** Get all health reports created by a specific doctor.

**Authentication:** Required (JWT token)

**Query Parameters:**

- `doctorName` (string, required): Name of the doctor

**Success Response (200):**

```json
{
  "success": true,
  "message": "Health reports fetched successfully",
  "healthReports": [
    {
      "_id": "report_id",
      "reportId": "HR-1642681800000-abc123def",
      "patientId": {
        "_id": "patient_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phoneNumber": "1234567890"
      },
      "reportType": "blood_test",
      "doctorName": "Dr. John Smith",
      "findings": "Blood pressure normal",
      "createdAt": "2024-01-20T10:30:00.000Z"
    }
  ],
  "totalReports": 1
}
```

**Error Responses:**

- `400`: Missing doctor name
- `401`: Not authenticated
- `500`: Server error

---

## 3. Get Health Report by ID

**Endpoint:** `GET /api/v1/doctor/health-reports/:reportId`

**Description:** Get a specific health report by its ID.

**Authentication:** Required (JWT token)

**URL Parameters:**

- `reportId` (string): ID of the health report

**Success Response (200):**

```json
{
  "success": true,
  "message": "Health report fetched successfully",
  "healthReport": {
    "_id": "report_id",
    "reportId": "HR-1642681800000-abc123def",
    "patientId": {
      "_id": "patient_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phoneNumber": "1234567890",
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "gender": "male",
      "bloodGroup": "O+"
    },
    "reportType": "blood_test",
    "reportDate": "2024-01-20T00:00:00.000Z",
    "doctorName": "Dr. John Smith",
    "hospitalName": "City General Hospital",
    "findings": "Blood pressure normal, glucose levels slightly elevated",
    "isNormal": false,
    "severity": "medium",
    "createdAt": "2024-01-20T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `401`: Not authenticated
- `404`: Health report not found
- `500`: Server error

---

## 4. Update Health Report

**Endpoint:** `PUT /api/v1/doctor/health-reports/:reportId`

**Description:** Update an existing health report.

**Authentication:** Required (JWT token)

**URL Parameters:**

- `reportId` (string): ID of the health report

**Request Body (all fields optional):**

```json
{
  "reportType": "general_checkup",
  "reportDate": "2024-01-21",
  "doctorName": "Dr. Jane Smith",
  "hospitalName": "Updated Hospital Name",
  "findings": "Updated findings and observations",
  "isNormal": true,
  "severity": "low"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Health report updated successfully",
  "healthReport": {
    "_id": "report_id",
    "reportId": "HR-1642681800000-abc123def",
    "patientId": "patient_id",
    "reportType": "general_checkup",
    "reportDate": "2024-01-21T00:00:00.000Z",
    "doctorName": "Dr. Jane Smith",
    "hospitalName": "Updated Hospital Name",
    "findings": "Updated findings and observations",
    "isNormal": true,
    "severity": "low",
    "createdAt": "2024-01-20T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `401`: Not authenticated
- `404`: Health report not found
- `500`: Server error

---

## 5. Delete Health Report

**Endpoint:** `DELETE /api/v1/doctor/health-reports/:reportId`

**Description:** Delete a health report and remove it from patient's records.

**Authentication:** Required (JWT token)

**URL Parameters:**

- `reportId` (string): ID of the health report

**Success Response (200):**

```json
{
  "success": true,
  "message": "Health report deleted successfully"
}
```

**Error Responses:**

- `401`: Not authenticated
- `404`: Health report not found
- `500`: Server error

---

## 6. Get Patient Health Reports

**Endpoint:** `GET /api/v1/doctor/patients/:patientId/health-reports`

**Description:** Get all health reports for a specific patient.

**Authentication:** Required (JWT token)

**URL Parameters:**

- `patientId` (string): ID of the patient

**Success Response (200):**

```json
{
  "success": true,
  "message": "Patient health reports fetched successfully",
  "patient": {
    "_id": "patient_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "healthReports": [
      {
        "_id": "report_id",
        "reportType": "blood_test",
        "doctorName": "Dr. John Smith",
        "findings": "Normal results",
        "createdAt": "2024-01-20T10:30:00.000Z"
      }
    ]
  },
  "totalReports": 1
}
```

**Error Responses:**

- `401`: Not authenticated
- `404`: Patient not found
- `500`: Server error

---

## 7. Get Relative Health Reports

**Endpoint:** `GET /api/v1/doctor/patients/:patientId/relatives/:relativeId/health-reports`

**Description:** Get all health reports for a specific relative of a patient.

**Authentication:** Required (JWT token)

**URL Parameters:**

- `patientId` (string): ID of the patient
- `relativeId` (string): ID of the relative

**Success Response (200):**

```json
{
  "success": true,
  "message": "Relative health reports fetched successfully",
  "relative": {
    "_id": "relative_id",
    "firstName": "Jane",
    "lastName": "Doe",
    "relationship": "spouse",
    "healthReports": [
      {
        "_id": "report_id",
        "reportType": "x_ray",
        "doctorName": "Dr. John Smith",
        "findings": "No abnormalities detected",
        "createdAt": "2024-01-20T10:30:00.000Z"
      }
    ]
  },
  "totalReports": 1
}
```

**Error Responses:**

- `401`: Not authenticated
- `404`: Patient or relative not found
- `500`: Server error

---

## 8. Get All Health Reports (Admin View)

**Endpoint:** `GET /api/v1/doctor/health-reports/all`

**Description:** Get all health reports with filtering and pagination options.

**Authentication:** Required (JWT token)

**Query Parameters (all optional):**

- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of records per page (default: 10)
- `reportType` (string): Filter by report type
- `severity` (string): Filter by severity level
- `doctorName` (string): Filter by doctor name (partial match)

**Example:** `GET /api/v1/doctor/health-reports/all?page=1&limit=5&reportType=blood_test&severity=high`

**Success Response (200):**

```json
{
  "success": true,
  "message": "All health reports fetched successfully",
  "healthReports": [
    {
      "_id": "report_id",
      "reportId": "HR-1642681800000-abc123def",
      "patientId": {
        "_id": "patient_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phoneNumber": "1234567890"
      },
      "reportType": "blood_test",
      "doctorName": "Dr. John Smith",
      "severity": "high",
      "createdAt": "2024-01-20T10:30:00.000Z"
    }
  ],
  "totalReports": 25,
  "currentPage": 1,
  "totalPages": 5
}
```

**Error Responses:**

- `401`: Not authenticated
- `500`: Server error

---

## Report Types

- `blood_test` - Blood work and lab tests
- `x_ray` - X-ray imaging
- `mri` - MRI scan
- `ct_scan` - CT scan
- `general_checkup` - General medical examination
- `other` - Other types of medical reports

## Severity Levels

- `low` - Minor or no concerns
- `medium` - Moderate attention required
- `high` - Significant medical attention needed
- `critical` - Urgent medical intervention required

## Data Flow

### Creating Health Reports:

1. Doctor creates health report for patient or relative
2. System generates unique report ID
3. Report is automatically linked to patient's or relative's health records
4. Report is saved with all medical details

### Managing Health Reports:

1. Doctors can view all their created reports
2. Reports can be updated with new findings
3. Reports can be deleted (removes from all patient records)
4. Comprehensive filtering and search capabilities

## Security Features

- **Authentication Required:** All endpoints require valid JWT tokens
- **Data Validation:** All inputs are validated for required fields and data types
- **Unique Report IDs:** Each report gets a unique identifier
- **Audit Trail:** Creation timestamps for tracking
- **Access Control:** Only authenticated users can access reports

## Error Handling

All endpoints use consistent error response format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:

- `200`: Success
- `201`: Created (new health report)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `404`: Not Found (patient/report not found)
- `500`: Internal Server Error
