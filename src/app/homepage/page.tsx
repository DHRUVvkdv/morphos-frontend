"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{type: string, message: string}>>([
    {type: "bot", message: "Hello! I'm your fitness assistant. Ask me anything about workouts that would be best for you."}
  ]);

  // Sample workout data
  const workouts = [
    {
      id: "bicep-curl",
      name: "Bicep Curl",
      description: "Build arm strength with this classic exercise",
      difficulty: "Beginner",
      equipment: "Dumbbells",
    },
    {
      id: "squats",
      name: "Squats",
      description: "Strengthen your lower body and core",
      difficulty: "Beginner",
      equipment: "None",
    },
    {
      id: "push-ups",
      name: "Push-ups",
      description: "Full upper body workout",
      difficulty: "Intermediate",
      equipment: "None",
    },
    {
      id: "plank",
      name: "Plank",
      description: "Core stability and strength",
      difficulty: "Beginner",
      equipment: "None",
    },
    {
      id: "deadlift",
      name: "Deadlift",
      description: "Build posterior chain strength",
      difficulty: "Advanced",
      equipment: "Barbell",
    }
  ];

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim() === "") return;

    // Add user message to chat history
    setChatHistory([...chatHistory, {type: "user", message: chatMessage}]);
    
    // Placeholder for LLM response (to be implemented later)
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        type: "bot", 
        message: "This is a placeholder response. In the future, I'll connect to an LLM to provide personalized workout recommendations based on your question."
      }]);
    }, 500);
    
    setChatMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 bg-opacity-90">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Morphos
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white">Profile</button>
            <button className="text-gray-300 hover:text-white">Settings</button>
            <button className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Three-column Layout */}
      <main className="flex flex-grow">
        {/* Left Sidebar - Available Workouts */}
        <aside className="w-64 bg-gray-800 bg-opacity-50 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Available Workouts</h2>
            <div className="space-y-2">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedWorkout === workout.id
                      ? "bg-indigo-900 ring-1 ring-blue-500"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => setSelectedWorkout(workout.id)}
                >
                  <h3 className="font-medium">{workout.name}</h3>
                  <p className="text-gray-400 text-xs mt-1">
                    {workout.description}
                  </p>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-blue-400">
                      {workout.difficulty}
                    </span>
                    <span className="text-purple-400">
                      {workout.equipment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedWorkout && (
              <div className="mt-4">
                {/* <Link href={`/workout/${selectedWorkout}`}> */}
                <Link href={"/coach"}>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md font-medium hover:from-blue-600 hover:to-indigo-700 transition duration-300">
                    Start Workout
                  </button>
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Middle Area - Chatbot */}
        <div className="flex-grow flex flex-col p-6">
          <div className="flex-grow flex flex-col bg-gray-800 bg-opacity-50 rounded-xl p-4 mb-6 overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Fitness Assistant</h2>
            
            {/* Chat History Area */}
            <div className="flex-grow overflow-y-auto mb-4 space-y-4 p-2">
              {chatHistory.map((chat, index) => (
                <div 
                  key={index} 
                  className={`${
                    chat.type === "user" 
                      ? "ml-auto bg-blue-600 rounded-tl-lg rounded-tr-lg rounded-bl-lg" 
                      : "mr-auto bg-gray-700 rounded-tr-lg rounded-tl-lg rounded-br-lg"
                  } max-w-[80%] p-3`}
                >
                  {chat.message}
                </div>
              ))}
            </div>
            
            {/* Chat Input Area */}
            <form onSubmit={handleChatSubmit} className="flex">
              <input
                type="text"
                className="flex-grow bg-gray-700 rounded-l-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Ask about recommended workouts..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-blue-600 px-4 rounded-r-md hover:from-purple-600 hover:to-blue-700"
              >
                Send
              </button>
            </form>
          </div>

          {/* Analytics Button */}
          <Link href="/analytics">
            <div className="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-xl p-6 flex items-center justify-between hover:from-indigo-700 hover:to-purple-800 transition-colors shadow-lg cursor-pointer">
              <div>
                <h2 className="text-2xl font-bold mb-1">Your Fitness Insights</h2>
                <p className="text-gray-300">View your personal workout analytics and progress</p>
              </div>
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-4">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 MotionMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}