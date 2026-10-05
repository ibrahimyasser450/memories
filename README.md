# Memories

A full-stack social media application where users can create, share, update, like, and delete memorable posts.

The project is built with the **MERN Stack** and includes secure authentication using **Email/Password, Google OAuth, and GitHub OAuth**, with JWT-based authentication stored in **HttpOnly cookies**.

---

## 🚀 Features

* 🔐 User authentication with Email & Password
* 🔑 Google OAuth authentication
* 🐙 GitHub OAuth authentication
* 🍪 JWT authentication using HttpOnly cookies
* 👤 Persistent user sessions
* 📝 Create, update, and delete posts
* ❤️ Like and unlike posts
* 🖼️ Upload images with posts using Multer and Cloudinary 
* 👤 Display user profile information and avatar
* 🔒 Protected API routes with authentication middleware
* 🔔 Toast notifications for success and error messages
* 📱 Responsive user interface
* ⚡ Modern React architecture using Context API and Hooks

---

## 🛠️ Technologies

### Frontend

* React
* Vite
* Google OAuth
* React Router
* Context API
* Axios
* React Toastify
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Cookie Parser
* bcrypt
* Google OAuth
* GitHub OAuth
* CORS
* Multer
* Cloudinary

---

## 🔐 Authentication

The application supports three authentication methods:

### Email & Password

Users can create an account and sign in using their email and password.

Passwords are securely hashed before being stored in MongoDB.

### Google OAuth

Users can authenticate using their Google account through Google's OAuth authentication system.

### GitHub OAuth

Users can authenticate using their GitHub account through the GitHub OAuth App.

The GitHub authentication flow is handled by the backend:

---

## 🍪 Authentication with HttpOnly Cookies

After successful authentication, the backend generates a JWT and stores it inside an HttpOnly cookie.

The JWT is not stored in `localStorage` and is not exposed to frontend JavaScript.

---

## 📂 Project Structure

```text
Memories/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/ibrahimyasser450/Memories.git
```

Navigate to the project:

```bash
cd Memories
```

Install dependencies for the backend:

```bash
cd server
npm install
```

Install dependencies for the frontend:

```bash
cd ../client
npm install
```

---

## 🔑 Environment Variables

### Backend

Create a `.env` file inside the `server` directory:

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET_KEY=your_jwt_secret

FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/user/github/callback

CLOUDINARY_NAME= your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

### Frontend

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:3000

VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

> Never commit your `.env` files, OAuth client secrets, or JWT secrets to GitHub.

---

## ▶️ Running the Application

### Start the Backend

```bash
cd server
npm run server
```

The backend will run on:

```text
http://localhost:3000
```

### Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🎯 Main Concepts

This project demonstrates practical implementation of:

* REST API development
* MERN Stack architecture
* Authentication & Authorization
* JWT
* Multer
* Cloudinary
* HttpOnly Cookies
* OAuth 2.0
* Google OAuth
* GitHub OAuth
* Protected routes
* Express middleware
* MongoDB & Mongoose
* React Context API
* React Hooks
* Axios
* CRUD operations
* API error handling
* Client-server communication

---

## 👨‍💻 Author

**Ibrahim Yasser**

Software Engineer | Backend Node.js | MERN Full-Stack Developer

* GitHub: [@ibrahimyasser450](https://github.com/ibrahimyasser450)
