# Chhanv Backend - Developer Mode Setup

## Quick Start for Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

The backend is now configured with developer-friendly settings in `secret.env`:

- **NODE_ENV**: `development`
- **Cookie Security**: Relaxed for localhost
- **CORS**: Permissive for multiple localhost ports
- **Rate Limiting**: Increased limits for testing
- **JWT Debug**: Enabled logging

### 3. Start Development Server

```bash
# Standard development mode
npm run dev

# With debug information
npm run dev:debug

# Test JWT configuration
npm run test:jwt
```

### 4. Development Features

#### JWT Token Configuration

- **Security**: Relaxed for localhost (secure=false, sameSite=lax)
- **Domain**: Set to localhost for proper cookie handling
- **Debug Logging**: Token generation and cookie info logged to console
- **Expiry**: 7 days (configurable via COOKIE_EXPIRE)

#### CORS Configuration

- Supports multiple frontend ports: 3000, 3001, 5173
- Configurable via CORS_ORIGIN environment variable
- Credentials enabled for cookie-based auth

#### Rate Limiting

- Development: 1000 requests per 15 minutes
- Production: 100 requests per 15 minutes
- Configurable via RATE_LIMIT_MAX and RATE_LIMIT_WINDOW

### 5. Testing APIs

#### Using Postman/Insomnia

1. Set base URL to: `http://localhost:5000`
2. Enable "Send cookies" option
3. Use these endpoints:
   - POST `/api/v1/user/login`
   - POST `/api/v1/user/register`
   - GET `/api/v1/user/profile` (requires auth)

#### Cookie Authentication

Cookies are automatically set on successful login with these properties:

- **Name**: `token`
- **Domain**: `localhost`
- **HttpOnly**: `true`
- **Secure**: `false` (for HTTP in development)
- **SameSite**: `lax`

### 6. Development Scripts

```bash
# Test environment configuration
npm run dev:test

# Start with full debugging
npm run dev:debug

# Check setup (if available)
npm run setup:check
```

### 7. Frontend Integration

#### React/Vite (Port 5173)

```javascript
// API configuration for development
const API_BASE_URL = "http://localhost:5000/api/v1";

// Axios configuration
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL;
```

#### Fetch API

```javascript
// Enable credentials for cookie handling
fetch("http://localhost:5000/api/v1/user/login", {
  method: "POST",
  credentials: "include", // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(loginData),
});
```

### 8. Troubleshooting

#### Cookies Not Working

- Check browser dev tools > Application > Cookies
- Ensure `credentials: true` in frontend requests
- Verify domain is set to `localhost`

#### CORS Errors

- Add your frontend port to CORS_ORIGIN in secret.env
- Restart the server after env changes

#### Authentication Issues

- Check console for JWT debug logs
- Verify token is being sent in cookies
- Use `npm run test:jwt` to test token generation

### 9. Production Deployment

When deploying to production:

1. Change `NODE_ENV` to `production`
2. Set `COOKIE_SECURE` to `true`
3. Update `FRONTEND_URL` to your production domain
4. Reduce `RATE_LIMIT_MAX` to appropriate value
5. Set proper `COOKIE_SAMESITE` to `strict`

### 10. Security Notes

- JWT secrets are for development only
- Database connection uses cloud MongoDB
- Rate limiting is relaxed for development
- Cookie security is disabled for HTTP localhost

## Environment Variables Reference

| Variable          | Development Value        | Description              |
| ----------------- | ------------------------ | ------------------------ |
| `NODE_ENV`        | `development`            | Environment mode         |
| `COOKIE_SECURE`   | `false`                  | Allow HTTP cookies       |
| `COOKIE_SAMESITE` | `lax`                    | Permissive cookie policy |
| `RATE_LIMIT_MAX`  | `1000`                   | High request limit       |
| `CORS_ORIGIN`     | Multiple localhost ports | Allowed origins          |
| `DEBUG_MODE`      | `true`                   | Enable debug logging     |

---

Happy coding! 🚀
