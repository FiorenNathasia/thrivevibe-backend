# ThriveVibe Backend 🎥✨

Backend API for the ThriveVibe crowdsourced video feedback platform.
Manages user authentication, video and prompt submissions, feedback aggregation, and serves data to the frontend.

**Project's Frontend:** https://github.com/FiorenNathasia/thrivevibe-frontend

---

## 🚀 Features

- RESTful API built with Express.js
- User authentication using JWT and OAuth
- PostgreSQL database for storing videos, prompts, votes, and comments
- Efficient centralization of feedback data for dashboard display
- Transcript extraction and processing for workout videos
- Supports creation and management of videos, prompts, and user feedback

---

## Endpoints

- `POST /api/auth/signup` – Registers a new user
- `POST /api/auth/login` – Logs in an existing user
- `GET /api/user` – Returns the current user's information
- `POST /api/videos` – Saves a new workout video from a YouTube URL and transcribes it
- `GET /api/videos` – Returns all workout videos for the current user
- `Supports optional query: filterFavourites=true ` - to return only favourites
- `GET /api/videos/:id` – Returns a specific workout video by ID
- `PUT /api/videos/:id` – Edits a specific workout video
- `DELETE /api/videos/:id` – Deletes a specific workout video by ID
- `PUT /api/videos/:id/favourite` – Updates the is_favourite status of a workout
- `PUT /api/videos/:id/upvote` – Increments the upvote count for a video
- `PUT /api/videos/:id/downvote` – Increments the downvote count for a video
- `GET /api/feed` – Returns recent videos from other users
- `POST /api/videos/:id/comments` – Adds a comment to a specific video
- `GET /api/videos/:id/comments` – Returns all comments for a specific video

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **JWT (OAuth)** for secure authentication

---
