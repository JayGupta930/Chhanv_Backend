# Admin Controller Documentation

## Overview

The Admin Controller handles all administrative operations for managing medical camps in the healthcare system. It provides comprehensive functionality for creating, retrieving, updating, deleting, and analyzing medical camp data with proper validation and error handling.

**Author:** Shubham  
**Version:** 1.0.0  
**Date:** July 2025

---

## Table of Contents

1. [Functions Overview](#functions-overview)
2. [API Endpoints](#api-endpoints)
3. [Function Documentation](#function-documentation)
4. [Request/Response Examples](#requestresponse-examples)
5. [Error Handling](#error-handling)
6. [Validation Rules](#validation-rules)

---

## Functions Overview

| Function              | Purpose                               | Access Level |
| --------------------- | ------------------------------------- | ------------ |
| `createCamp`          | Create a new medical camp             | Admin        |
| `getAllCamps`         | Get all camps with basic info         | Public/Admin |
| `getCampById`         | Get specific camp by ID               | Public/Admin |
| `updateCamp`          | Update existing camp details          | Admin        |
| `deleteCamp`          | Delete a medical camp                 | Admin        |
| `upComingCamps`       | Get all upcoming camps with details   | Public/Admin |
| `pastCampsCount`      | Get count of past camps only          | Public/Admin |
| `upComingCampsCount`  | Get count of upcoming camps only      | Public/Admin |
| `thisMonthCampsCount` | Get count of current month camps only | Public/Admin |

---

## API Endpoints

### Base URL: `/api/v1/admin`

| Method | Endpoint                 | Function              | Description                     |
| ------ | ------------------------ | --------------------- | ------------------------------- |
| POST   | `/camps/create`          | `createCamp`          | Create a new medical camp       |
| GET    | `/camps/all`             | `getAllCamps`         | Get all camps (basic info)      |
| GET    | `/camps/:id`             | `getCampById`         | Get specific camp by ID         |
| PUT    | `/camps/:id`             | `updateCamp`          | Update existing camp            |
| DELETE | `/camps/:id`             | `deleteCamp`          | Delete a camp                   |
| GET    | `/camps/upcoming`        | `upComingCamps`       | Get upcoming camps with details |
| GET    | `/camps/past/count`      | `pastCampsCount`      | Get past camps count            |
| GET    | `/camps/upcoming/count`  | `upComingCampsCount`  | Get upcoming camps count        |
| GET    | `/camps/thismonth/count` | `thisMonthCampsCount` | Get current month camps count   |

---

## Function Documentation

### 1. createCamp

**Purpose:** Creates a new medical camp with comprehensive validation

**Route:** `POST /api/v1/admin/camps/create`  
**Access:** Admin only

#### Request Body Parameters

| Parameter     | Type   | Required | Description                |
| ------------- | ------ | -------- | -------------------------- |
| `location`    | String | ✅       | Camp location              |
| `date`        | Date   | ✅       | Camp date                  |
| `startTime`   | String | ✅       | Camp start time            |
| `endTime`     | String | ✅       | Camp end time              |
| `address`     | String | ✅       | Full camp address          |
| `conductedBy` | Array  | ✅       | Array of doctor ObjectIds  |
| `limit`       | Number | ✅       | Participant limit (min: 1) |
| `createdBy`   | String | ✅       | Who created the camp       |

#### Validation Rules

- ✅ All fields are required
- ✅ Start time cannot be in the past
- ✅ Start time must be before end time
- ✅ No duplicate camps at same location and start time
- ✅ Limit must be at least 1

#### Response

**Success (201):**

```json
{
  "success": true,
  "message": "Camp created successfully",
  "camp": {
    "_id": "64f...",
    "location": "City Hospital",
    "date": "2025-07-25T00:00:00.000Z",
    "startTime": "09:00",
    "endTime": "17:00",
    "address": "123 Main Street",
    "conductedBy": ["64abc123...", "64def456..."],
    "limit": 50,
    "createdBy": "Admin John",
    "createdAt": "2025-07-18T10:30:00.000Z"
  }
}
```

---

### 2. getAllCamps

**Purpose:** Retrieves all medical camps with basic doctor information

**Route:** `GET /api/v1/admin/camps/all`  
**Access:** Public/Admin

#### Response

**Success (200):**

```json
{
  "success": true,
  "count": 3,
  "camps": [
    {
      "_id": "64f...",
      "location": "City Hospital",
      "date": "2025-07-25T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "17:00",
      "address": "123 Main Street",
      "conductedBy": [
        {
          "_id": "64abc...",
          "name": "Dr. John Smith",
          "specialization": "Cardiology"
        }
      ],
      "limit": 50,
      "createdBy": "Admin John",
      "createdAt": "2025-07-18T10:30:00.000Z"
    }
  ]
}
```

---

### 3. getCampById

**Purpose:** Retrieves a specific medical camp by its ID with detailed doctor information

**Route:** `GET /api/v1/admin/camps/:id`  
**Access:** Public/Admin

#### URL Parameters

| Parameter | Type   | Required | Description   |
| --------- | ------ | -------- | ------------- |
| `id`      | String | ✅       | Camp ObjectId |

#### Response

**Success (200):**

```json
{
  "success": true,
  "camp": {
    "_id": "64f...",
    "location": "City Hospital",
    "conductedBy": [
      {
        "_id": "64abc...",
        "name": "Dr. John Smith",
        "specialization": "Cardiology",
        "experience": 10,
        "qualification": "MBBS, MD"
      }
    ]
  }
}
```

**Error (404):**

```json
{
  "success": false,
  "message": "Camp not found"
}
```

---

### 4. updateCamp

**Purpose:** Updates an existing medical camp with partial data

**Route:** `PUT /api/v1/admin/camps/:id`  
**Access:** Admin only

#### URL Parameters

| Parameter | Type   | Required | Description             |
| --------- | ------ | -------- | ----------------------- |
| `id`      | String | ✅       | Camp ObjectId to update |

#### Request Body Parameters (All Optional)

| Parameter     | Type   | Required | Description                   |
| ------------- | ------ | -------- | ----------------------------- |
| `location`    | String | ❌       | New camp location             |
| `date`        | Date   | ❌       | New camp date                 |
| `startTime`   | String | ❌       | New start time                |
| `endTime`     | String | ❌       | New end time                  |
| `address`     | String | ❌       | New address                   |
| `conductedBy` | Array  | ❌       | New array of doctor ObjectIds |
| `limit`       | Number | ❌       | New participant limit         |

#### Validation Rules

- ✅ Camp must exist
- ✅ Start time cannot be in the past (if provided)
- ✅ Start time must be before end time (if both provided)
- ✅ No duplicate camps at same location and start time (excludes current camp)

#### Response

**Success (200):**

```json
{
  "success": true,
  "message": "Camp updated successfully",
  "camp": {
    "_id": "64f...",
    "location": "Updated Hospital",
    "limit": 75,
    "conductedBy": [
      {
        "_id": "64abc...",
        "name": "Dr. John Smith",
        "specialization": "Cardiology"
      }
    ]
  }
}
```

---

### 5. deleteCamp

**Purpose:** Deletes a medical camp by ID

**Route:** `DELETE /api/v1/admin/camps/:id`  
**Access:** Admin only

#### URL Parameters

| Parameter | Type   | Required | Description             |
| --------- | ------ | -------- | ----------------------- |
| `id`      | String | ✅       | Camp ObjectId to delete |

#### Response

**Success (200):**

```json
{
  "success": true,
  "message": "Camp deleted successfully"
}
```

**Error (404):**

```json
{
  "success": false,
  "message": "Camp not found"
}
```

---

### 6. upComingCamps

**Purpose:** Retrieves all upcoming medical camps with detailed information

**Route:** `GET /api/v1/admin/camps/upcoming`  
**Access:** Public/Admin

#### Features

- ✅ Only future camps (date >= today)
- ✅ Populated doctor information
- ✅ Complete camp details
- ✅ Count included

#### Response

**Success (200):**

```json
{
  "success": true,
  "count": 5,
  "camps": [
    {
      "_id": "64f...",
      "location": "City Hospital",
      "date": "2025-07-25T00:00:00.000Z",
      "conductedBy": [
        {
          "_id": "64abc...",
          "name": "Dr. John Smith",
          "specialization": "Cardiology"
        }
      ]
    }
  ]
}
```

---

### 7. pastCampsCount

**Purpose:** Returns count of completed medical camps only

**Route:** `GET /api/v1/admin/camps/past/count`  
**Access:** Public/Admin

#### Features

- ✅ Only past camps (date < today)
- ✅ Optimized with `countDocuments()`
- ✅ No data transfer, just count

#### Response

**Success (200):**

```json
{
  "success": true,
  "count": 15
}
```

---

### 8. upComingCampsCount

**Purpose:** Returns count of upcoming medical camps only

**Route:** `GET /api/v1/admin/camps/upcoming/count`  
**Access:** Public/Admin

#### Features

- ✅ Only upcoming camps (date >= today)
- ✅ Optimized with `countDocuments()`
- ✅ No data transfer, just count

#### Response

**Success (200):**

```json
{
  "success": true,
  "count": 8
}
```

---

### 9. thisMonthCampsCount

**Purpose:** Returns count of current month medical camps only

**Route:** `GET /api/v1/admin/camps/thismonth/count`  
**Access:** Public/Admin

#### Features

- ✅ Only current month camps
- ✅ Proper date range handling (start of month to start of next month)
- ✅ Optimized with `countDocuments()`
- ✅ No timezone issues

#### Response

**Success (200):**

```json
{
  "success": true,
  "count": 12
}
```

---

## Request/Response Examples

### Creating a Camp

**Request:**

```bash
POST /api/v1/admin/camps/create
Content-Type: application/json

{
  "location": "Community Health Center",
  "date": "2025-08-15",
  "startTime": "08:00",
  "endTime": "16:00",
  "address": "456 Health Street, Medical District",
  "conductedBy": ["64abc123456789", "64def987654321"],
  "limit": 100,
  "createdBy": "Dr. Admin Smith"
}
```

### Updating a Camp (Partial Update)

**Request:**

```bash
PUT /api/v1/admin/camps/64f123456789abcdef
Content-Type: application/json

{
  "location": "Updated Hospital",
  "limit": 75
}
```

### Getting Statistics

**Request:**

```bash
# Get upcoming camps count
GET /api/v1/admin/camps/upcoming/count

# Get past camps count
GET /api/v1/admin/camps/past/count

# Get this month camps count
GET /api/v1/admin/camps/thismonth/count
```

---

## Error Handling

### Common Error Responses

| Status Code | Error Type       | Description                            |
| ----------- | ---------------- | -------------------------------------- |
| 400         | Validation Error | Missing required fields                |
| 400         | Time Error       | Start time in past or invalid duration |
| 400         | Duplicate Error  | Camp already exists at location/time   |
| 404         | Not Found        | Camp with specified ID not found       |
| 500         | Server Error     | Internal server error                  |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description here"
}
```

### Example Error Responses

**Missing Fields (400):**

```json
{
  "success": false,
  "message": "Please fill all fields"
}
```

**Time Validation (400):**

```json
{
  "success": false,
  "message": "Start time cannot be in the past"
}
```

**Duplicate Camp (400):**

```json
{
  "success": false,
  "message": "Camp already exists at this location and time"
}
```

**Camp Not Found (404):**

```json
{
  "success": false,
  "message": "Camp not found"
}
```

---

## Validation Rules

### Field Validation

1. **Required Fields Check (Create):**

   - All 8 fields must be provided for creation
   - No empty or null values allowed

2. **Optional Fields (Update):**

   - Any combination of fields can be updated
   - Only provided fields will be updated

3. **Time Validation:**

   - Start time must be in the future
   - Start time must be before end time

4. **Duplicate Prevention:**

   - Checks for existing camps at same location and start time
   - Allows multiple camps at same location but different times
   - Update operations exclude current camp from duplicate check

5. **Data Type Validation:**
   - `conductedBy` must be array of valid ObjectIds
   - `limit` must be number ≥ 1
   - `date` must be valid date format

### Database Constraints

- `location`: String, required, trimmed
- `date`: Date, required
- `startTime`: String, required
- `endTime`: String, required
- `address`: String, required, trimmed
- `conductedBy`: Array of ObjectId references to Doctor model
- `limit`: Number, required, minimum 1
- `createdBy`: String, required, trimmed

---

## Performance Optimizations

### Count Functions

All count functions use `Camp.countDocuments()` instead of `Camp.find().length` for:

- ✅ **Better Performance** - Database-level counting
- ✅ **Memory Efficiency** - No document loading
- ✅ **Network Efficiency** - Smaller response payloads

### Populate Strategy

- **Basic Info**: Only `name` and `specialization` for list views
- **Detailed Info**: Additional fields like `experience` and `qualification` for single camp views

### Date Handling

- **Proper Boundaries**: Uses `$gte` and `$lt` for accurate date ranges
- **Month Calculation**: Uses start of next month for precise current month filtering
- **Timezone Safe**: Consistent date boundary handling

---

## Dependencies

### Imports

- `catchAsyncErrors` - Async error handling middleware
- `ErrorHandler` - Custom error handling class
- `Camp` - Camp model for database operations

### Models Used

- **Camp Model**: Main model for camp data
- **Doctor Model**: Referenced through `conductedBy` populate

---

## Security Considerations

1. **Data Exposure**: No sensitive doctor information exposed in basic views
2. **Validation**: Comprehensive validation prevents data inconsistencies
3. **Error Handling**: All functions use `catchAsyncErrors` wrapper
4. **Input Sanitization**: Mongoose schema validation and required field checks

---

## Notes

1. **Population**: Doctor data is populated in GET requests for better UX
2. **Partial Updates**: Update function only modifies provided fields
3. **Date Logic**: Robust date handling prevents edge cases
4. **Consistent Responses**: All functions follow same response format
5. **Performance**: Count functions optimized for dashboard statistics

---

_Last Updated: July 18, 2025_
