# Video Walkthrough Script - Secure Fortress

## Duration: 3-5 minutes

---

## Part 1: Code Overview (1:30 - 2:00)

### Intro (15 seconds)
```
"Hi, I've implemented the complete security module for Blogify API. 
This demonstrates authentication with secure JWT cookies and authorization 
with ownership-based access control. Let me walk through the key code."
```

### Show Files Structure
In VS Code, open explorer and highlight:
- `src/models/users.model.js`
- `src/middleware/auth.middleware.js`
- `src/controllers/auth.controller.js`
- `src/controllers/posts.controller.js`

#### 1. User Model with Password (30 seconds)
**Open**: `src/models/users.model.js`

**Highlight**:
- Password field being hashed with bcryptjs
```javascript
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
```

**Explanation**:
"When a user registers, their password is automatically hashed using bcryptjs 
with a salt of 10. This happens before saving to the database. 
The password is never stored in plain text."

#### 2. Login Controller - Cookie Setting (30 seconds)
**Open**: `src/controllers/auth.controller.js`

**Scroll to**: `sendTokenResponse` function

**Highlight**:
```javascript
const cookieOptions = {
  httpOnly: true,      // Cannot be accessed by JavaScript
  secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

res.cookie('token', token, cookieOptions);
```

**Explanation**:
"After verifying the user's password, we create a JWT token containing 
their user ID and email. This token is stored in an HttpOnly cookie, 
which means it cannot be accessed by JavaScript code on the client. 
This prevents XSS attacks from stealing the token. 
The secure flag ensures it's only sent over HTTPS in production. 
The SameSite flag provides CSRF protection, and the token expires after 7 days."

#### 3. Auth Middleware - Cookie Reading (30 seconds)
**Open**: `src/middleware/auth.middleware.js`

**Highlight**:
```javascript
const protect = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };
    
    next();
  } catch (err) {
    return res.status(401).json({...});
  }
};
```

**Explanation**:
"The protect middleware runs before protected routes. 
It reads the JWT token from the cookie, verifies it using our secret key, 
and attaches the decoded user data to the request. 
If there's no token or it's invalid, it returns a 401 Unauthorized response. 
This ensures only authenticated users can access protected endpoints."

#### 4. Authorization - Ownership Check (30 seconds)
**Open**: `src/controllers/posts.controller.js`

**Scroll to**: `deletePost` function

**Highlight**:
```javascript
const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Authorization: Ownership check
    if (post.author._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    }

    const deleted = await postService.deletePost(postId);
    // ...
  }
};
```

**Explanation**:
"For sensitive operations like delete and update, we verify that the current 
user owns the post before proceeding. We fetch the post, check if its author ID 
matches the current user's ID. If they don't match, we return a 403 Forbidden response. 
This prevents users from modifying posts they don't own."

---

## Part 2: Postman Demonstration (2:00 - 4:30)

### Setup (30 seconds)
```
"Now let me demonstrate the security in action using Postman. 
I'll show three scenarios: 
1. Trying to delete without authentication (401 error)
2. Trying to delete another user's post (403 error)  
3. Successfully deleting your own post (200 success)"
```

Open Postman and set server URL to `http://localhost:3000`

### Scenario A: No Authentication → 401 Error (1:00 - 1:30)

**Demonstration**:
1. Open new tab in Postman
2. Clear all cookies (show this in Cookies panel)
3. Set up request:
   ```
   DELETE http://localhost:3000/api/v1/posts/[any-valid-post-id]
   ```
4. Click Send

**Show Response**:
```
{
  "success": false,
  "message": "Not authorized to access this resource"
}
Status: 401 Unauthorized
```

**Narrate**:
"Since we're not sending any authentication token, the protect middleware 
blocks the request immediately and returns 401 Unauthorized. 
Without a valid JWT in the cookie, you cannot delete posts."

---

### Scenario B: Authorization Failed → 403 Error (1:30 - 3:15)

**Part 1: Register and Create Post as User A (1:30 - 2:15)**

1. New Postman tab
2. Register User A:
   ```
   POST http://localhost:3000/api/v1/auth/register
   Body (JSON):
   {
     "name": "Alice",
     "email": "alice@test.com",
     "password": "password123",
     "passwordConfirm": "password123"
   }
   ```
3. Click Send
4. Show response and cookie in headers

**Narrate**:
"User A registers and receives a JWT in the cookie. 
Notice in the Postman response headers, we can see the cookie was set."

5. Create a post as Alice:
   ```
   POST http://localhost:3000/api/v1/posts
   Body (JSON):
   {
     "title": "Alice's Secret Diary",
     "content": "This is Alice's personal post"
   }
   ```
6. Click Send
7. Note the post ID in response

**Narrate**:
"Alice creates a post. The middleware automatically sets her user ID as the author."

**Part 2: Register User B and Try to Delete Alice's Post (2:15 - 3:00)**

1. New Postman tab or clear cookies
2. Register User B:
   ```
   POST http://localhost:3000/api/v1/auth/register
   Body (JSON):
   {
     "name": "Bob",
     "email": "bob@test.com",
     "password": "password456",
     "passwordConfirm": "password456"
   }
   ```
3. Click Send

**Narrate**:
"Bob registers with a different account. He now has his own JWT token."

4. Try to delete Alice's post:
   ```
   DELETE http://localhost:3000/api/v1/posts/[Alice's-post-id]
   ```
5. Click Send

**Show Response**:
```
{
  "success": false,
  "message": "You are not authorized to delete this post"
}
Status: 403 Forbidden
```

**Narrate**:
"Even though Bob is authenticated (he has a valid token), 
he gets a 403 Forbidden because he doesn't own Alice's post. 
The authorization check prevents him from modifying posts he didn't create. 
Notice the difference: 401 means 'you need to log in', 
403 means 'okay I know who you are, but you don't have permission'."

---

### Scenario C: Success → Delete Own Post (3:15 - 4:00)

1. Go back to Alice's session (her existing Postman tab)
2. Create a new post:
   ```
   POST http://localhost:3000/api/v1/posts
   Body (JSON):
   {
     "title": "Alice's New Post",
     "content": "This post will be deleted"
   }
   ```
3. Note the post ID

4. Delete the post Alice just created:
   ```
   DELETE http://localhost:3000/api/v1/posts/[Alice's-new-post-id]
   ```
5. Click Send

**Show Response**:
```
{
  "success": true,
  "message": "Post deleted successfully"
}
Status: 200 OK
```

**Narrate**:
"Alice successfully deletes her own post because the ownership check passes. 
The authorization logic confirms that post.author matches the current user, 
so the deletion proceeds. 
This demonstrates the complete security flow: 
Authentication verified (401 scenario), 
Authorization checked (403 scenario), 
and when both pass, operations succeed (200 scenario)."

---

## Part 3: Summary (30 seconds)

```
"Let me recap what we've demonstrated:

1. AUTHENTICATION: We use JWT tokens stored in secure HttpOnly cookies. 
   Trying to access protected endpoints without a token returns 401 Unauthorized.

2. AUTHORIZATION: We check if users own resources before allowing modifications. 
   Attempting to modify another user's resource returns 403 Forbidden.

3. IMPLEMENTATION: The security is implemented with a middleware for authentication 
   and resource-level checks in controllers for authorization.

This approach ensures that only authenticated users can access protected resources, 
and even authenticated users can only modify their own data. 
The PR includes all these changes with proper error handling and security best practices. 
Thank you!"
```

---

## Tips for Recording

1. **Use browser DevTools** (Optional, for visual effect):
   - F12 → Application tab → Cookies
   - Show the token cookie being set and read

2. **Set reasonable wait times** between API calls (2-3 seconds)

3. **Use large font** in terminal/code editor

4. **Speak clearly** and pause between sections

5. **Keep cursor visible** - Postman shows response clearly

6. **Test locally first** before recording to catch any issues

7. **Keep response JSON visible** on screen while narrating

---

## Recording Tools
- **Loom**: Free tier, built-in editing
- **Google Drive**: Record inside Google Meet, auto-saves
- **OBS Studio**: Free, more control
- **ScreenFlow** (Mac): Premium but high quality

---

## Checklist Before Submission
- [ ] Server is running locally (`npm run dev`)
- [ ] Video shows all 3 test scenarios clearly
- [ ] Code is easy to read in video
- [ ] Audio is clear and not too fast
- [ ] Video duration is 3-5 minutes
- [ ] PR link is shared in video description or presentation
- [ ] All security features are explained
