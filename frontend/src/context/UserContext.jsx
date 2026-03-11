import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const userDataContext = createContext()

function UserContext({ children }) {
  const serverUrl = "https://ai-virtual-assistant-backend-0p9y.onrender.com"
  const [userData, setUserData] = useState(null)
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  // Get current logged-in user
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
      setUserData(result.data)
      console.log("Current user:", result.data)
    } catch (error) {
      console.log("Error fetching current user:", error)
    }
  }

  // Ask Gemini AI
  const getGeminiResponse = async (command) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      )
      
      const data = res.data

      // Ensure the response is always in correct format
      return {
        type: data?.type || "general",
        userInput: data?.userInput || command,
        response: data?.response || "Sorry, I couldn't understand that."
      }
    } catch (error) {
      console.error("Error calling assistant:", error)
      return {
        type: "general",
        userInput: command,
        response: "Sorry, I cannot respond right now."
      }
    }
  }

  useEffect(() => {
    handleCurrentUser()
  }, [])

  const value = {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  }

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  )
}

export default UserContext
