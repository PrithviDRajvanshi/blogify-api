# GitHub PR Submission Guide

## Pre-PR Checklist

### 1. Local Setup
```bash
# Navigate to project
cd Blogify-api

# Create .env file with required variables
# (Copy from .env.example and fill in MongoDB credentials)

# Install dependencies
npm install

# Test the server
npm run dev
```

### 2. Install Dependencies
```bash
# This installs:
# - bcryptjs: Password hashing
# - cookie-parser: Parse HTTP cookies
# - jsonwebtoken: Already in package.json
npm install
```

### 3. Create Feature Branch
```bash
# Create and switch to security branch
git checkout -b security-implementation

# Or if you prefer:
git checkout -b feature/secure-login-auth
```

### 4. Verify Local Changes
Complete the testing scenarios before submitting:
- Test user registration
- Test user login
- Test creating a post (should capture your user ID)
- Test deleting your own post (should succeed with 200)
- Test deleting another user's post (should fail with 403)
- Test accessing protected routes without authentication (should fail with 401)

---

## Commit Strategy

### Recommended Commits
Break changes into logical commits:

```bash
# Commit 1: Models with password field
git add src/models/users.model.js
git commit -m "feat: add password field to User model with bcrypt hashing"

# Commit 2: Authentication middleware
git add src/middleware/auth.middleware.js
git add src/middleware/index.js
git commit -m "feat: create authentication middleware to protect routes"

# Commit 3: Auth controller and routes
git add src/controllers/auth.controller.js
git add src/routes/auth.routes.js
git commit -m "feat: implement authentication controller with login/register"

# Commit 4: Authorization in posts
git add src/controllers/posts.controller.js
git add src/routes/posts.routes.js
git commit -m "feat: add authorization checks for post ownership"

# Commit 5: Configuration and dependencies
git add package.json src/index.js src/routes/index.js .env.example
git commit -m "chore: add required dependencies and configure app"

# Commit 6: Documentation
git add SECURITY_IMPLEMENTATION.md
git commit -m "docs: add security implementation and testing guide"
```

---

## Creating the Pull Request

### Step 1: Push Branch
```bash
# Push your security-implementation branch
git push origin security-implementation
```

### Step 2: Go to GitHub
1. Visit your repository: `https://github.com/YOUR_USERNAME/blogify-api`
2. You should see a notification about your recent push
3. Click "Compare & pull request" button

### Step 3: Fill PR Details

**Title** (Required):
```
Secure Fortress: Implement Authentication & Authorization
```

**Description** (Template):
```markdown
## Description
Implements complete security module for Blogify API with JWT-based authentication and authorization checks.

## Changes Made

### Authentication (Secure Login with JWTs)
- ✅ Update User model with password field and bcrypt hashing
- ✅ Create auth middleware (`protect`) to read and verify JWT from HttpOnly cookies
- ✅ Implement auth controller with login, register, and logout endpoints
- ✅ Store JWT in secure HttpOnly cookies to prevent XSS attacks
- ✅ Add JWT token expiration (7 days)

### Authorization (Ownership-Based Access Control)
- ✅ Add ownership checks in post controller (delete/update operations)
- ✅ Return 403 Forbidden when users try to modify other users' posts
- ✅ Protect create/update/delete post routes with authentication middleware
- ✅ Allow public read access to posts

### Testing
All three scenarios from requirements have been implemented and can be tested:
- **Scenario A (401)**: Delete post without authentication
- **Scenario B (403)**: Delete post owned by different user
- **Scenario C (200)**: Delete your own post successfully

## Files Changed
- `src/models/users.model.js` - Password field + bcrypt methods
- `src/middleware/auth.middleware.js` - New JWT verification middleware
- `src/controllers/auth.controller.js` - Login/register/logout logic
- `src/routes/auth.routes.js` - Auth endpoints
- `src/controllers/posts.controller.js` - Authorization checks
- `src/routes/posts.routes.js` - Protected routes
- `src/index.js` - Cookie parser middleware
- `package.json` - Dependencies (bcryptjs, cookie-parser)
- `.env.example` - JWT configuration

## Testing Instructions
See `SECURITY_IMPLEMENTATION.md` for complete testing guide with Postman.

## Security Features
- Passwords hashed with bcryptjs (salt=10)
- JWTs stored in HttpOnly cookies (XSS protection)
- Secure flag for production HTTPS
- SameSite cookies for CSRF protection
- Resource-level authorization checks
- Proper HTTP status codes (401 vs 403)
```

### Step 4: Select Base Branch
Make sure:
- **Base branch**: `main` (or `master`)
- **Compare branch**: `security-implementation`

### Step 5: Review Changes
GitHub will show:
- Files changed
- Diffs for each file
- Review the changes match your local work

### Step 6: Submit PR
Click "Create pull request" button

---

## After PR Creation

### Review Checklist
- [ ] All commits are logical and well-commented
- [ ] PR description clearly explains changes
- [ ] Testing scenarios are documented
- [ ] No merge conflicts

### If Reviewers Request Changes
```bash
# Make the requested changes
git add .
git commit -m "refactor: address review comments"
git push origin security-implementation
# Changes automatically appear in PR
```

---

## PR Review Tips

When presenting to reviewers:

1. **Show the code flow**:
   - Start with User model (password field)
   - Show auth middleware (JWT verification)
   - Show auth controller (cookie setting)
   - Show authorization checks in posts controller

2. **Highlight security features**:
   - HttpOnly cookies prevent XSS
   - JWT ensures token integrity
   - Ownership checks prevent unauthorized modifications

3. **Point out HTTP status codes**:
   - 401: No token provided
   - 403: Token valid but user lacks permission
   - Why distinction matters (security & API clarity)

---

## Example PR URL
After creation, your PR will be at:
```
https://github.com/YOUR_USERNAME/blogify-api/pull/{PR_NUMBER}
```

Share this link for the video walkthrough!
