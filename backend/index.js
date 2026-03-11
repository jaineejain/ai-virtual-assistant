// Import dotenv to access environment variables from .env file
import dotenv from "dotenv"
dotenv.config()

// Import CORS middleware to handle cross-origin requests
import cors from "cors"

// Import express framework
import express from "express"

// Import cookie-parser to parse cookies from requests
import cookieParser from "cookie-parser"

// Import function to connect to MongoDB
import connectDb from "./config/db.js"

// Import route modules
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"

// Initialize Express app
const app = express()

/**
 * Middleware
 */

// Enable CORS for frontend (change origin to your frontend URL in production)
app.use(cors({
  origin: "https://ai-virtual-assistant-qvkl.onrender.com",  // Frontend origin
  credentials: true                 // Allow cookies to be sent
}))

// Parse incoming JSON requests
app.use(express.json())

// Parse cookies from incoming requests
app.use(cookieParser())

/**
 * Routes
 */

// Mount authentication routes at /api/auth
app.use("/api/auth", authRouter)

// Mount user-related routes at /api/user
app.use("/api/user", userRouter)

/**
 * Start server
 */
const port = process.env.PORT || 5000
app.listen(port, () => {
  // Connect to MongoDB once server starts
  connectDb()

  console.log("server started on port", port)
})
