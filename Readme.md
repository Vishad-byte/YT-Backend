# 🚀 YouTweet Backend
A 🔧 Node.js backend API for a social video + tweeting platform, built with Express, MongoDB, and Mongoose.

✨ Features
👤 User registration, authentication (JWT), and profile management

🎥 Video upload, update, publish/unpublish, and delete

🐦 Tweet (microblog) creation, update, and delete

❤️ Like and 🔔 subscription system for videos, tweets, and comments

🎞️ Playlist creation and management

📊 Channel dashboard with stats and video listing

☁️ File uploads with Multer and Cloudinary

🔐 Secure endpoints with JWT authentication

🛠 Tech Stack
Node.js & Express 🚂 – Backend framework

MongoDB & Mongoose 🍃 – Database & ODM

JWT 🔑 – Authentication

Multer 📸 – File uploads

Cloudinary ☁️ – Media storage

Prettier ✨ – Code formatting

RESTful APIs  - Clean and scalable endpoint design

⚙️ Getting Started
✅ Prerequisites
🟢 Node.js (v18+ recommended)

🍃 MongoDB (local/cloud)

☁️ Cloudinary account

📦 Installation
Clone the repository:

git clone https://github.com/yourusername/youtweet-backend.git
cd youtweet-backend

Install dependencies:

npm install
Setup environment variables:

Create a .env file in the root directory and add:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Run the server:

bash
Copy
Edit
npm run dev
🌐 Server starts at: http://localhost:5000 (or your specified port)

📡 API Overview

👤 Users
POST /api/v1/users/register – Register a new user

POST /api/v1/users/login – Login and receive JWT tokens

POST /api/v1/users/logout – Logout user

POST /api/v1/users/refresh-token – Refresh access token

POST /api/v1/users/change-password – Change current password

GET /api/v1/users/current-user – Get current user profile

PATCH /api/v1/users/update-account – Update user profile

PATCH /api/v1/users/avatar – Update user avatar

PATCH /api/v1/users/cover-image – Update user cover image

GET /api/v1/users/c/:username – Get user channel profile

GET /api/v1/users/history – Get user watch history

🐦 Tweets
POST /api/v1/create-tweet – Create a tweet

GET /api/v1/tweet/get-user-tweets/:userId – Get tweets by user

PATCH /api/v1/update-tweet/:tweetId – Update a tweet

DELETE /api/v1/delete-tweet/:tweetId – Delete a tweet

💬 Comments
GET /api/v1/comments/get-video-comments/:videoId – Get comments for a video

POST /api/v1/comments/add-comment/:videoId – Add a comment

PATCH /api/v1/comments/update-comment/:commentId – Update a comment

DELETE /api/v1/comments/delete-comment/:commentId – Delete a comment

❤️ Likes
POST /api/v1/likes/toggle-like/v/:videoId – Like/unlike a video

POST /api/v1/likes/toggle-like/c/:commentId – Like/unlike a comment

POST /api/v1/likes/toggle-like/t/:tweetId – Like/unlike a tweet

GET /api/v1/likes/liked-videos – Get liked videos for user

🎥 Videos
GET /api/v1/videos/get-all-videos – List all videos

POST /api/v1/videos/publish-video– Upload and publish a video

GET /api/v1/videos/get-video-by-id/:videoId – Get video by ID

PATCH /api/v1/videos/update-video/:videoId – Update video details

DELETE /api/v1/videos/delete-video/:videoId – Delete a video

PATCH /api/v1/videos/toggle/publish/:videoId – Publish/unpublish

🔔 Subscriptions
POST /api/v1/subscriptions/channel/:channelId – Subscribe/unsubscribe to a channel

GET /api/v1/subscriptions/get-channel-subscribers/:channelId – Get subscribers of a channel

GET /api/v1/subscriptions/get-subscribed-channels/:subscriberId – Get user's subscriptions

🎞️ Playlists
POST /api/v1/playlists/create-playlist – Create a playlist

GET /api/v1/playlists/user-playlists/:userId – Get user playlists

GET /api/v1/playlists/playlist-by-id/:playlistID – Get playlist details

PATCH /api/v1/playlists/add-video-to-playlist/:playlistId/:videoId – Add video to playlist

PATCH /api/v1/playlists/remove-video-from-playlist/:playlistId/:videoId – Remove video from playlist

DELETE /api/v1/playlists/delete-playlist/:playlistId – Delete playlist

PATCH /api/v1/playlists/update-playlist/:playlistId – Update playlist

📊 Dashboard
GET /api/v1/dashboard/channel-stats/:channelId – Get channel stats

GET /api/v1/dashboard/channel-videos/:channelId – Get all channel videos

❤️‍🩹 Healthcheck
GET /api/v1/healthcheck/hc – Healthcheck endpoint

🗂️ Project Structure

src/
  controllers/
  models/
  routes/
  middlewares/
  utils/
  index.js
.env
package.json

🧑‍💻 Author: Vishad Srivastava