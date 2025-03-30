
"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';

const SignupPage = () => {
  // State for current step
  const [currentStep, setCurrentStep] = useState(0);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    height: '',
    weight: '',
    fitnessLevel: 'beginner',
    workoutDuration: '45',
    workoutFrequency: '4',
    fitnessGoals: [],
    equipment: []
  });
  
  // State for errors
  const [errors, setErrors] = useState({});
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const arrayField = name === 'equipment' ? 'equipment' : 'fitnessGoals';
      if (checked) {
        setFormData({
          ...formData,
          [arrayField]: [...formData[arrayField], value]
        });
      } else {
        setFormData({
          ...formData,
          [arrayField]: formData[arrayField].filter(item => item !== value)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Check password match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: 'Passwords do not match'
        });
      } else if (name === 'confirmPassword' && value !== formData.password) {
        setErrors({
          ...errors,
          confirmPassword: 'Passwords do not match'
        });
      } else if (name === 'confirmPassword' && value === formData.password) {
        setErrors({
          ...errors,
          confirmPassword: ''
        });
      }
    }
  };
  
  // Validate current step
  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 0) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password && formData.password.length < 8) 
        newErrors.password = 'Password must be at least 8 characters';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      if (formData.password !== formData.confirmPassword) 
        newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Go to next step
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Go to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      // Submit to backend
      console.log('Form data to submit:', formData);
      // Here you would call your API endpoint
    }
  };
  
  return (
    <div className="min-h-screen bg-[#161b2b] flex items-center justify-center p-4">
      <div className="bg-[#1a2235] rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 text-center">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">Morphos</h1>
          <p className="text-white opacity-90">AI-powered fitness coaching with real-time pose tracking</p>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-[#212a3e] px-8 py-8">
    <div className="relative flex justify-between mb-6">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#2c354a] -translate-y-1/2"></div>
        {/* Progress fill */}
        <div 
        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 -translate-y-1/2 transition-all duration-300"
        style={{ width: `${(currentStep / 3) * 100}%` }}
        ></div>
            
            {/* Step indicators */}
            {[0, 1, 2, 3].map((step, index) => (
            <div 
                key={index}
                className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                currentStep >= step 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                    : 'bg-[#2c354a] text-gray-400'
                }`}
            >
                {step + 1}
                <span className="absolute top-16 text-sm text-[#8c9cb8] w-max style={{ left: '50%', transform: 'translateX(-50%)' }}">
                {['Account', 'Profile', 'Goals', 'Equipment'][step]}
                </span>
            </div>
            ))}
        </div>
        </div>
        
        {/* Form Container */}
        <div className="px-8 py-6">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Setup */}
            {currentStep === 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-1 text-white">Create Your Account</h2>
                <p className="text-[#8c9cb8] text-sm mb-6">Join our AI-powered fitness community</p>
                
                <div className="mb-5">
                  <label htmlFor="name" className="block text-[#c5d0e6] font-semibold mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full bg-[#212a3e] border ${errors.name ? 'border-red-500' : 'border-[#2c354a]'} rounded-lg p-3.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div className="mb-5">
                  <label htmlFor="email" className="block text-[#c5d0e6] font-semibold mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-[#212a3e] border ${errors.email ? 'border-red-500' : 'border-[#2c354a]'} rounded-lg p-3.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div className="mb-5">
                  <label htmlFor="password" className="block text-[#c5d0e6] font-semibold mb-2">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full bg-[#212a3e] border ${errors.password ? 'border-red-500' : 'border-[#2c354a]'} rounded-lg p-3.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  {errors.password 
                    ? <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    : <p className="text-[#8c9cb8] text-xs mt-1.5">Use at least 8 characters with a mix of letters, numbers, and symbols</p>
                  }
                </div>
                
                <div className="mb-5">
                  <label htmlFor="confirmPassword" className="block text-[#c5d0e6] font-semibold mb-2">Confirm Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full bg-[#212a3e] border ${errors.confirmPassword ? 'border-red-500' : 'border-[#2c354a]'} rounded-lg p-3.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
                
                <div className="flex justify-end mt-8">
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Physical Info */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-1 text-white">Physical Information</h2>
                <p className="text-[#8c9cb8] text-sm mb-6">This helps us personalize your workout experience</p>
                
                <div className="mb-5">
                  <label htmlFor="age" className="block text-[#c5d0e6] font-semibold mb-2">Age</label>
                  <input 
                    type="number" 
                    id="age" 
                    name="age" 
                    min="13" 
                    max="100" 
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full bg-[#212a3e] border border-[#2c354a] rounded-lg p-3.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-[#8c9cb8] text-xs mt-1.5">Range: 13-100 years</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label htmlFor="height" className="block text-[#c5d0e6] font-semibold mb-2">Height (cm)</label>
                    <input 
                      type="number" 
                      id="height" 
                      name="height" 
                      min="120" 
                      max="220" 
                      value={formData.height}
                      onChange={handleInputChange}
                      className="w-full bg-[#212a3e] border border-[#2c354a] rounded-lg p-3.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-[#8c9cb8] text-xs mt-1.5">Range: 120-220 cm</p>
                  </div>
                  
                  <div>
                    <label htmlFor="weight" className="block text-[#c5d0e6] font-semibold mb-2">Weight (kg)</label>
                    <input 
                      type="number" 
                      id="weight" 
                      name="weight" 
                      min="30" 
                      max="200" 
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full bg-[#212a3e] border border-[#2c354a] rounded-lg p-3.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-[#8c9cb8] text-xs mt-1.5">Range: 30-200 kg</p>
                  </div>
                </div>
                
                {formData.height && formData.weight && (
                  <div className="bg-[#212a3e] rounded-lg p-4 text-center font-semibold mb-5 border-l-4 border-purple-500">
                    Your BMI: {(formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)}
                  </div>
                )}
                
                <div className="flex justify-between mt-8">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="rounded-full bg-[#2c354a] hover:bg-[#3a455f] px-6 py-3.5 font-semibold text-white transition-all duration-300"
                  >
                    Back
                  </button>
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Fitness Goals */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-1 text-white">Fitness Goals</h2>
                <p className="text-[#8c9cb8] text-sm mb-6">Tell us about your experience and goals</p>
                
                <div className="mb-5">
                  <label htmlFor="fitnessLevel" className="block text-[#c5d0e6] font-semibold mb-2">Your Fitness Level</label>
                  <select 
                    id="fitnessLevel" 
                    name="fitnessLevel" 
                    value={formData.fitnessLevel}
                    onChange={handleInputChange}
                    className="w-full bg-[#212a3e] border border-[#2c354a] rounded-lg p-3.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label htmlFor="workoutDuration" className="block text-[#c5d0e6] font-semibold mb-2">Workout Duration (min)</label>
                    <input 
                      type="number" 
                      id="workoutDuration" 
                      name="workoutDuration" 
                      min="10" 
                      max="120" 
                      value={formData.workoutDuration}
                      onChange={handleInputChange}
                      className="w-full bg-[#212a3e] border border-[#2c354a] rounded-lg p-3.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-[#8c9cb8] text-xs mt-1.5">Range: 10-120 minutes</p>
                  </div>
                  
                  <div>
                    <label htmlFor="workoutFrequency" className="block text-[#c5d0e6] font-semibold mb-2">Workouts per Week</label>
                    <input 
                      type="number" 
                      id="workoutFrequency" 
                      name="workoutFrequency" 
                      min="1" 
                      max="7" 
                      value={formData.workoutFrequency}
                      onChange={handleInputChange}
                      className="w-full bg-[#212a3e] border border-[#2c354a] rounded-lg p-3.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-[#8c9cb8] text-xs mt-1.5">Range: 1-7 days</p>
                  </div>
                </div>
                
                <div className="mb-5">
                  <label className="block text-[#c5d0e6] font-semibold mb-2">Fitness Goals (Select all that apply)</label>
                  <div className="space-y-2.5 mt-2">
                    {[
                      { id: 'goalMuscle', value: 'buildMuscle', label: 'Build muscle' },
                      { id: 'goalWeight', value: 'loseWeight', label: 'Lose weight' },
                      { id: 'goalFlexibility', value: 'improveFlexibility', label: 'Improve flexibility' },
                      { id: 'goalEndurance', value: 'increaseEndurance', label: 'Increase endurance' },
                      { id: 'goalGeneral', value: 'generalFitness', label: 'General fitness' }
                    ].map(goal => (
                      <div key={goal.id} className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={goal.id} 
                          name="fitnessGoals" 
                          value={goal.value} 
                          checked={formData.fitnessGoals.includes(goal.value)}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-purple-500 mr-3"
                        />
                        <label htmlFor={goal.id} className="text-[#c5d0e6]">{goal.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="rounded-full bg-[#2c354a] hover:bg-[#3a455f] px-6 py-3.5 font-semibold text-white transition-all duration-300"
                  >
                    Back
                  </button>
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 4: Equipment */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-1 text-white">Available Equipment</h2>
                <p className="text-[#8c9cb8] text-sm mb-6">Select the equipment you have access to</p>
                
                <div className="mb-5">
                  <label className="block text-[#c5d0e6] font-semibold mb-2">Equipment (Select all that apply)</label>
                  <div className="space-y-2.5 mt-2">
                    {[
                      { id: 'equipNone', value: 'none', label: 'None' },
                      { id: 'equipDumbbells', value: 'dumbbells', label: 'Dumbbells' },
                      { id: 'equipBands', value: 'resistanceBands', label: 'Resistance bands' },
                      { id: 'equipBarbell', value: 'barbell', label: 'Barbell' },
                      { id: 'equipKettlebell', value: 'kettlebell', label: 'Kettlebell' },
                      { id: 'equipPullup', value: 'pullUpBar', label: 'Pull-up bar' },
                      { id: 'equipBike', value: 'exerciseBike', label: 'Exercise bike' },
                      { id: 'equipTreadmill', value: 'treadmill', label: 'Treadmill' }
                    ].map(item => (
                      <div key={item.id} className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={item.id} 
                          name="equipment" 
                          value={item.value} 
                          checked={formData.equipment.includes(item.value)}
                          onChange={handleInputChange}
                          disabled={item.id !== 'equipNone' && formData.equipment.includes('none')}
                          className="w-4 h-4 accent-purple-500 mr-3"
                        />
                        <label htmlFor={item.id} className="text-[#c5d0e6]">{item.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-[#212a3e] rounded-lg p-5 grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-[#8c9cb8] text-sm mb-1">Workout Streak</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">0</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#8c9cb8] text-sm mb-1">Total Workouts</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">0</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#8c9cb8] text-sm mb-1">Calories</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">0</div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="rounded-full bg-[#2c354a] hover:bg-[#3a455f] px-6 py-3.5 font-semibold text-white transition-all duration-300"
                  >
                    Back
                  </button>
                  <Link 
                    href="/homepage" 
                    className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Complete Sign Up
                  </Link>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;