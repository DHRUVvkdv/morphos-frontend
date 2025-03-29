// src/app/home/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);

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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 bg-opacity-90">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              MotionMind
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3">Welcome to MotionMind</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Your AI-powered fitness companion. Start a workout session to receive
            real-time form feedback and personalized music recommendations.
          </p>
        </section>

        {/* Quick Start Section */}
        <section className="mb-12">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6">Quick Start</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-indigo-900 bg-opacity-60 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-opacity-80 transition-all">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-indigo-700 mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Start New Workout</h3>
                <p className="text-gray-300 text-center">
                  Begin a freestyle workout session with real-time tracking
                </p>
              </div>

              <div className="bg-purple-900 bg-opacity-60 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-opacity-80 transition-all">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-purple-700 mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Choose Guided Workout
                </h3>
                <p className="text-gray-300 text-center">
                  Follow a pre-designed workout routine with instructions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Available Workouts */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Available Workouts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className={`bg-gray-800 rounded-lg p-5 cursor-pointer transition-all ${
                  selectedWorkout === workout.id
                    ? "ring-2 ring-blue-500"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => setSelectedWorkout(workout.id)}
              >
                <h3 className="text-xl font-medium mb-2">{workout.name}</h3>
                <p className="text-gray-400 text-sm mb-3">
                  {workout.description}
                </p>
                <div className="flex justify-between text-sm">
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
            <div className="mt-6 text-center">
              <Link href={`/workout/${selectedWorkout}`}>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full font-medium hover:from-blue-600 hover:to-indigo-700 transition duration-300 transform hover:-translate-y-1">
                  Start Selected Workout
                </button>
              </Link>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 MotionMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}