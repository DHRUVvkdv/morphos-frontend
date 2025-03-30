// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define the workout type
interface Workout {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  equipment: string;
}

export async function POST(request: Request) {
  try {
    // Check if API key exists
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('NEXT_PUBLIC_GEMINI_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'API key configuration error' },
        { status: 500 }
      );
    }
    
    // Initialize the Google Generative AI SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const { userMessage, workouts } = await request.json() as { 
      userMessage: string; 
      workouts: Workout[] 
    };
    
    // Create a system prompt that includes the available workouts
    const systemPrompt = `
    You are a helpful fitness assistant for the Morphos app. Your task is to recommend workouts based on the user's query. Keep your response concise.
    
    Available workouts:
    ${workouts.map((workout: Workout) => 
      `- ${workout.name}: ${workout.description}. Difficulty: ${workout.difficulty}. Equipment: ${workout.equipment}`
    ).join('\n')}
    
    When recommending workouts:
    1. Focus on the workouts from the available list
    2. Consider the user's equipment and fitness level if mentioned
    3. Explain why you're recommending specific exercises
    4. Keep responses conversational and encouraging
    5. If the user asks for something not in the list, recommend the closest match and explain why
    6. You can use Markdown formatting in your responses:
       - **Bold** for exercise names and important points
       - *Italic* for emphasis
       - Bullet points for lists
    
    Now, respond to the user's message.
    `;
    
    // Generate content with Gemini
    try {
      // Try Gemini 1.5 Pro first
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "I understand. I'll help recommend workouts from the available options." }] },
          { role: "user", parts: [{ text: userMessage }] }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      });
      
      const response = result.response;
      const text = response.text();
      
      return NextResponse.json({ message: text });
    } catch (modelError) {
      console.log("Error with gemini-1.5-pro, falling back to gemini-pro model");
      
      // Fall back to the gemini-pro model if 1.5 isn't available
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const fallbackResult = await fallbackModel.generateContent({
          contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "I understand. I'll help recommend workouts from the available options." }] },
            { role: "user", parts: [{ text: userMessage }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        });
        
        const fallbackResponse = fallbackResult.response;
        const fallbackText = fallbackResponse.text();
        
        return NextResponse.json({ message: fallbackText });
      } catch (fallbackError) {
        throw new Error(`Failed to generate content with both models: ${fallbackError}`);
      }
    }
  } catch (error: any) {
    console.error('Error processing chat request:', error);
    
    // Provide more specific error messages based on the type of error
    if (error.message?.includes('API_KEY_INVALID')) {
      return NextResponse.json(
        { error: 'Invalid API key configuration. Please check your API key.' },
        { status: 401 }
      );
    } else if (error.message?.includes('quota')) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please try again later.' },
        { status: 429 }
      );
    } else if (error.message?.includes('permission') || error.message?.includes('access')) {
      return NextResponse.json(
        { error: 'This API key does not have permission to use the requested model.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process your request', details: error.message },
      { status: 500 }
    );
  }
}