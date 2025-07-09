# 🚀 YouTweet Backend

A **RESTful Node.js backend API** for a modern social video streaming platform 🧿 with integrated microblogging via tweets 🐦.
Built using **Node.js**, **Express**, and **MongoDB**, it supports user interaction through videos, tweets, likes, comments, and playlists — all with efficient data querying and real-time updates.

---

## 🧩 Overview

YouTweet is the backend for a video streaming platform enhanced with a tweet-based microblogging feature. It enables users to upload and watch videos, interact through likes and comments, tweet short posts, subscribe to channels, and manage playlists. It also provides real-time analytics for creators.

The backend is powered by **Node.js + Express**, with **MongoDB** as the NoSQL database, and leverages **MongoDB Aggregation Pipelines**, pagination, and optimized queries to ensure fast and efficient data handling.

---

## 🔥 Core Features

* 👤 User authentication: Login, register, update profile, and manage sessions (JWT-based)
* 🎥 Video upload, edit, delete, publish/unpublish, and streaming support
* 💬 Comments and ❤️ likes on videos, tweets, and comments for community engagement
* 🐦 Tweet creation, update, and deletion for microblogging features
* 🎞️ Playlist creation, update, delete, and video management within playlists
* 🔔 Subscription system to follow channels
* 📊 Channel dashboard with statistics and video listings
* 🔁 RESTful API endpoints for clean frontend integration
* 🧰 Middleware-based request validation and global error handling
* 📈 Optimized querying with:

  * MongoDB Aggregation Pipelines
  * Pagination & filtering support
  * Efficient indexed query execution for faster performance

---

## 🧰 Tech Stack

| Tool         | Purpose                                         |
| ------------ | ----------------------------------------------- |
| **Node.js**  | JavaScript runtime for backend development      |
| **Express**  | Web framework for routing and middleware        |
| **MongoDB**  | NoSQL database for flexible data storage        |
| **Mongoose** | ODM to define schemas and interact with MongoDB |
| **JWT**      | Secure user authentication and authorization    |
| **Multer**   | Handling file uploads like videos and images    |

---

## 🏗️ Installation

### 🔹 Prerequisites

* 🖥️ Node.js (v16 or later recommended)
* 💾 MongoDB (local or MongoDB Atlas)

### 🔧 Setup Instructions

1️⃣ **Clone the repository**

```bash
git clone https://github.com/Cypher2801/YtBackend.git
cd YtBackend
```

2️⃣ **Install dependencies**

```bash
npm install
```

3️⃣ **Configure environment variables**
Create a `.env` file in the root directory and add:

```
PORT=8000
MONGO_DB_URL=your-mongodb-uri
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your-secret-key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4️⃣ **Run the server**

For production:

```bash
npm start
```

For development:

```bash
npm run dev
```

---

## 📡 API Overview

### 👤 Users

* `POST /api/v1/users/register` - User registration
* `POST /api/v1/users/login` - User login
* `POST /api/v1/users/logout` - User lout
* `POST /api/v1/users/refresh-token` - Refresh Access Token
* `POST /api/v1/users/change-password` - Change Password
* `GET /api/v1/users/current-user` - Get User current profile
* `PATCH /api/v1/users/update-account` - Update user profile
* `PATCH /api/v1/users/avatar` - Update user avatar
* `PATCH /api/v1/users/cover-image` - Update cover image
* `GET /api/v1/users/c/:username` - Get user channel profile
* `GET /api/v1/users/history` - Get user watch history

### 🐦 Tweets

* `POST /api/v1/create-tweet` - Create a tweet 
* `GET /api/v1/tweet/get-user-tweets/:userId` - Get all user tweets
* `PATCH /api/v1/update-tweet/:tweetId` - Update a tweet
* `DELETE /api/v1/delete-tweet/:tweetId` - Delete a tweet

### 💬 Comments

* `GET /api/v1/comments/get-video-comments/:videoId` - Get comment of vid
* `POST /api/v1/comments/add-comment/:videoId` - Add a comment
* `PATCH /api/v1/comments/update-comment/:commentId` - Update a comment
* `DELETE /api/v1/comments/delete-comment/:commentId` - Delete a comment

### ❤️ Likes

* `POST /api/v1/likes/toggle-like/v/:videoId` - Like/unlike a video
* `POST /api/v1/likes/toggle-like/c/:commentId` - Like/unlike a comment
* `POST /api/v1/likes/toggle-like/t/:tweetId` - Like/unlike a tweet
* `GET /api/v1/likes/liked-videos` - Get liked videos for user

### 🎥 Videos

* `GET /api/v1/videos/get-all-videos` - List all videos
* `POST /api/v1/videos/publish-video` -  Upload and publish a video
* `GET /api/v1/videos/get-video-by-id/:videoId` - Get video by ID
* `PATCH /api/v1/videos/update-video/:videoId` - Update video details
* `DELETE /api/v1/videos/delete-video/:videoId` - Delete a video
* `PATCH /api/v1/videos/toggle/publish/:videoId`- Publish/unpublish

### 🔔 Subscriptions

* `POST /api/v1/subscriptions/channel/:channelId` - Subscribe/unsubscribe to a channel
* `GET /api/v1/subscriptions/get-channel-subscribers/:channelId` - Get subscribers of a channel
* `GET /api/v1/subscriptions/get-subscribed-channels/:subscriberId`- Get user's subscriptions

### 🎞️ Playlists

* `POST /api/v1/playlists/create-playlist` - Create a playlist
* `GET /api/v1/playlists/user-playlists/:userId` - Get user playlists
* `GET /api/v1/playlists/playlist-by-id/:playlistId` - Get playlist details
* `PATCH /api/v1/playlists/add-video-to-playlist/:playlistId/:videoId` - Add video to playlist
* `PATCH /api/v1/playlists/remove-video-from-playlist/:playlistId/:videoId` -  Remove video from playlist
* `DELETE /api/v1/playlists/delete-playlist/:playlistId` - Delete playlist
* `PATCH /api/v1/playlists/update-playlist/:playlistId` - Update playlist

### 📊 Dashboard

* `GET /api/v1/dashboard/channel-stats/:channelId` - Get channel stats
* `GET /api/v1/dashboard/channel-videos/:channelId` - Get all channel videos

### ❤️‍🩹 Healthcheck

* `GET /api/v1/healthcheck/hc` - Healthcheck endpoint

---

## 🗂️ Project Structure

```
src/
├── controllers/      # Request handlers
├── models/           # Mongoose schemas
├── routes/           # API route definitions
├── middlewares/      # Auth, error handling, etc.
├── utils/            # Utility functions
└── index.js          # App entry point
.env
package.json
```

---

## 💡 Highlights on Database Optimization

* ⚡ **MongoDB Aggregation Pipelines**: For efficient data transformation, grouping, filtering, and analytics
* 🔍 **Pagination & Filtering**: Used in listings to improve response times and user experience
* ⚙️ **Optimized Queries**: Leveraging indexes and query best practices for scalability and speed

