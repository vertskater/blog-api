# Blog API

A RESTful API for a blog platform, supporting user registration, authentication, post and comment management, user role-based access control, and API key rate limiting. The project uses Node.js, Express, Prisma, Passport, and JWT.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
    - [User Routes](#user-routes)
    - [Blog and Admin Routes](#blog-and-admin-routes)
    - [Admin Routes](#admin-routes)
- [Middleware](#middleware)
- [API Key Management](#api-key-management)
- [License](#license)

## Features
- **User Authentication**: Register, login, and secure access with JWT.
- **Blog Post Management**: CRUD operations for posts and comments.
- **Rate Limiting**: API key-based rate limiting for requests.
- **Role-Based Access**: Role management with different permissions for users and admins.
- **API Key Management**: Generate, retrieve, and manage API keys with access control.

## Technologies
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Prisma** - ORM for database interaction
- **Passport & Passport-JWT** - Authentication using JWT
- **Express-Validator** - Data validation
- **JSON Web Tokens (JWT)** - Token-based authentication
- **dotenv** - Manage environment variables

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vertskater/blog-api.git
   cd blog-api
   ```
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Setup prisma**
- Configure your Prisma schema in ```prisma/schema.prisma```.
- Run migrations:
  ```bash
   prisma migrate dev
  ```
4. **Set up Environment Variables: See [Environment Variables](#environment-variables) section.**
5. **Start the server**
    ```bash
   npm start
    ```
## Environment Variables
Create a ```.env``` file in the root directory and add the following variables:
```env 
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
ENCRYPTION_KEY="32_byte_key_for_encryption" # 64 hex characters
ALGORITHM="aes-256-cbc"
PORT=3000
```
## Usage
### User Routes
| Method | Endpoint             | Description                |
|--------|-----------------------|----------------------------|
| POST   | `/users/register`    | Register a new user        |
| POST   | `/users/login`       | Login and receive a JWT    |
| GET    | `/users/api-keys`    | Get API keys for a user    |
| GET    | `/users/api-key/new` | Generate a new API key     |
| PUT    | `/users/update`      | Update user email          |

## Blog and Admin Routes
### Blog Post Routes
| Method | Endpoint                     | Description                      |
|--------|-------------------------------|----------------------------------|
| GET    | `/blog/posts`                | Get all posts                    |
| GET    | `/blog/post/:id`             | Get a specific post by ID        |
| GET    | `/blog/posts/comments`       | Get posts with comments          |
| GET    | `/blog/post/comments/:id`    | Get comments for a specific post |
| POST   | `/admin/post`                | Create a new post                |
| POST   | `/admin/post/comment/:postId`| Add comment to a post            |
| PUT    | `/admin/post`                | Update a post                    |
| PUT    | `/admin/post/published`      | Publish a post                   |
| PUT    | `/admin/post/comment/:commentId` | Update a comment           |
| DELETE | `/admin/post/:id`            | Delete a post                    |
| DELETE | `/admin/post/comment/:commentId` | Delete a comment           |

## Admin Routes
### User Management Routes
| Method | Endpoint                          | Description       |
|--------|------------------------------------|-------------------|
| GET    | `/admin/users`                    | Get all users     |
| GET    | `/admin/users/:id`                | Get user by ID    |
| PUT    | `/admin/users/role/:id/:roleName` | Change user role  |
| DELETE | `/admin/users/:id`                | Delete a user     |

### Api Key Management Routes
| Method | Endpoint              | Description           |
|--------|------------------------|-----------------------|
| GET    | `/admin/keys`         | Get all API keys      |
| PUT    | `/admin/keys/status`  | Change API key status |

## Middleware
1. **Authentication Middleware:** Secures routes by validating JWT tokens.

   - Example: ```passport.authenticate('jwt', { session: false })```

2. **Role-Based Access Middleware:** Restricts access based on user roles.

   - ```isUser``` - Grants access to standard users.
   - ```isAdmin``` - Grants access to admin users.
3. **API Key Rate Limiting Middleware:** Limits API usage by key for specific endpoints.

## Api Key Management
Users can generate, retrieve, and view their API keys. API keys are encrypted before being stored in the database, so the plaintext key is only accessible immediately after creation.
## Licence
This project is licensed under the ISC License.