/**
 * Anthropic Claude API Integration
 * 
 * This file contains functions to interact with the Anthropic Claude API
 * for generating website content and suggestions.
 */

import { useState, useEffect } from 'react';

// Server proxy configuration
const API_URL = '/api/anthropic';

// Error types for better error handling
type ClaudeErrorType = 'api_key_missing' | 'network_error' | 'api_error' | 'parsing_error';

// Interface for the response structure
interface ClaudeResponse {
  text: string;
  success: boolean;
  error?: {
    type: ClaudeErrorType;
    message: string;
  };
}

/**
 * Function to generate content using Anthropic Claude API
 * @param prompt - The prompt to send to the API
 */
export async function generateContent(prompt: string): Promise<ClaudeResponse> {
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
    const generatedText = responseData.data?.content?.[0]?.text || '';

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
 * Custom hook for using Claude API
 * @param initialPrompt - Initial prompt to send to the API
 */
export function useClaude(initialPrompt: string = '') {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [response, setResponse] = useState<ClaudeResponse>({ text: '', success: true });
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
export async function generateWebsiteDesignSuggestions(description: string): Promise<ClaudeResponse> {
  const enhancedPrompt = `
    Act as a professional web designer. Generate design suggestions for a website based on the following description:
    
    ${description}
    
    Please provide:
    1. Color palette suggestions (with hex codes)
    2. Typography recommendations
    3. Layout structure ideas
    4. Key visual elements to include
    5. Mobile responsiveness considerations
    6. Subtle animation and interaction suggestions
    7. Visual hierarchy recommendations
    
    Format your response in a clear, structured way that a developer could easily follow.
  `;
  
  return generateContent(enhancedPrompt);
}

/**
 * Function to generate a complete design system
 * @param websiteDescription - Description of the website and brand
 */
export async function generateDesignSystem(websiteDescription: string): Promise<ClaudeResponse> {
  const enhancedPrompt = `
    Act as an expert UI/UX designer specializing in design systems. 
    
    Based on this website description: "${websiteDescription}"
    
    Create a comprehensive design system with:
    
    1. BRAND IDENTITY:
       - Core brand values and personality traits
       - Logo usage guidelines
       - Brand voice and tone
    
    2. COLOR SYSTEM:
       - Primary color: #E31837 (Luxembourg Pas Chère red)
       - Secondary color palette (provide 4-5 complementary colors with hex codes)
       - Functional colors (success, warning, error, info)
       - Background color variations
       - Color usage rules and accessibility considerations
    
    3. TYPOGRAPHY:
       - Primary and secondary font recommendations (prioritize web-safe or Google Fonts)
       - Font sizing system (base size, scale, and hierarchy)
       - Line height and spacing guidelines
       - Font weight usage for different contexts
    
    4. SPACING SYSTEM:
       - Define a consistent spacing scale (in pixels and rems)
       - Padding and margin standards
       - Content width constraints and breakpoints
    
    5. COMPONENT DESIGN:
       - Button styles (primary, secondary, tertiary)
       - Form elements (inputs, selects, checkboxes)
       - Navigation components
       - Card and container designs
       - Alert/notification styles
    
    6. INTERACTION PATTERNS:
       - Hover and focus states
       - Animation principles (timing, easing)
       - Loading states and feedback
       - Micro-interactions
    
    7. RESPONSIVE DESIGN PRINCIPLES:
       - Mobile-first approach guidelines
       - Key breakpoints (pixel values)
       - Component adaptation rules
    
    Format this as a concise design system guide that can be directly implemented by developers using Tailwind CSS and React.
  `;
  
  return generateContent(enhancedPrompt);
}

/**
 * Function to analyze website design and provide improvement suggestions
 * @param websiteDescription - Description of the current website design
 */
export async function analyzeWebsiteDesign(websiteDescription: string): Promise<ClaudeResponse> {
  const enhancedPrompt = `
    Act as a UX/UI expert. Analyze the following website design and provide improvement suggestions:
    
    ${websiteDescription}
    
    Please provide:
    1. UX/UI improvement suggestions
    2. Accessibility improvements
    3. Performance optimization ideas
    4. Visual hierarchy recommendations
    5. Call-to-action effectiveness analysis
    6. Mobile responsiveness enhancements
    7. Animation and interaction recommendations
    
    Format your response in a clear, structured way with actionable recommendations.
  `;
  
  return generateContent(enhancedPrompt);
}

/**
 * Function to generate CSS animations and transitions
 * @param elementDescription - Description of the element to animate
 */
export async function generateAnimationSuggestions(elementDescription: string): Promise<ClaudeResponse> {
  const enhancedPrompt = `
    Act as a CSS animation expert. For the following element:
    
    ${elementDescription}
    
    Please provide:
    1. 3-5 subtle animation or transition ideas
    2. Detailed CSS code for each animation
    3. Recommended timing and easing functions
    4. Considerations for reduced motion preferences
    5. Performance optimization tips
    
    Format your response with clear code examples and implementation notes.
  `;
  
  return generateContent(enhancedPrompt);
}

/**
 * Function to generate responsive design recommendations
 * @param componentDescription - Description of the component to make responsive
 */
export async function generateResponsiveDesignSuggestions(componentDescription: string): Promise<ClaudeResponse> {
  const enhancedPrompt = `
    Act as a responsive design expert. For the following component:
    
    ${componentDescription}
    
    Please provide:
    1. Mobile-first implementation approach
    2. Specific breakpoint recommendations
    3. Layout adaptation strategy
    4. Content prioritization guidelines
    5. Touch interaction considerations
    6. Media query examples with Tailwind classes
    
    Format your response with practical code examples and best practices.
  `;
  
  return generateContent(enhancedPrompt);
}