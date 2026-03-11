// Import dotenv to access environment variables
import dotenv from "dotenv"
// Load variables from .env file
dotenv.config()

// Import OpenAI client from Groq package
import OpenAI from "openai"

/**
 * Initialize Groq client
 * Use GROQ_API_KEY from environment variables
 */
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,               // Your Groq API key
  baseURL: "https://api.groq.com/openai/v1"// Groq API endpoint
})

/**
 * groqResponse
 * Sends a user command to the Groq AI assistant and returns the AI response
 * @param {string} command - User input
 * @param {string} assistantName - Name of the assistant
 * @param {string} userName - Name of the user
 */
const groqResponse = async (command, assistantName, userName) => {
  try {
    // Ensure the API key is set
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY missing in .env")
    }

    // Construct a prompt for the AI assistant
    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
You are not Google. You will now behave as a voice-enabled assistant.

Respond ONLY in JSON:

{
"type": "general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month" | "calculator-open" | "instagram-open" | "facebook-open" | "weather-show",
"userInput": "<original input>",
"response": "<short reply>"
}

User input: "${command}"`

    // Send prompt to Groq chat API
    const completion = await groq.chat.completions.create({
      model: "groq/compound",                // Groq model to use
      messages: [{ role: "user", content: prompt }],  // User message
    })

    // Return the AI's response content or null if missing
    return completion.choices[0].message.content || null
  } catch (error) {
    // Log any errors from Groq API
    console.error("Groq API Error:", error.message || error)
    return null
  }
}

// Export the groqResponse function for use in controllers
export default groqResponse
