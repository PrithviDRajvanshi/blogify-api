# Quick Start & Verification Guide

## Prerequisites
- Node.js installed
- MongoDB Atlas account with cluster
- Local `.env` file configured

---

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This installs:
- `bcryptjs` - Password hashing
- `cookie-parser` - Parse cookies
- `jsonwebtoken` - JWT creation/verification
- `mongoose` - MongoDB driver
- `express` - Web framework
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `express-validator` - Input validation
- `nodemon` - Dev auto-restart

### 2. Create .env File
```bash
# Copy template
cp .env.example .env

# Edit with your MongoDB details
nano .env
```

Required variables:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blogify
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRE=7d
PORT=3000
```

### 3. Start Server
```bash
# Development (with auto-reload)
npm run dev

# Or
nodemon src/index.js
```

Expected output:
```
MongoDB Connected: [cluster-name]/blogify
Server running on port 3000
```

---

## Quick Test Commands (cURL)

### 1. Register User A
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@test.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }' \
  -c cookies-alice.txt
```

### 2. Create Post as User A
```bash
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -b cookies-alice.txt \
  -d '{
    "title": "Alice Post",
    "content": "Content by Alice"
  }'
```

### 3. Register User B
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob",
    "email": "bob@test.com",
    "password": "password456",
    "passwordConfirm": "password456"
  }' \
  -c cookies-bob.txt
```

### 4. Test 401 Error (No Auth)
```bash
# Try delete without cookie
curl -X DELETE http://localhost:3000/api/v1/posts/[post-id]
```
Should return: `401 Unauthorized`

### 5. Test 403 Error (Wrong User)
```bash
# Bob tries to delete Alice's post
curl -X DELETE http://localhost:3000/api/v1/posts/[alice-post-id] \
  -b cookies-bob.txt
```
Should return: `403 Forbidden`

### 6. Test 200 Success (Own Post)
```bash
# Alice deletes her own post
curl -X DELETE http://localhost:3000/api/v1/posts/[alice-post-id] \
  -b cookies-alice.txt
```
Should return: `200 OK`

---

## Postman Collection Quick Setup

### Import Environment Variables
```json
{
  "id": "blogify-env",
  "name": "Blogify",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api/v1",
      "enabled": true
    },
    {
      "key": "userAId",
      "value": "",
      "enabled": true
    },
    {
      "key": "userBId",
      "value": "",
      "enabled": true
    },
    {
      "key": "postId",
      "value": "",
      "enabled": true
    }
  ]
}
```

### Request Examples

**Register User A**
```
POST {{baseUrl}}/auth/register

{
  "name": "Alice",
  "email": "alice@test.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Login**
```
POST {{baseUrl}}/auth/login

{
  "email": "alice@test.com",
  "password": "password123"
}
```

**Create Post** (Requires Auth)
```
POST {{baseUrl}}/posts

{
  "title": "My Post",
  "content": "Post content"
}
```

**Get All Posts**
```
GET {{baseUrl}}/posts
```

**Delete Post** (Requires Auth + Ownership)
```
DELETE {{baseUrl}}/posts/{{postId}}
```

---

## Verification Checklist

- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Cookie is set in browser/Postman
- [ ] Can create post when authenticated
- [ ] Cannot delete without authentication (401)
- [ ] Cannot delete another user's post (403)
- [ ] Can delete own post (200)
- [ ] Can logout (clears cookie)

---

## Troubleshooting

### "MongoDB connection failed"
```bash
# Check .env file has correct MONGO_URI
cat .env | grep MONGO_URI

# Verify MongoDB cluster credentials
# - Username/password correct
# - IP whitelist includes your computer
```

### "JWT verification failed"
```bash
# Ensure JWT_SECRET is set in .env
echo $JWT_SECRET  # Should show value

# Check token hasn't expired
# Default expiry is 7 days
```

### "Cookie not being set"
```bash
# Verify cookie-parser is imported in src/index.js
grep "cookie-parser" src/index.js

# In Postman, check Cookies tab for stored cookies
```

### "Password validation failed"
```bash
# Ensure password is at least 6 characters
# Ensure password and passwordConfirm match
```

---

## Docker Setup (Optional)

If you want to avoid local MongoDB setup:

```bash
# Install Docker and run MongoDB container
docker run -d -p 27017:27017 -e MONGO_INITDB_DATABASE=blogify mongo

# Update .env
MONGO_URI=mongodb://localhost:27017/blogify
```

---

## Next Steps

1. **Install dependencies**: `npm install`
2. **Configure .env**: Copy from `.env.example`
3. **Start server**: `npm run dev`
4. **Test endpoints**: Follow sections above
5. **Record video**: Use script in `VIDEO_WALKTHROUGH_SCRIPT.md`
6. **Create PR**: Follow `PR_SUBMISSION_GUIDE.md`

Questions? See `SECURITY_IMPLEMENTATION.md` for detailed info.
