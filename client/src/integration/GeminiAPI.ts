/**
 * Google Gemini Flash API Integration
 * 
 * This file contains functions to interact with the Google Gemini Flash API
 * for generating website content and suggestions.
 */

import { useState, useEffect } from 'react';

// Server proxy configuration
const API_URL = '/api/gemini';

// Error types for better error handling
type GeminiErrorType = 'api_key_missing' | 'network_error' | 'api_error' | 'parsing_error';

// Interface for the response structure
interface GeminiResponse {
  text: string;
  success: boolean;
  error?: {
    type: GeminiErrorType;
    message: string;
  };
}

/**
 * Function to generate content using Google Gemini API
 * @param prompt - The prompt to send to the API
 */
export async function generateContent(prompt: string): Promise<GeminiResponse> {
  try {
    // Prepare the request payload for server proxy
    const payload = {
      prompt: prompt
    };

    // Make the API request to server proxy
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();

      // Handle different server error types
      if (response.status === 429) {
        return {
          text: '',
          success: false,
          error: {
            type: 'api_error',
            message: 'Rate limit exceeded - please try again later'
          }
        };
      }

      if (response.status >= 500) {
        return {
          text: '',
          success: false,
          error: {
            type: 'network_error',
            message: 'Server error - please try again later'
          }
        };
      }

      return {
        text: '',
        success: false,
        error: {
          type: 'api_error',
          message: `API Error: ${errorData.message || 'Unknown error'}`
        }
      };
    }

    // Parse the response from server proxy
    const responseData = await response.json();

    if (!responseData.success) {
      return {
        text: '',
        success: false,
        error: {
          type: 'api_error',
          message: `Server Error: ${responseData.message || 'Unknown error'}`
        }
      };
    }

    // Extract the generated text from the server's response
    const generatedText = responseData.data?.content || '';

    return {
      text: generatedText,
      success: true
    };
  } catch (error: any) {
    return {
      text: '',
      success: false,
      error: {
        type: 'network_error',
        message: `Network Error: ${error.message}`
      }
    };
  }
}

/**
 * Custom hook for using Gemini API
 * @param initialPrompt - Initial prompt to send to the API
 */
export function useGemini(initialPrompt: string = '') {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [response, setResponse] = useState<GeminiResponse>({ text: '', success: true });
  const [loading, setLoading] = useState(false);

  const generateResponse = async (newPrompt?: string) => {
    const promptToUse = newPrompt || prompt;
    if (!promptToUse) return;

    setLoading(true);
    try {
      const result = await generateContent(promptToUse);
      setResponse(result);
    } catch (error: any) {
      setResponse({
        text: '',
        success: false,
        error: {
          type: 'parsing_error',
          message: `Error: ${error.message}`
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPrompt) {
      generateResponse(initialPrompt);
    }
  }, []);

  return {
    prompt,
    setPrompt,
    response,
    loading,
    generateResponse
  };
}

/**
 * Function to generate website design suggestions
 * @param description - Description of the website design needed
 */
export async function generateWebsiteDesignSuggestions(description: string): Promise<GeminiResponse> {
  const enhancedPrompt = `
    Act as a professional web designer. Generate design suggestions for a website based on the following description:
    
    ${description}
    
    Please provide:
    1. Color palette suggestions (with hex codes)
    2. Typography recommendations
    3. Layout structure ideas
    4. Key visual elements to include
    5. Mobile responsiveness considerations
    
    Format your response in a clear, structured way that a developer could easily follow.
  `;
  
  return generateContent(enhancedPrompt);
}

/**
 * Function to generate SEO content suggestions
 * @param topic - The topic or page to generate SEO content for
 */
export async function generateSEOContentSuggestions(topic: string): Promise<GeminiResponse> {
  const enhancedPrompt = `
    Act as an SEO expert. Generate SEO content suggestions for a website page about:
    
    ${topic}
    
    Please provide:
    1. 3-5 SEO-optimized heading suggestions
    2. Meta description (155 characters max)
    3. 5 relevant keywords to target
    4. Brief content outline (200-300 words)
    5. Call-to-action suggestions
    
    Format your response in a clear, structured way.
  `;
  
  return generateContent(enhancedPrompt);
}

/**
 * Function to analyze website design and provide improvement suggestions
 * @param websiteDescription - Description of the current website design
 */
export async function analyzeWebsiteDesign(websiteDescription: string): Promise<GeminiResponse> {
  const enhancedPrompt = `
    Act as a UX/UI expert. Analyze the following website design and provide improvement suggestions:
    
    ${websiteDescription}
    
    Please provide:
    1. UX/UI improvement suggestions
    2. Accessibility improvements
    3. Performance optimization ideas
    4. Visual hierarchy recommendations
    5. Call-to-action effectiveness analysis
    
    Format your response in a clear, structured way with actionable recommendations.
  `;
  
  return generateContent(enhancedPrompt);
}