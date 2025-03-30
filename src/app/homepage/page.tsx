"use client";

import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import { useUser } from "@/backend/userProvider";
import Image from "next/image";

export default function HomePage() {
    const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
    const [chatMessage, setChatMessage] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { type: "bot", message: "Hello! I'm your fitness assistant. Ask me anything about workouts that would be best for you." }
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { logout } = useUser();

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    // Sample workout data
    const workouts: Workout[] = [
        {
            id: "tpose",
            name: "T-Pose",
            description: "Calibration pose to measure your movement range",
            difficulty: "Beginner",
            equipment: "None",
        },
        {
            id: "bicep-curl",
            name: "Bicep Curl",
            description: "Build arm strength with this classic exercise",
            difficulty: "Beginner",
            equipment: "Dumbbells",
        },
        {
            id: "squat",
            name: "Squat",
            description: "Strengthen your lower body and core",
            difficulty: "Beginner",
            equipment: "None",
        },
        {
            id: "lateral-raise",
            name: "Lateral Raise",
            description: "Develop shoulder strength and stability",
            difficulty: "Intermediate",
            equipment: "Dumbbells",
        },
        {
            id: "plank",
            name: "Plank",
            description: "Core stability and strength",
            difficulty: "Beginner",
            equipment: "None",
        }
    ];

    // Define the workout type
    interface Workout {
        id: string;
        name: string;
        description: string;
        difficulty: string;
        equipment: string;
    }

    // Define the chat message type
    interface ChatMessage {
        type: string;
        message: string;
    }

    // Define API response type
    interface ApiResponse {
        message?: string;
        error?: string;
        details?: string;
    }

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (chatMessage.trim() === "" || isLoading) return;

        // Add user message to chat history
        setChatHistory(prev => [...prev, { type: "user", message: chatMessage } as ChatMessage]);

        // Store the message to clear the input field
        const message = chatMessage;
        setChatMessage("");

        // Show loading indicator
        setIsLoading(true);

        try {
            // Call the Gemini API route with the workouts data
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userMessage: message,
                    workouts: workouts as Workout[]  // Pass the workouts to the API with type
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json() as ApiResponse;

            // Add AI response to chat history
            setChatHistory(prev => [...prev, {
                type: "bot",
                message: data.message || "Sorry, I couldn't generate a response."
            } as ChatMessage]);

            // Only call highlightRecommendedWorkouts if data.message exists
            if (data.message) {
                highlightRecommendedWorkouts(data.message);
            }

        } catch (error: any) {
            console.error('Error communicating with AI:', error);
            setChatHistory(prev => [...prev, {
                type: "bot",
                message: "Sorry, I'm having trouble connecting right now. Please try again later."
            } as ChatMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to highlight workouts mentioned in the AI response
    const highlightRecommendedWorkouts = (message: string): void => {
        if (!message) return;

        // Check if any workout names are mentioned in the response
        for (const workout of workouts) {
            if (message.toLowerCase().includes(workout.name.toLowerCase())) {
                setSelectedWorkout(workout.id);
                // Break after finding the first match, or remove this to highlight the last match
                break;
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-950 text-white flex flex-col">
            {/* Header with improved styling */}
            <header className="border-b border-gray-800 bg-gray-900 bg-opacity-90 sticky top-0 z-50 shadow-md">
                <div className="container mx-auto px-0 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <img
                            src="/logo.png"
                            alt="Morphos Logo"
                            width={32}
                            height={32}
                            className="rounded-md"
                        />
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-600">
                            Morphos
                        </span>
                    </div>
                    <nav className="flex items-center space-x-6">
                        <Link href="/profile">
                            <span className="text-gray-300 hover:text-white transition-colors font-medium">Profile</span>
                        </Link>
                        <button onClick={handleLogout} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors font-medium shadow-sm">
                            Sign Out
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content - More balanced three-column Layout */}
            <main className="flex flex-grow w-full">
                {/* Left Sidebar - Available Workouts with refined styling */}
                <aside className="w-72 bg-gray-800 bg-opacity-60 overflow-y-auto border-r border-gray-800 pl-0">
                    <div className="p-5">
                        <h2 className="text-xl font-semibold mb-5 text-blue-400 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Available Workouts
                        </h2>
                        <div className="space-y-3">
                            {workouts.map((workout) => (
                                <div
                                    key={workout.id}
                                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:translate-x-1 ${selectedWorkout === workout.id
                                        ? "bg-gradient-to-r from-indigo-900 to-indigo-800 ring-1 ring-blue-500 shadow-lg"
                                        : "bg-gray-800 hover:bg-gray-700 shadow"
                                        }`}
                                    onClick={() => setSelectedWorkout(workout.id)}
                                >
                                    <h3 className="font-medium text-lg">{workout.name}</h3>
                                    <p className="text-gray-400 text-sm mt-1.5">
                                        {workout.description}
                                    </p>
                                    <div className="flex justify-between text-xs mt-3">
                                        <span className={`px-2 py-1 rounded-full ${workout.difficulty === "Beginner" ? "bg-green-900/50 text-green-400" :
                                            workout.difficulty === "Intermediate" ? "bg-yellow-900/50 text-yellow-400" :
                                                "bg-red-900/50 text-red-400"
                                            }`}>
                                            {workout.difficulty}
                                        </span>
                                        <span className="px-2 py-1 rounded-full bg-purple-900/50 text-purple-400">
                                            {workout.equipment}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedWorkout && (
                            <div className="mt-6">
                                <Link href={`/coach?exercise=${selectedWorkout}`}>
                                    <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-md font-medium hover:from-blue-700 hover:to-indigo-800 transition duration-300 shadow-lg flex justify-center items-center space-x-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Start Workout</span>
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Middle Area - Content area with tighter AI assistant */}
                <div className="flex-grow flex flex-col p-6 max-w-3xl mx-auto">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Welcome to Morphos</h1>
                        <p className="text-gray-300">Your AI-powered fitness coach with real-time pose tracking and emotion-based motivation</p>
                    </div>

                    {/* AI Assistant with reduced width */}
                    <div className="bg-gray-800 bg-opacity-80 rounded-xl p-6 shadow-lg border border-gray-700 mb-6 max-w-2xl mx-auto w-full">
                        {/* Chat History Area */}
                        <div className="h-96 overflow-y-auto mb-4 space-y-4 p-2 bg-gray-900 bg-opacity-50 rounded-lg">
                            {chatHistory.map((chat, index) => (
                                <div
                                    key={index}
                                    className={`${chat.type === "user"
                                        ? "ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-tl-lg rounded-tr-lg rounded-bl-lg shadow-md"
                                        : "mr-auto bg-gray-700 rounded-tr-lg rounded-tl-lg rounded-br-lg shadow-md"
                                        } max-w-[80%] p-3 animate-fadeIn`}
                                >
                                    {chat.type === "bot" ? (
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <ReactMarkdown>
                                                {chat.message}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        chat.message
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="mr-auto bg-gray-700 rounded-tr-lg rounded-tl-lg rounded-br-lg shadow-md max-w-[80%] p-3 animate-pulse">
                                    <div className="flex space-x-2">
                                        <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                                        <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input Area */}
                        <form onSubmit={handleChatSubmit} className="flex">
                            <input
                                type="text"
                                className="flex-grow bg-gray-700 rounded-l-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border-transparent"
                                placeholder="Ask about recommended workouts..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className={`bg-gradient-to-r from-purple-500 to-blue-600 px-5 py-3 rounded-r-md transition-colors font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-purple-600 hover:to-blue-700'
                                    }`}
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send"}
                            </button>
                        </form>
                    </div>

                    {/* Rest of your existing component... */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-800 bg-opacity-75 rounded-xl p-4 border border-gray-700 shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-xs">Today's Goal</p>
                                    <h3 className="text-lg font-bold mt-1 text-white">85% Complete</h3>
                                </div>
                                <div className="p-2 bg-indigo-900/30 rounded-lg">
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 bg-opacity-75 rounded-xl p-4 border border-gray-700 shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-xs">Current Streak</p>
                                    <h3 className="text-lg font-bold mt-1 text-white">3 Days</h3>
                                </div>
                                <div className="p-2 bg-purple-900/30 rounded-lg">
                                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 bg-opacity-75 rounded-xl p-4 border border-gray-700 shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-xs">Calories Burned</p>
                                    <h3 className="text-lg font-bold mt-1 text-white">267 kcal</h3>
                                </div>
                                <div className="p-2 bg-pink-900/30 rounded-lg">
                                    <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href="/analytics">
                        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 flex items-center justify-between hover:from-indigo-800 hover:to-purple-800 transition-all duration-300 shadow-lg cursor-pointer border border-indigo-700 transform hover:translate-y-[-2px]">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Your Fitness Insights</h2>
                                <p className="text-gray-300">View detailed analytics and track your progress</p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-700 rounded-full flex items-center justify-center shadow-md">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>
            </main>

            {/* Footer with improved styling */}
            <footer className="border-t border-gray-800 py-6">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-600">
                            Morphos
                        </span>
                    </div>
                    <div className="text-gray-400 text-sm flex justify-center space-x-6 mb-4">
                        <a href="#" className="hover:text-gray-300 transition-colors">About</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
                    </div>
                    <p className="text-gray-500 text-sm">© 2025 Morphos. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}