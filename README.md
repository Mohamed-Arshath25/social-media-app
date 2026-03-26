# Social Media App Backend

A production-style backend for a social media app built with Node.js, Express, PostgreSQL, Prisma ORM, JWT authentication, and bcrypt.

## 1. Project Setup

### Create the project

```bash
npm install
```

### Configure environment variables

Create a `.env` file from `.env.example`:

PowerShell:

```powershell
Copy-Item .env.example .env
```

Bash:

```bash
cp .env.example .env
```

Update these values:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/social_media_app?schema=public"
JWT_SECRET="replace_this_with_a_long_random_secret"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

## 2. Prisma Schema

The Prisma schema is in `prisma/schema.prisma`. It defines these models:

- `User`
- `Post`
- `Comment`
- `Like`
- `Follow`

Important production-friendly details:

- Unique constraints on `username` and `email`
- Composite unique constraints for likes and follows
- Cascade delete relations so child records are cleaned up automatically
- Indexes on foreign keys for better query performance

## 3. Run Prisma Migrations

Generate the Prisma client:

```bash
npx prisma generate
```

Create the initial migration:

```bash
npx prisma migrate dev --name init
```

If you want to inspect your database visually:

```bash
npx prisma studio
```

## 4. Start the Backend

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

## 5. Folder Structure

```bash
controllers/
middleware/
prisma/
routes/
utils/
app.js
server.js
```

## 6. API Routes

### Auth Routes

- `POST /api/auth/register`
- `POST /api/auth/login`

### User Routes

- `GET /api/users/me`
- `GET /api/users/:id`
- `POST /api/users/:id/follow`
- `DELETE /api/users/:id/follow`

### Post Routes

- `POST /api/posts`
- `GET /api/posts`
- `POST /api/posts/:id/like`
- `DELETE /api/posts/:id/like`
- `DELETE /api/posts/:id`

### Comment Routes

- `POST /api/comments`
- `GET /api/comments/post/:postId`

## 7. Authentication Flow

1. Register or log in a user.
2. The API returns a JWT token.
3. Send that token in the `Authorization` header:

```http
Authorization: Bearer your_jwt_token
```

4. Protected routes use middleware to verify the token and attach the logged-in user to `req.user`.

## 8. Example Request Bodies

### Register

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "123456",
  "bio": "Backend developer",
  "profilePic": "https://example.com/profile.jpg"
}
```

### Login

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

### Create Post

```json
{
  "content": "Hello from my first post!",
  "image": "https://example.com/post-image.jpg"
}
```

### Add Comment

```json
{
  "text": "Nice post!",
  "postId": 1
}
```

## 9. Production Notes

- Passwords are hashed with `bcrypt`
- Tokens are generated with `jsonwebtoken`
- Errors are handled centrally
- Required environment variables are validated on startup
- Security middleware includes `helmet`
- CORS is enabled
- Logging uses `morgan`
- All database logic is written with Prisma and async/await

## 10. Next Improvements You Can Add

- Input validation with `zod` or `express-validator`
- Refresh tokens
- Image uploads with Cloudinary or S3
- Pagination for feed and comments
- Edit profile and edit post endpoints
- Role-based access control for admin tools
