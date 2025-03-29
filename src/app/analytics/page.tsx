// AnalyticsDashboard.tsx
"use client";

import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, 
  Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Calendar, ChevronDown, Clock, Dumbbell, Flame, Zap } from 'lucide-react';

// Mock data for demonstration
const mockWorkoutHistory = [
  { date: '2024-03-22', duration: 35, caloriesBurned: 240, repCount: 86, formScore: 78, emotion: 'focused' },
  { date: '2024-03-24', duration: 42, caloriesBurned: 320, repCount: 94, formScore: 82, emotion: 'happy' },
  { date: '2024-03-25', duration: 28, caloriesBurned: 210, repCount: 72, formScore: 75, emotion: 'tired' },
  { date: '2024-03-27', duration: 45, caloriesBurned: 350, repCount: 105, formScore: 88, emotion: 'focused' },
  { date: '2024-03-29', duration: 40, caloriesBurned: 300, repCount: 98, formScore: 84, emotion: 'happy' },
];

const mockExerciseProgress = [
  { name: 'Bicep Curls', week1: 30, week2: 35, week3: 40, week4: 45 },
  { name: 'Hip Mobility', week1: 65, week2: 72, week3: 80, week4: 86 },
  { name: 'Sumo Squats', week1: 50, week2: 56, week3: 62, week4: 68 },
];

const mockEmotionData = [
  { name: 'Happy', value: 35, color: '#6366F1' },
  { name: 'Focused', value: 40, color: '#8B5CF6' },
  { name: 'Tired', value: 15, color: '#EC4899' },
  { name: 'Frustrated', value: 5, color: '#F43F5E' },
  { name: 'Neutral', value: 5, color: '#94A3B8' },
];

const mockFormData = [
  { date: '2024-03-22', bicepCurl: 75, hipMobility: 62, sumoSquat: 68 },
  { date: '2024-03-24', bicepCurl: 78, hipMobility: 65, sumoSquat: 72 },
  { date: '2024-03-25', bicepCurl: 76, hipMobility: 70, sumoSquat: 70 },
  { date: '2024-03-27', bicepCurl: 82, hipMobility: 75, sumoSquat: 78 },
  { date: '2024-03-29', bicepCurl: 85, hipMobility: 80, sumoSquat: 82 },
];

const gradientOffset = () => {
  const dataMax = Math.max(...mockWorkoutHistory.map(i => i.caloriesBurned));
  const dataMin = Math.min(...mockWorkoutHistory.map(i => i.caloriesBurned));
  
  if (dataMax <= 0) {
    return 0;
  }
  if (dataMin >= 0) {
    return 1;
  }
  
  return dataMax / (dataMax - dataMin);
};

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('Past Month');
  const off = gradientOffset();
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400">
              Fitness Analytics
            </h1>
            <p className="text-gray-400 mt-1">Track your progress and insights</p>
          </div>
          <div className="relative">
            <button 
              className="flex items-center space-x-2 bg-gray-800 rounded-lg px-4 py-2 text-gray-300 border border-gray-700 hover:bg-gray-750"
            >
              <span>{timeRange}</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </header>
      
      <main className="px-6 py-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg transform transition-all hover:translate-y-[-2px]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Workouts</p>
                <h3 className="text-3xl font-bold mt-1 text-indigo-400">24</h3>
              </div>
              <div className="p-2 bg-indigo-900/30 rounded-lg">
                <Dumbbell className="text-indigo-400" size={24} />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <span className="text-green-400">↑ 12%</span> from last month
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg transform transition-all hover:translate-y-[-2px]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Active Minutes</p>
                <h3 className="text-3xl font-bold mt-1 text-violet-400">645</h3>
              </div>
              <div className="p-2 bg-violet-900/30 rounded-lg">
                <Clock className="text-violet-400" size={24} />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <span className="text-green-400">↑ 8%</span> from last month
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg transform transition-all hover:translate-y-[-2px]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Calories Burned</p>
                <h3 className="text-3xl font-bold mt-1 text-pink-400">4,320</h3>
              </div>
              <div className="p-2 bg-pink-900/30 rounded-lg">
                <Flame className="text-pink-400" size={24} />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <span className="text-green-400">↑ 15%</span> from last month
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg transform transition-all hover:translate-y-[-2px]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Current Streak</p>
                <h3 className="text-3xl font-bold mt-1 text-purple-400">3 days</h3>
              </div>
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <Calendar className="text-purple-400" size={24} />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Best: <span className="text-purple-400">7 days</span>
            </div>
          </div>
        </div>
        
        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Workout History Chart */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-200">Workout History</h2>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                View Details
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={mockWorkoutHistory}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', borderRadius: '0.5rem' }} 
                  itemStyle={{ color: '#E5E7EB' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="caloriesBurned" 
                  name="Calories" 
                  stroke="#8B5CF6" 
                  fillOpacity={1}
                  fill="url(#caloriesGradient)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="duration" 
                  name="Duration (min)" 
                  stroke="#60A5FA" 
                  fillOpacity={1}
                  fill="url(#durationGradient)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', color: '#9CA3AF' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Exercise Progress Chart */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-200">Exercise Progress</h2>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                View Details
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockExerciseProgress} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', borderRadius: '0.5rem' }} 
                  itemStyle={{ color: '#E5E7EB' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', color: '#9CA3AF' }} />
                <Bar dataKey="week1" name="Week 1" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="week2" name="Week 2" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="week3" name="Week 3" fill="#A78BFA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="week4" name="Week 4" fill="#EC4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Bottom Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Quality Chart */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-200">Form Quality</h2>
              <div className="flex items-center space-x-1">
                <span className="inline-block w-3 h-3 rounded-full bg-indigo-400"></span>
                <span className="text-xs text-gray-400">Bicep Curl</span>
                <span className="inline-block w-3 h-3 rounded-full bg-violet-400 ml-3"></span>
                <span className="text-xs text-gray-400">Hip Mobility</span>
                <span className="inline-block w-3 h-3 rounded-full bg-pink-400 ml-3"></span>
                <span className="text-xs text-gray-400">Sumo Squat</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockFormData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <YAxis domain={[50, 100]} stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', borderRadius: '0.5rem' }} 
                  itemStyle={{ color: '#E5E7EB' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bicepCurl" 
                  stroke="#60A5FA" 
                  strokeWidth={3}
                  dot={{ stroke: '#60A5FA', strokeWidth: 2, r: 4, fill: '#1F2937' }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#60A5FA' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hipMobility" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 4, fill: '#1F2937' }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#8B5CF6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sumoSquat" 
                  stroke="#EC4899" 
                  strokeWidth={3}
                  dot={{ stroke: '#EC4899', strokeWidth: 2, r: 4, fill: '#1F2937' }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#EC4899' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Emotion Distribution Chart */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-200">Emotion Distribution</h2>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                View Details
              </button>
            </div>
            <div className="text-sm text-gray-400 mb-4">During your workouts</div>
            <div className="flex items-center justify-center h-[280px]">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={mockEmotionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockEmotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', borderRadius: '0.5rem' }} 
                    itemStyle={{ color: '#E5E7EB' }}
                    labelStyle={{ color: '#9CA3AF' }}
                    formatter={(value) => [`${value}%`, 'Percentage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
              {mockEmotionData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <span 
                    className="inline-block w-3 h-3 rounded-full mr-1" 
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span className="text-xs text-gray-400">{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Goal Progress Section */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-200">Goal Progress</h2>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
              <Zap size={14} />
              <span>Add Goal</span>
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <div>
                  <span className="text-gray-200 font-medium">Build Biceps Strength</span>
                  <p className="text-xs text-gray-400 mt-1">Current: 45 lbs curls × 12 reps</p>
                </div>
                <span className="text-violet-400 font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" 
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div>
                  <span className="text-gray-200 font-medium">Increase Hip Flexibility</span>
                  <p className="text-xs text-gray-400 mt-1">Hip mobility score: 82/100</p>
                </div>
                <span className="text-violet-400 font-medium">60%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" 
                  style={{ width: '60%' }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div>
                  <span className="text-gray-200 font-medium">Workout Consistency</span>
                  <p className="text-xs text-gray-400 mt-1">Target: 4 workouts per week</p>
                </div>
                <span className="text-violet-400 font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" 
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* AI Insights Section */}
        <div className="mt-8 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-800/80 rounded-xl p-6 border border-gray-700 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">AI Insights</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-900/50 p-4 rounded-lg border border-indigo-500/30">
                <h3 className="font-medium text-indigo-400 mb-1">Workout Recommendation</h3>
                <p className="text-gray-300">Based on your progress, try increasing your bicep curl weight by 2.5 lbs next session.</p>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-lg border border-violet-500/30">
                <h3 className="font-medium text-violet-400 mb-1">Form Improvement</h3>
                <p className="text-gray-300">Your hip mobility has improved 20% since you started. Keep focusing on proper form during hip circles.</p>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-lg border border-pink-500/30">
                <h3 className="font-medium text-pink-400 mb-1">Emotional Pattern</h3>
                <p className="text-gray-300">You tend to have better workouts in the morning when your emotion tracking shows "focused" state.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-10 py-6 border-t border-gray-800 px-6">
        <div className="text-center text-gray-500 text-sm">
          © 2025 MotionMind. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AnalyticsDashboard;