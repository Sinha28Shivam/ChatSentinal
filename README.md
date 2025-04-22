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

### 🛡️ Auth Routes (`/api/v0/auth`)
| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| POST   | `/signup`             | Register a new user       |
| POST   | `/login`              | Login an existing user    |
| POST   | `/logout`             | Logout the user           |
| PUT    | `/update-profile`     | Update user details       |
| GET    | `/check`              | Check auth status         |
| DELETE | `/delete-account`     | Delete the user account   |

---

### 💬 Message Routes (`/api/v0/message`)
| Method | Endpoint              | Description                             |
|--------|-----------------------|-----------------------------------------|
| GET    | `/users`              | Fetch all available users (for sidebar) |
| GET    | `/:id`                | Get messages with a specific user       |
| POST   | `/send/:id`           | Send a message to a specific user       |

---

**📸 Screenshots**

![Screenshot 2025-04-23 022418](https://github.com/user-attachments/assets/4da85ce0-615c-4579-a332-01018b5044ee)
![Screenshot 2025-04-23 022348](https://github.com/user-attachments/assets/d262985c-b55c-4076-a516-877939ad1270)
![Screenshot 2025-04-23 022430](https://github.com/user-attachments/assets/959a913f-7185-4a8e-8bb5-7bd7ff01932a)



## 🛠️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/your-chat-app.git
   cd Real_Time_Chat

2. **Install the dependencies**
   ```bash
   npm install

3. **Configure the Enviroment**
   - Create a .env file at root inside the backend file with:
   - MONGODB_URI=Mongodb URL
   - PORT=3002
   - JWT_SECRET=secretkey
 
 *Cloudinary Api key*
   - CLOUD_NAME=xxxxxxx
   - API_KEY=xxxxxxxx
   - API_SECRET=xxxxxxx
   - API_ENVIORMENT_VARIABLE=CLOUDINARY_URL=xxxxxxxxx
   - NODE_ENV=development

4. **Start the backend server**
     ```bash
     - npm run dev

5. **Start the frontend Server**
   ```bash
   - npm run dev
