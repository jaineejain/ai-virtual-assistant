import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Menu,
  LogOut,
  Settings,
  X,
  Clock,
  CloudRain,
  Youtube,
  Calculator,
} from "lucide-react";

function Home() {

  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [typing, setTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const synth = window.speechSynthesis;

  /* LOGOUT */
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }

    setUserData(null);
    navigate("/signin");
  };

  /* SPEAK FUNCTION */
  const speak = (text) => {

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    isSpeakingRef.current = true;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setAiText("");
      setTyping(false);
    };

    synth.cancel();
    synth.speak(utterance);
  };

  /* GREETING WHEN APP OPENS */
  useEffect(() => {

    if (!userData) return;

    const hour = new Date().getHours();

    let greeting = "";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";

    speak(
      `${greeting} ${userData?.userName}. I am ${userData?.assistantName}. How can I help you?`
    );

  }, [userData]);

  /* COMMAND ACTION HANDLER */
  const handleAssistantAction = async (data) => {

    switch (data.type) {

      case "time":
        speak(`Current time is ${new Date().toLocaleTimeString()}`);
        break;

      case "date":
        speak(`Today is ${new Date().toDateString()}`);
        break;

      case "youtube-open":
      case "youtube":
        window.open("https://www.youtube.com", "_blank");
        speak("Opening YouTube");
        break;

      case "youtube-search":
        window.open(
          `https://www.youtube.com/results?search_query=${data.userInput}`,
          "_blank"
        );
        break;

      case "google-search":
        window.open(
          `https://www.google.com/search?q=${data.userInput}`,
          "_blank"
        );
        break;

      case "calculator-open":
      case "calculator":
        window.open(
          "https://www.google.com/search?q=calculator",
          "_blank"
        );
        speak("Opening calculator");
        break;

      case "open-github":
        window.open("https://github.com", "_blank");
        speak("Opening GitHub");
        break;

      case "open-chatgpt":
        window.open("https://chat.openai.com", "_blank");
        speak("Opening ChatGPT");
        break;

      case "play-music":
        window.open("https://open.spotify.com", "_blank");
        speak("Playing music");
        break;

      case "open-site":
        if (data.site) {
          window.open(`https://${data.site}.com`, "_blank");
        }
        break;

      case "weather":

        try {

          const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=YOUR_OPENWEATHER_API_KEY&units=metric`
          );

          const temp = res.data.main.temp;
          const desc = res.data.weather[0].description;

          speak(
            `The weather in ${res.data.name} is ${desc} with temperature ${temp} degree celsius`
          );

        } catch {
          speak("Sorry I could not fetch weather right now.");
        }

        break;

      default:
        break;
    }
  };

  /* PROCESS AI RESPONSE */
  const processCommand = async (text) => {

    setTyping(true);

    const apiResponse = await getGeminiResponse(text);

    let data = apiResponse;

    if (typeof apiResponse === "string") {

      try {
        data = JSON.parse(apiResponse);
      } catch {
        data = { type: "general", response: apiResponse };
      }

    }

    const responseText = data.response || "";

    setChatHistory((prev) => [
      ...prev,
      { sender: "user", text },
      { sender: "assistant", text: responseText },
    ]);

    setAiText(responseText);

    speak(responseText);

    handleAssistantAction(data);
  };

  /* VOICE RECOGNITION */
  useEffect(() => {

    if (!userData) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    recognition.onresult = async (e) => {

      const transcript =
        e.results[e.results.length - 1][0].transcript.trim();

      setUserText(transcript);

      /* RESPOND ONLY IF ASSISTANT NAME IS SPOKEN */

      if (
        !transcript
          .toLowerCase()
          .includes(userData.assistantName.toLowerCase())
      )
        return;

      processCommand(transcript);
    };

    recognition.start();

    return () => recognition.stop();

  }, [userData]);

  /* QUICK BUTTON ACTIONS */
  const handleQuickAction = (actionText) => {

    setUserText(actionText);

    processCommand(actionText);

  };

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-black via-[#05053f] to-[#02023d] flex flex-col text-white relative overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute w-100 h-100 bg-blue-600/20 blur-[140px] -top-25 -left-25" />
      <div className="absolute w-100 h-100 bg-purple-600/20 blur-[140px] -bottom-25 -right-25" />

      {/* HEADER */}
      <div className="w-full flex items-center justify-between px-10 py-4 z-10">

        <h1 className="text-2xl font-semibold tracking-wide">
          AI Assistant
        </h1>

        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          <Menu size={26} />
        </button>

      </div>

      {/* SIDE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#0b0b2e] border-l border-white/10 shadow-2xl transform transition-transform duration-300 z-20 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >

        <div className="flex justify-between items-center p-5 border-b border-white/10">

          <h2 className="font-semibold text-lg">Menu</h2>

          <button onClick={() => setMenuOpen(false)}>
            <X size={22} />
          </button>

        </div>

        <div className="p-5 flex flex-col gap-4">

          <button
            onClick={() => navigate("/customize")}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition"
          >
            <Settings size={18} />
            Customize Assistant
          </button>

          <button
            onClick={handleLogOut}
            className="flex items-center gap-3 bg-red-500/80 hover:bg-red-500 p-3 rounded-xl transition"
          >
            <LogOut size={18} />
            Log Out
          </button>

        </div>

        <div className="p-5">

          <h3 className="font-semibold mb-4 text-gray-300">
            History
          </h3>

          <div className="h-72 overflow-y-auto text-sm text-gray-300 space-y-2 pr-2">

            {chatHistory.map((msg, idx) => (

              <div
                key={idx}
                className={
                  msg.sender === "user"
                    ? "text-right text-blue-400"
                    : "text-left text-green-400"
                }
              >
                {msg.text}
              </div>

            ))}

          </div>

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col items-center pt-6 pb-8 px-6 gap-6 relative z-10">

        {/* ASSISTANT CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-8 py-6 shadow-2xl flex flex-col items-center gap-4">

          <div className="overflow-hidden rounded-2xl shadow-xl">

            <img
              src={userData?.assistantImage}
              alt="assistant"
              className="w-62.5 h-62.5 lg:w-62.5 lg:h-75 object-cover"
            />

          </div>

          <div className="flex flex-col items-center">

            <h1 className="text-2xl font-bold tracking-wide">
              I'm {userData?.assistantName}
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              Your personal AI voice assistant
            </p>

            <div className="flex items-center gap-2 mt-2 text-green-400 text-sm">

              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />

              Listening...

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">

          <button
            onClick={() => handleQuickAction("assistant time")}
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:scale-105 transition px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Clock size={18} />
            Time
          </button>

          <button
            onClick={() => handleQuickAction("assistant weather")}
            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:scale-105 transition px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <CloudRain size={18} />
            Weather
          </button>

          <button
            onClick={() => handleQuickAction("assistant open youtube")}
            className="bg-linear-to-r from-purple-600 to-pink-600 hover:scale-105 transition px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Youtube size={18} />
            YouTube
          </button>

          <button
            onClick={() => handleQuickAction("assistant open calculator")}
            className="bg-linear-to-r from-blue-500 to-cyan-500 hover:scale-105 transition px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Calculator size={18} />
            Calculator
          </button>

        </div>

        {/* CHAT AREA */}
        <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-3 h-70 overflow-y-auto">

          {chatHistory.map((msg, idx) => (

            <div
              key={idx}
              className={`p-3 rounded-xl max-w-[70%] ${
                msg.sender === "user"
                  ? "self-end bg-blue-600"
                  : "self-start bg-indigo-600"
              }`}
            >
              {msg.text}
            </div>

          ))}

          {typing && (

            <div className="self-start p-3 rounded-xl bg-indigo-600 animate-pulse">

              {userData?.assistantName} is typing...

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Home;