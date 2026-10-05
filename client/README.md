# Memories Client

Modern React + Vite frontend for the existing Memories MERN backend.

## Structure

```text
src/
├── components/
│   ├── AuthInput.jsx
│   ├── Form.jsx
│   ├── Icon.jsx
│   ├── Navbar.jsx
│   ├── Post.jsx
│   └── Posts.jsx
├── context/
│   └── AppContext.jsx
├── pages/
│   ├── Home.jsx
│   └── Login.jsx
├── App.jsx
├── index.css
└── main.jsx
```

## Setup

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_URL` to the URL of the existing server.
3. Set `VITE_GOOGLE_CLIENT_ID` to the same Google client ID configured on the server.
4. Run `npm install`.
5. Run `npm run dev`.

The frontend keeps the existing backend endpoints:

- `GET /posts`
- `POST /posts`
- `PATCH /posts/:id`
- `PATCH /posts/:id/likePost`
- `DELETE /posts/:id`
- `POST /user/signin`
- `POST /user/signup`
- `POST /user/google`
