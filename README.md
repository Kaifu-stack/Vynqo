# 🎬 Video Sharing Platform 

A full-stack video sharing platform built with **React, Node.js, Express, and MongoDB**.
It includes features like video upload, playlists, likes, subscriptions, tweets, and real-time updates.

<p align="center"> <img src="https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb&logoColor=white" /> <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react" /> <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js" /> <img src="https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb" /> <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge&logo=jsonwebtokens" /> <img src="https://img.shields.io/badge/RealTime-Socket.io-black?style=for-the-badge&logo=socket.io" /> </p> <p align="center"> <a href="https://vynqo.vercel.app"> <img src="https://img.shields.io/badge/Live-Demo-purple?style=for-the-badge&logo=vercel" /> </p>


##  Features

### 🔹 Authentication

* JWT-based authentication
* Login / Register
* Protected routes

### 🎥 Videos

* Upload videos
* Watch videos
* View count tracking
* Edit & delete videos
* Infinite scroll feed

### ❤️ Likes

* Like/unlike videos
* Like tweets & comments
* Real-time like updates

### 📺 Subscriptions

* Subscribe / unsubscribe to channels
* Persistent state (no reset on refresh)

### 📂 Playlists

* Create playlists
* Add/remove videos
* View playlist videos
* Dynamic video count

### 🐦 Tweets (Mini Social Feed)

* Create, edit, delete tweets
* Like tweets
* Real-time tweet updates (Socket.io)

### 💬 Comments & Replies

* Comment on videos
* Nested replies
* Real-time updates (optional)

### 📊 Dashboard

* Total videos
* Total views
* Total likes (calculated dynamically)

---

##  Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router
* Framer Motion
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Socket.io (real-time)

---

## 📁 Project Structure

```
client/
 ├── components/
 ├── pages/
 ├── api/
 └── App.jsx

server/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middlewares/
 └── app.js / index.js
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Kaifu-stack/Vynqo.git
cd Vynqo
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env`:

```
PORT=8000
MONGODB_URI=your_mongo_uri
ACCESS_TOKEN_SECRET=your_secret
```

Run server:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🔗 API Endpoints (Important)

### Auth

* `POST /api/v1/users/register`
* `POST /api/v1/users/login`

### Videos

* `GET /api/v1/videos`
* `POST /api/v1/videos`
* `GET /api/v1/videos/video/:id`

### Playlists

* `GET /api/v1/playlists/me`
* `POST /api/v1/playlists`
* `POST /api/v1/playlists/:playlistId/videos/:videoId`
* `DELETE /api/v1/playlists/:playlistId/videos/:videoId`

### Likes

* `POST /api/v1/likes/toggle/v/:videoId`

### Tweets

* `GET /api/v1/tweets`
* `POST /api/v1/tweets`
* `PATCH /api/v1/tweets/:tweetId`
* `DELETE /api/v1/tweets/:tweetId`

### Subscriptions

* `POST /api/v1/subscriptions/toggle/:channelId`

---

## 🔥 Key Concepts Implemented

* Infinite scrolling (Intersection Observer)
* Optimistic UI updates
* Nested MongoDB population
* Real-time updates with Socket.io
* Secure route protection
* Scalable backend structure

---

## 🧠 Challenges Solved

* Duplicate data in infinite scroll
* Like/subscription state resetting
* Avatar & username population issues
* Playlist video management
* Real-time UI sync
* Efficient data fetching

---

## 📸 Future Improvements

* Video recommendations (AI-based)
* Drag & reorder playlist
* Video preview on hover
* Notifications system
* Dark/light theme toggle

---

## 👨‍💻 Author

**Md Kaif Alam**

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub!
