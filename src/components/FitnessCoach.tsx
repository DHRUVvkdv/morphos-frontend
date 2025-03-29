import React, { useRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types for feedback data
interface FeedbackItem {
  correct: boolean;
  message: string;
  score: number;
}

interface RepPhase {
  status: string;
  count: number;
}

// Base feedback interface with common properties
interface BaseFeedback {
  overall: FeedbackItem;
  posture: FeedbackItem;
}

// T-Pose specific feedback
interface TPoseFeedback extends BaseFeedback {
  left_arm: FeedbackItem;
  right_arm: FeedbackItem;
}

// Bicep curl specific feedback
interface BicepCurlFeedback extends BaseFeedback {
  elbow_angle: FeedbackItem;
  arm_position: FeedbackItem;
  rep_phase: RepPhase;
}

// Combined type
type Feedback = TPoseFeedback | BicepCurlFeedback;

interface PoseData {
  keypoints: number[][];
  feedback: Feedback;
  exercise_mode: string;
  error?: string;
}

// Type guard functions
function isTPoseFeedback(feedback: Feedback): feedback is TPoseFeedback {
  return 'left_arm' in feedback && 'right_arm' in feedback;
}

function isBicepCurlFeedback(feedback: Feedback): feedback is BicepCurlFeedback {
  return 'elbow_angle' in feedback && 'arm_position' in feedback && 'rep_phase' in feedback;
}

// Define UI colors for feedback
const COLORS = {
  background: 'rgb(25, 25, 35)',
  panel: 'rgb(40, 40, 55)',
  accent: 'rgb(75, 161, 255)',
  correct: 'rgb(50, 205, 50)',
  incorrect: 'rgb(255, 80, 80)',
  neutral: 'rgb(180, 180, 180)',
  highlight: 'rgb(255, 215, 0)',
  text: 'rgb(240, 240, 240)',
  shadow: 'rgb(15, 15, 20)'
};

const FitnessCoach: React.FC = () => {
  // References and state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const clientIdRef = useRef<string>(uuidv4());
  const requestAnimationRef = useRef<number | null>(null);
  
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [exerciseMode, setExerciseMode] = useState<string>('tpose');
  const [poseData, setPoseData] = useState<PoseData | null>(null);
  const [fps, setFps] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [processingFrame, setProcessingFrame] = useState<boolean>(false);
  const [frameInterval, setFrameInterval] = useState<number>(200); // ms between frames
  const lastFrameSentTime = useRef<number>(0);
  
  // Store timestamps for FPS calculation
  const lastFrameTime = useRef<number>(0);
  const fpsBuffer = useRef<number[]>([]);
  
  // Connect to WebSocket server
  useEffect(() => {
    const clientId = clientIdRef.current;
    const ws = new WebSocket(`ws://localhost:8000/ws/${clientId}`);
    
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      setError(null);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'error') {
          console.error('Server error:', data.message);
          setError(data.message);
        } else if (data.type === 'pose_data') {
          setPoseData(data.data);
          // Update exercise mode from server
          setExerciseMode(data.data.exercise_mode);
          
          // Frame has been processed, ready for next one
          setProcessingFrame(false);
        } else if (data.type === 'mode_change') {
          if (data.success) {
            setExerciseMode(data.mode);
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error);
        // Reset processing flag on error too
        setProcessingFrame(false);
      }
    };
    
    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
      setError('Connection to server closed. Please refresh to reconnect.');
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error. Please check if the server is running.');
      setIsConnected(false);
    };
    
    wsRef.current = ws;
    
    // Clean up on unmount
    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
      }
      ws.close();
    };
  }, []);
  
  // Initialize webcam
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
        setError('Could not access webcam. Please grant camera permissions and refresh.');
      }
    };
    
    initializeCamera();
  }, []);
  
  // Send frames to the server at regular intervals
  useEffect(() => {
    if (!isConnected || !videoRef.current || !canvasRef.current) return;
    
// Update this part of your code
    const processFrame = () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const now = performance.now();
      
      // Calculate FPS for display
      const elapsed = now - lastFrameTime.current;
      if (lastFrameTime.current !== 0) {
        const currentFps = 1000 / elapsed;
        fpsBuffer.current.push(currentFps);
        if (fpsBuffer.current.length > 10) {
          fpsBuffer.current.shift();
        }
        
        // Calculate average FPS
        const avgFps = fpsBuffer.current.reduce((a, b) => a + b, 0) / fpsBuffer.current.length;
        setFps(Math.round(avgFps));
      }
      lastFrameTime.current = now;
      
      // Only send frames at specified interval and when not already processing
      const shouldSendFrame = !processingFrame && (now - lastFrameSentTime.current > frameInterval);
      
      if (shouldSendFrame && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        setProcessingFrame(true);
        lastFrameSentTime.current = now;
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (context) {
          // Reduce resolution for better performance
          const scale = 0.5; // Reduce to 50% of original size
          const scaledWidth = Math.floor(videoRef.current.videoWidth * scale);
          const scaledHeight = Math.floor(videoRef.current.videoHeight * scale);
          
          // IMPORTANT: Set canvas dimensions to match the scaled size
          canvas.width = scaledWidth;
          canvas.height = scaledHeight;
          
          // Draw video frame to canvas at the correct size
          context.drawImage(videoRef.current, 0, 0, scaledWidth, scaledHeight);
          
          // Get frame as base64 data with higher compression
          const imageData = canvas.toDataURL('image/jpeg', 0.6);
          
          // Add a small check to verify data isn't empty
          if (imageData.length > 100) { // Basic validation
            // Send to WebSocket
            wsRef.current.send(JSON.stringify({ image: imageData }));
          } else {
            console.error("Generated empty image data, skipping frame");
            setProcessingFrame(false); // Reset the processing flag
          }
        }
      }
      
      // Request next frame
      requestAnimationRef.current = requestAnimationFrame(processFrame);
    };

    requestAnimationRef.current = requestAnimationFrame(processFrame);
    
    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
      }
    };
  }, [isConnected]);
  
  // Handle exercise mode change
  const handleModeChange = () => {
    const newMode = exerciseMode === 'tpose' ? 'bicep_curl' : 'tpose';
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ 
        command: 'set_mode', 
        mode: newMode 
      }));
    }
  };

  const handleFrameRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFrameInterval(1000 / value); // Convert fps to interval in ms
  };
  
  // Draw skeleton on canvas overlay
  useEffect(() => {
    if (!poseData || !poseData.keypoints || poseData.keypoints.length === 0) return;
    
    const drawSkeleton = () => {
      const overlayCanvas = document.getElementById('skeleton-overlay') as HTMLCanvasElement;
      if (!overlayCanvas || !videoRef.current || !poseData || !poseData.keypoints || poseData.keypoints.length === 0) return;
      
      const ctx = overlayCanvas.getContext('2d');
      if (!ctx) return;
      
      // Get the actual video dimensions and display dimensions
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      const videoBounds = videoRef.current.getBoundingClientRect();
      
      // Set canvas to match video container dimensions
      overlayCanvas.width = videoBounds.width;
      overlayCanvas.height = videoBounds.height;
      
      // Clear previous drawings
      ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      
      // Get the actual display aspect ratio and video aspect ratio
      const displayAspect = videoBounds.width / videoBounds.height;
      const videoAspect = videoWidth / videoHeight;
      
      // Calculate the visible dimensions within the container
      let displayWidth, displayHeight, offsetX = 0, offsetY = 0;
      
      if (displayAspect > videoAspect) {
        // Container is wider than video - video is height-constrained
        displayHeight = videoBounds.height;
        displayWidth = displayHeight * videoAspect;
        offsetX = (videoBounds.width - displayWidth) / 2; // Center horizontally
      } else {
        // Container is taller than video - video is width-constrained
        displayWidth = videoBounds.width;
        displayHeight = displayWidth / videoAspect;
        offsetY = (videoBounds.height - displayHeight) / 2; // Center vertically
      }
      
      // Calculate scaling ratios from 50% scaled keypoints to displayed size
      const scaleX = displayWidth / (videoWidth * 0.5);
      const scaleY = displayHeight / (videoHeight * 0.5);
      
      const transformedKeypoints = poseData.keypoints.map(point => {
        if (!point || point.length < 2) return [0, 0];
        
        // Flip the X coordinate to match the mirrored video display
        // We mirror around the center of the display width
        const mirroredX = videoBounds.width - (point[0] * scaleX + offsetX);
        
        return [
          mirroredX,
          point[1] * scaleY + offsetY
        ];
      });
      
      // Draw connections between keypoints
      const drawConnection = (p1Idx: number, p2Idx: number, color: string, thickness: number) => {
        if (p1Idx >= transformedKeypoints.length || p2Idx >= transformedKeypoints.length) return;
        
        const p1 = transformedKeypoints[p1Idx];
        const p2 = transformedKeypoints[p2Idx];
        
        // Draw glow effect
        ctx.lineWidth = thickness + 4;
        ctx.strokeStyle = COLORS.shadow;
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
        
        // Draw main line
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
      };
      
      // Keypoint indices
      const LEFT_SHOULDER = 5;
      const RIGHT_SHOULDER = 6;
      const LEFT_ELBOW = 7;
      const RIGHT_ELBOW = 8;
      const LEFT_WRIST = 9;
      const RIGHT_WRIST = 10;
      const LEFT_HIP = 11;
      const RIGHT_HIP = 12;
      
      // Draw skeleton based on exercise mode
      const feedback = poseData.feedback;
      const mode = poseData.exercise_mode;
      
      if (mode === 'tpose' && isTPoseFeedback(feedback)) {
        // Draw arms
        const leftArmColor = feedback.left_arm.correct ? COLORS.correct : COLORS.incorrect;
        const rightArmColor = feedback.right_arm.correct ? COLORS.correct : COLORS.incorrect;
        
        drawConnection(LEFT_SHOULDER, LEFT_ELBOW, leftArmColor, 3);
        drawConnection(LEFT_ELBOW, LEFT_WRIST, leftArmColor, 3);
        drawConnection(RIGHT_SHOULDER, RIGHT_ELBOW, rightArmColor, 3);
        drawConnection(RIGHT_ELBOW, RIGHT_WRIST, rightArmColor, 3);
        
        // Draw posture
        const postureColor = feedback.posture.correct ? COLORS.correct : COLORS.incorrect;
        drawConnection(LEFT_SHOULDER, RIGHT_SHOULDER, postureColor, 3);
        drawConnection(LEFT_HIP, RIGHT_HIP, postureColor, 3);
        drawConnection(LEFT_SHOULDER, LEFT_HIP, postureColor, 3);
        drawConnection(RIGHT_SHOULDER, RIGHT_HIP, postureColor, 3);
      } else if (mode === 'bicep_curl' && isBicepCurlFeedback(feedback)) {
        // For bicep curl mode
        // Draw posture
        const postureColor = feedback.posture.correct ? COLORS.correct : COLORS.incorrect;
        drawConnection(LEFT_SHOULDER, RIGHT_SHOULDER, postureColor, 3);
        drawConnection(LEFT_HIP, RIGHT_HIP, postureColor, 3);
        drawConnection(LEFT_SHOULDER, LEFT_HIP, postureColor, 3);
        drawConnection(RIGHT_SHOULDER, RIGHT_HIP, postureColor, 3);
        
        // Draw arms (highlight the curling arm)
        const elbowColor = feedback.elbow_angle.correct ? COLORS.correct : COLORS.incorrect;
        const armColor = feedback.arm_position.correct ? COLORS.correct : COLORS.incorrect;
        
        drawConnection(LEFT_SHOULDER, LEFT_ELBOW, armColor, 3);
        drawConnection(LEFT_ELBOW, LEFT_WRIST, elbowColor, 3);
        drawConnection(RIGHT_SHOULDER, RIGHT_ELBOW, armColor, 3);
        drawConnection(RIGHT_ELBOW, RIGHT_WRIST, elbowColor, 3);
      }
      
      // Draw keypoints
      transformedKeypoints.forEach((point, i) => {
        // Determine joint color based on body part and exercise mode
        let color = COLORS.neutral;
        
        if (mode === 'tpose' && isTPoseFeedback(feedback)) {
          if (i === LEFT_SHOULDER || i === LEFT_ELBOW || i === LEFT_WRIST) {
            color = feedback.left_arm.correct ? COLORS.correct : COLORS.incorrect;
          } else if (i === RIGHT_SHOULDER || i === RIGHT_ELBOW || i === RIGHT_WRIST) {
            color = feedback.right_arm.correct ? COLORS.correct : COLORS.incorrect;
          } else if (i === LEFT_HIP || i === RIGHT_HIP) {
            color = feedback.posture.correct ? COLORS.correct : COLORS.incorrect;
          }
        } else if (mode === 'bicep_curl' && isBicepCurlFeedback(feedback)) {
          if (i === LEFT_ELBOW || i === RIGHT_ELBOW) {
            color = feedback.elbow_angle.correct ? COLORS.highlight : COLORS.incorrect;
          } else if (i === LEFT_SHOULDER || i === RIGHT_SHOULDER || 
                    i === LEFT_WRIST || i === RIGHT_WRIST) {
            color = feedback.arm_position.correct ? COLORS.correct : COLORS.incorrect;
          } else if (i === LEFT_HIP || i === RIGHT_HIP) {
            color = feedback.posture.correct ? COLORS.correct : COLORS.incorrect;
          }
        }
        
        // Draw joint with glow effect
        const radius = 6;
        ctx.beginPath();
        ctx.arc(point[0], point[1], radius + 2, 0, 2 * Math.PI);
        ctx.fillStyle = COLORS.shadow;
        ctx.fill();
        
        // Draw joint
        ctx.beginPath();
        ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Draw highlight
        ctx.beginPath();
        ctx.arc(point[0] - 1, point[1] - 1, radius / 2, 0, 2 * Math.PI);
        
        // Make highlight color lighter
        const lighterColor = color === COLORS.correct ? 'rgb(150, 255, 150)' : 
                            color === COLORS.incorrect ? 'rgb(255, 150, 150)' :
                            color === COLORS.highlight ? 'rgb(255, 240, 150)' : 'rgb(220, 220, 220)';
        
        ctx.fillStyle = lighterColor;
        ctx.fill();
      });
    };
    
    drawSkeleton();
  }, [poseData]);
  
  // Render progress bar component
  const ProgressBar: React.FC<{ value: number, color: string, label?: string }> = ({ value, color, label }) => {
    return (
      <div className="relative h-3 bg-gray-700 w-full rounded overflow-hidden">
        <div 
          className="h-full rounded transition-all duration-300 ease-out"
          style={{ 
            width: `${value}%`, 
            backgroundColor: color 
          }}
        />
        {label && (
          <div className="absolute right-2 top-0 text-xs text-white font-bold">
            {`${Math.round(value)}%`}
          </div>
        )}
      </div>
    );
  };
  
  // Feedback section component
  const FeedbackSection: React.FC<{ label: string, data: FeedbackItem }> = ({ label, data }) => {
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <h4 className="text-sm font-bold">{label}:</h4>
          <span className="text-xs">
            {data.message}
          </span>
        </div>
        <ProgressBar 
          value={data.score} 
          color={data.correct ? COLORS.correct : COLORS.incorrect}
          label="score"
        />
      </div>
    );
  };
  
  // Render feedback sections based on the current exercise mode
  const renderFeedbackSections = () => {
    if (!poseData || !poseData.feedback) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">Waiting for pose detection...</p>
        </div>
      );
    }

    return (
      <>
        {/* Overall Status - Common to all feedback types */}
        <div className="mb-6 text-center">
          <div 
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2
              ${poseData.feedback.overall.correct ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
          >
            {poseData.feedback.overall.correct ? (
              <span className="text-2xl">✓</span>
            ) : (
              <span className="text-xl">!</span>
            )}
          </div>
          <h3 className={`text-xl font-bold ${
            poseData.feedback.overall.correct ? 'text-green-400' : 'text-red-400'
          }`}>
            {poseData.feedback.overall.message}
          </h3>
        </div>
        
        {/* Overall Progress - Common to all feedback types */}
        <div className="mb-6">
          <h4 className="text-sm font-bold mb-1">Overall Progress:</h4>
          <ProgressBar 
            value={poseData.feedback.overall.score} 
            color={
              poseData.feedback.overall.score >= 75 ? COLORS.correct :
              poseData.feedback.overall.score >= 60 ? 'rgb(0, 255, 255)' :
              poseData.feedback.overall.score >= 40 ? 'rgb(0, 165, 255)' : COLORS.incorrect
            }
            label="score"
          />
        </div>
        
        {/* Conditional feedback sections based on exercise type */}
        {isTPoseFeedback(poseData.feedback) ? (
          // T-Pose feedback
          <>
            <FeedbackSection 
              label="Left Arm" 
              data={poseData.feedback.left_arm} 
            />
            <FeedbackSection 
              label="Right Arm" 
              data={poseData.feedback.right_arm} 
            />
            <FeedbackSection 
              label="Posture" 
              data={poseData.feedback.posture} 
            />
          </>
        ) : isBicepCurlFeedback(poseData.feedback) ? (
          // Bicep curl feedback
          <>
            {/* Rep Counter */}
            <div className="mb-6 bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-yellow-400">REPS</span>
                <span className="text-3xl font-bold">{poseData.feedback.rep_phase.count}</span>
              </div>
              <div className="text-center mt-2 font-bold text-sm">
                <span className={`
                  ${poseData.feedback.rep_phase.status === 'up' ? 'text-yellow-400' :
                    poseData.feedback.rep_phase.status === 'down' ? 'text-green-400' : 'text-cyan-400'}
                `}>
                  {poseData.feedback.rep_phase.status === 'up' ? 'EXTENDED' :
                    poseData.feedback.rep_phase.status === 'down' ? 'CURLED' : 'MOVING'}
                </span>
              </div>
            </div>
            
            <FeedbackSection 
              label="Elbow Angle" 
              data={poseData.feedback.elbow_angle} 
            />
            <FeedbackSection 
              label="Arm Position" 
              data={poseData.feedback.arm_position} 
            />
            <FeedbackSection 
              label="Posture" 
              data={poseData.feedback.posture} 
            />
          </>
        ) : (
          // Fallback for unknown feedback type
          <div className="text-center text-red-400">
            Unknown feedback type received
          </div>
        )}
      </>
    );
  };
  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white p-4">
      {/* Camera View and Skeleton */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover transform scale-x-[-1]"
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="hidden" // Hidden, just used for processing
        />
        <canvas
          id="skeleton-overlay"
          className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
        />
        
        {/* FPS Counter */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
          FPS: {fps}
        </div>
        
        
        {/* Error Message */}
        {error && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 bg-opacity-90 p-4 rounded-lg max-w-md text-center">
            <h3 className="font-bold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
      
      {/* Feedback Panel */}
      <div className="w-full md:w-64 lg:w-80 bg-gray-800 rounded-lg overflow-hidden mt-4 md:mt-0 md:ml-4 flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 p-4">
          <h2 className="text-xl font-bold text-center">POSE COACH</h2>
          <p className="text-center text-sm mt-1">
            {exerciseMode === 'tpose' ? 'T-Pose Mode' : 'Bicep Curl Mode'}
          </p>
        </div>
        
        {/* Status and Feedback */}
        <div className="p-4 flex-1 overflow-y-auto">
          {renderFeedbackSections()}
        </div>
        
        {/* Footer with Controls */}
        <div className="p-4 bg-gray-700">
          <button 
            onClick={handleModeChange}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Switch to {exerciseMode === 'tpose' ? 'Bicep Curl' : 'T-Pose'} Mode
          </button>
          <p className="text-xs text-center mt-2 text-gray-400">Press 'Q' to exit in the original app</p>
        </div>
      </div>
    </div>
  );
};

export default FitnessCoach;