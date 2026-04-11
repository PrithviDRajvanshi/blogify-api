# Blogify-api

A lightweight Express API for a blogging platform. This service connects to MongoDB Atlas using Mongoose and provides full CRUD operations for posts with author relationships.

## Getting Started

1. **Clone the repo** and switch to a new feature branch before making changes:
   ```bash
   git checkout -b feat/integrate-database-layer
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure environment**: copy `.env.example` to `.env` and fill in your MongoDB Atlas connection string.
4. **Run the server**:
   ```bash
   npm start
   # or nodemon src/index.js if you have nodemon installed
   ```

## Environment Variables

- `MONGO_URI` – Atlas connection string. Required.
- `PORT` – Optional, default is `3000`.

## Project Structure

Standard MVC pattern with models, controllers, services, routes, and middleware. The data layer uses Mongoose models (`User`, `Post`) and a service layer (`posts.service.js`).

## API Endpoints

All routes are prefixed with `/api/v1`.

| Method | Path               | Description                         |
|--------|--------------------|-------------------------------------|
| GET    | `/posts`           | List all posts (with populated author) |
| GET    | `/posts/:postId`   | Get one post by ID                  |
| POST   | `/posts`           | Create a new post                   |
| PATCH  | `/posts/:postId`   | Update a post                      |
| POST   | `/auth/register`  | Register a new user                 |
| POST   | `/auth/login`     | Login user                         |
| POST   | `/auth/logout`    | Logout user                        |

> **Note:** Users can register via the API. Use the `author` field when creating posts.

## Testing with Postman

- Create a user document in the `users` collection and copy its `_id`.
- Use that `_id` as `author` in the payload when POSTing to `/posts`.
- Verify populate by fetching posts and inspecting the embedded `author` object.
- Try error cases: missing fields, invalid IDs, 404 responses.

## Git Workflow

- Work on a dedicated feature branch.
- Commit incrementally with descriptive messages like `feat: add post service and controllers`.
- Push branch and create a pull request to `main` when complete.

## Deployment

(Deployment notes can be added here later.)
