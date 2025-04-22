# 💬 Chatting Application

This is a real-time chatting application that allows users to interact and communicate with others securely and instantly.

---

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js, WebSocket, MongoDB  
- **Frontend**: React.js

---

## ✨ Features

- 🔐 User Authentication (Signup, Login, Logout)
- 🧑‍💼 Update & Delete Profile
- 📬 Real-time messaging using WebSocket
- 🧍 Sidebar to show available users
- 🔄 Token-based session management

---

## 📡 API Endpoints

### 🛡️ Auth Routes (`/api/auth`)
| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| POST   | `/signup`             | Register a new user       |
| POST   | `/login`              | Login an existing user    |
| POST   | `/logout`             | Logout the user           |
| PUT    | `/update-profile`     | Update user details       |
| GET    | `/check`              | Check auth status         |
| DELETE | `/delete-account`     | Delete the user account   |

---

### 💬 Message Routes (`/api/message`)
| Method | Endpoint              | Description                             |
|--------|-----------------------|-----------------------------------------|
| GET    | `/users`              | Fetch all available users (for sidebar) |
| GET    | `/:id`                | Get messages with a specific user       |
| POST   | `/send/:id`           | Send a message to a specific user       |

---

## 🛠️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/your-chat-app.git
   cd Real_Time_Chat
   npm install
    
