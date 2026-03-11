// Import helper function to generate JWT tokens
import genToken from "../config/token.js"

// Import User model to interact with MongoDB
import User from "../models/user.model.js"

// Import bcryptjs for password hashing and comparison
import bcrypt from "bcryptjs"

/**
 * SIGN UP CONTROLLER
 * Handles user registration
 */
export const signUp = async (req, res) => {
  try {
    // Destructure name, email, and password from request body
    const { name, email, password } = req.body

    // Check if email already exists in the database
    const existEmail = await User.findOne({ email })
    if (existEmail) {
      return res.status(400).json({ message: "email already exists !" })
    }

    // Validate password length (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({ message: "password must be at least 6 characters !" })
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    // Generate JWT token for the new user
    const token = await genToken(user._id)

    // Send the token in a cookie to the client
    // sameSite: "lax" prevents CSRF issues
    res.cookie("token", token, {
      httpOnly: true,                       // Cannot access cookie via JS
      maxAge: 7 * 24 * 60 * 60 * 1000,      // Cookie expires in 7 days
      sameSite: "None",                       // Security measure
      secure: true                           // Set true in production with HTTPS
    })

    // Respond with the created user data
    return res.status(201).json(user)

  } catch (error) {
    // Catch and return server errors
    return res.status(500).json({ message: `sign up error ${error}` })
  }
}

/**
 * LOGIN CONTROLLER
 * Handles user login
 */
export const Login = async (req, res) => {
  try {
    // Destructure email and password from request body
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "email does not exists !" })
    }

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password" })
    }

    // Generate JWT token for the user
    const token = await genToken(user._id)

    // Send token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
      sameSite: "none",                  // Security measure
      secure: true
    })

    // Respond with user data
    return res.status(200).json(user)

  } catch (error) {
    // Catch and return server errors
    return res.status(500).json({ message: `login error ${error}` })
  }
}

/**
 * LOGOUT CONTROLLER
 * Clears the authentication cookie
 */
export const logOut = async (req, res) => {
  try {
    // Clear the 'token' cookie on logout
    res.clearCookie("token", {
      sameSite: "lax",   // Must match cookie options from login
      secure: false
    })

    // Respond with success message
    return res.status(200).json({ message: "log out successfully" })
  } catch (error) {
    // Catch and return server errors
    return res.status(500).json({ message: `logout error ${error}` })
  }
}
