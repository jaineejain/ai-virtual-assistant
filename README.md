# AI Virtual Assistant (MERN)

A JARVIS-style AI Virtual Assistant built using the MERN Stack (MongoDB, Express, React, Node.js) integrated with Gemini AI for intelligent responses and the Web Speech API for real-time voice interaction.

## Features
- Voice input and voice output using Web Speech API
- Smart AI replies powered by Gemini AI
- User authentication (JWT + bcryptjs)
- Upload custom assistant image (Cloudinary + Multer)
- Customize assistant name and branding
- Responsive frontend UI
- Full-stack deployment ready

## Tech Stack
**Frontend:** React (Vite), Web Speech API, Axios  
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, Multer, Cloudinary, Gemini/Groq API

## Project Structure
virtualAssistant/
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── index.js
│ ├── groq.js
│ └── package.json
├── frontend/
│ ├── public/
│ ├── src/
│ ├── index.html
│ └── package.json
└── README.md

## Installation

### Clone repository
git clone https://github.com/jaineejain/ai-voice-assistant.git
cd ai-voice-assistant

Backend setup
cd backend
npm install
npm run dev

Create .env file:
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key
CLOUDINARY_NAME=your_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret

Frontend setup
cd frontend
npm install
npm run dev
Usage
Open the frontend URL → Signup/Login → Start the assistant → Speak commands and receive AI responses.

Deployment
Backend: Render
Frontend: Vercel / Netlify
Database: MongoDB Atlas

Author
Jainee Jain
https://github.com/jaineejain
