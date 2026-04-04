# Secure Fortress - Security Implementation Documentation

## Overview
This document outlines the complete security implementation for Blogify API, including authentication (login with JWTs in HttpOnly cookies) and authorization (ownership-based access control).

## Security Features Implemented

### 1. Authentication (Secure Login with JWTs)

#### Files Modified/Created:
- `src/models/users.model.js` - Added password field with bcrypt hashing
- `src/middleware/auth.middleware.js` - Created protect middleware
- `src/controllers/auth.controller.js` - Created auth controller with login/register
- `src/routes/auth.routes.js` - Created auth routes
- `package.json` - Added bcryptjs and cookie-parser dependencies

#### Key Features:
- **Password Hashing**: Passwords are hashed using bcryptjs with salt=10 before storage
- **JWT Tokens**: Signed with JWT_SECRET from environment variables
- **HttpOnly Cookies**: Tokens stored in HttpOnly, Secure, SameSite cookies to prevent XSS attacks
- **Token Expiration**: Tokens expire after 7 days (configurable via JWT_EXPIRE)

#### Login Flow:
1. User sends email and password to `/api/v1/auth/login`
2. Password is verified against hashed password in DB
3. JWT is generated containing userId and email
4. JWT is set in HttpOnly cookie
5. User-friendly response is sent (without exposing token)

#### Endpoints:
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and receive cookie
- `POST /api/v1/auth/logout` - Clear cookie

### 2. Authorization (Ownership-Based Access Control)

#### Files Modified:
- `src/controllers/posts.controller.js` - Added ownership checks
- `src/routes/posts.routes.js` - Applied protect middleware
- `src/models/posts.model.js` - Already has author field

#### Key Features:
- **Ownership Checks**: Only post author can update or delete their posts
- **Resource-Level Authorization**: Checks performed per-resource before modification
- **HTTP Status Codes**:
  - 401: Unauthenticated (no token)
  - 403: Unauthorized (authenticated but no permission)

#### Protected Routes:
- `POST /api/v1/posts` - Create post (requires login) → Sets author to current user
- `PATCH /api/v1/posts/:postId` - Update post (requires login + ownership)
- `DELETE /api/v1/posts/:postId` - Delete post (requires login + ownership)

#### Public Routes (no auth required):
- `GET /api/v1/posts` - Get all posts
- `GET /api/v1/posts/:postId` - Get single post

---

## Testing Scenarios with Postman

### Scenario A: Authentication Required (401 Error)
**Goal**: Demonstrate that unauthenticated requests are rejected

**Steps**:
1. Open Postman
2. Create a DELETE request to `http://localhost:3000/api/v1/posts/{any-valid-post-id}`
3. **Do NOT include any cookies or authentication**
4. Send request
5. **Expected Response**: 
   ```json
   {
     "success": false,
     "message": "Not authorized to access this resource"
   }
   ```
   **Status**: 401 Unauthorized

---

### Scenario B: Authorization Failed - Ownership Check (403 Error)
**Goal**: Demonstrate that users cannot modify other users' posts

**Part 1: Create User A and Post**
1. `POST /api/v1/auth/register` with User A credentials:
   ```json
   {
     "name": "User A",
     "email": "usera@test.com",
     "password": "password123",
     "passwordConfirm": "password123"
   }
   ```
2. Copy the cookie from response (stored automatically in Postman)
3. `POST /api/v1/posts` with User A's token:
   ```json
   {
     "title": "User A's Post",
     "content": "This is User A's content"
   }
   ```
4. Note the `postId` from the response

**Part 2: Create User B**
1. Clear cookies or start new request without cookie
2. `POST /api/v1/auth/register` with User B credentials:
   ```json
   {
     "name": "User B",
     "email": "userb@test.com",
     "password": "password456",
     "passwordConfirm": "password456"
   }
   ```
3. Postman saves User B's cookie automatically

**Part 3: Try to Delete User A's Post as User B**
1. With User B's token active in Postman
2. `DELETE /api/v1/posts/{User A's postId}`
3. Send request
4. **Expected Response**:
   ```json
   {
     "success": false,
     "message": "You are not authorized to delete this post"
   }
   ```
   **Status**: 403 Forbidden

---

### Scenario C: Successful Authorization - Own Post Deletion
**Goal**: Demonstrate that users CAN modify their own posts

**Steps**:
1. Log in as User A (or register fresh):
   ```json
   POST /api/v1/auth/login
   {
     "email": "usera@test.com",
     "password": "password123"
   }
   ```
2. Create a post:
   ```json
   POST /api/v1/posts
   {
     "title": "My Post",
     "content": "Content I created"
   }
   ```
3. Note the `postId`
4. Delete your own post:
   ```
   DELETE /api/v1/posts/{your-own-postId}
   ```
5. **Expected Response**:
   ```json
   {
     "success": true,
     "message": "Post deleted successfully"
   }
   ```
   **Status**: 200 OK

---

## Environment Setup

### Required Environment Variables
Create a `.env` file in the root directory:
```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/blogify?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

### Install Dependencies
```bash
npm install
```

### Start Server
```bash
npm run dev    # With nodemon for development
# OR
npm start      # Basic start
```

---

## Code Highlights for Video Walkthrough

### 1. Login Controller (Cookie Setting)
**File**: `src/controllers/auth.controller.js` - Lines 13-29

Shows:
- JWT generation with user data
- HttpOnly cookie configuration
- Why HttpOnly prevents JavaScript access
- Secure flag for production HTTPS

### 2. Auth Middleware (Cookie Reading)
**File**: `src/middleware/auth.middleware.js` - Lines 3-35

Shows:
- Reading token from cookie
- JWT verification
- Attaching user data to request
- Error handling for invalid tokens

### 3. Authorization Logic (Ownership Check)
**File**: `src/controllers/posts.controller.js` - Lines 92-109

Shows:
- Fetching post before modification
- Comparing post author with current user
- Returning 403 for unauthorized requests
- Why ownership verification is crucial

---

## Security Best Practices Demonstrated

1. **Password Security**
   - Passwords never stored in plain text
   - Bcrypt salt used (prevents rainbow tables)
   - Passwords never sent in responses

2. **JWT Security**
   - Short expiration (7 days)
   - Stored in HttpOnly cookies (prevents XSS)
   - Secure flag (HTTPS only in production)
   - SameSite protection (CSRF prevention)

3. **API Security**
   - Resource-level authorization checks
   - Proper HTTP status codes (401 vs 403)
   - Error messages don't leak information
   - User context attached to requests

---

## Postman Collection Tips

### Managing Cookies in Postman
1. **Save cookies automatically**: 
   - Postman automatically saves cookies from responses
   - Subsequent requests use saved cookies
   - View cookies in "Cookies" tab at bottom of app

2. **Clear cookies between test scenarios**:
   - Go to Settings → Cookies
   - Find and delete specific cookies or clear all

3. **Set custom cookie header** (if needed):
   - Add header: `Cookie: token=<your-jwt-token>`

---

## Troubleshooting

### "Not authorized" error on POST /posts
- Make sure you're logged in first
- Check that cookie exists in Postman cookies list
- Verify JWT_SECRET in .env matches signing secret

### "Passwords do not match" on register
- Confirm `password` and `passwordConfirm` are identical

### Database connection fails
- Check MONGO_URI in .env
- Verify MongoDB credentials and cluster access

### Token verification fails
- Ensure JWT_SECRET is set correctly
- Check that token hasn't expired (7 days default)
