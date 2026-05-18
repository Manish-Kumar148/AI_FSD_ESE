# AI-Based Employee Performance Analytics & Recommendation System

This is a Full-Stack MERN application designed for HR and Admins to track employee performance, manage skills, and generate unbiased, AI-driven recommendations for promotions and training. It was built as a practical exam submission for the AI Driven Full Stack Development course.

## 🚀 Live Demo
- **Frontend URL:** [https://ese-frontend-5532.onrender.com](https://ese-frontend-5532.onrender.com)
- **Backend API URL:** [https://ese-backend-464.onrender.com](https://ese-backend-464.onrender.com)

## ✨ Features
- **Secure Authentication:** JWT-based login and registration with bcrypt password hashing.
- **Employee Management:** Full CRUD capabilities to add, view, and delete employee records.
- **Smart Filtering:** Search employees by name or filter them by specific departments in real-time.
- **AI Recommendations:** Integration with OpenRouter (OpenAI-compatible APIs) to generate:
  - Promotion Analysis
  - Targeted Training Plans
  - General Performance Feedback
  - Overall Employee Rankings
- **Premium UI/UX:** Responsive, glassmorphism-styled user interface built with TailwindCSS and Framer Motion.

## 🛠️ Technology Stack
- **Frontend:** React.js, Vite, TailwindCSS (v4), React Router DOM, Axios, Framer Motion
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), Mongoose, Axios
- **Database:** MongoDB Atlas
- **AI Integration:** OpenRouter API (GPT models)
- **Deployment:** Render (Static Site & Web Service)

## 💻 Running Locally

### Prerequisites
- Node.js (v18+)
- A MongoDB Cluster URI
- An OpenRouter API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Manish-Kumar148/AI_FSD_ESE.git
   cd AI_FSD_ESE
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file inside the `backend` folder and add your keys:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   AI_API_KEY=your_openrouter_api_key
   ```
   Start the backend server:
   ```bash
   node server.js
   ```

3. **Setup the Frontend:**
   Open a new terminal window and navigate to the frontend folder.
   ```bash
   cd frontend
   npm install
   ```
   Start the React development server:
   ```bash
   npm run dev
   ```

4. **View the App:**
   Open your browser and navigate to `http://localhost:5173`.
