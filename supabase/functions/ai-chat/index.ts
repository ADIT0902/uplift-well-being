import "https://deno.land/x/xhr@0.1.0/mod.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

Deno.serve(async (req) => {
  console.log('AI Chat function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200 
    });
  }

  try {
    // Check if API key exists
    if (!geminiApiKey) {
      console.error('Gemini API key not found in environment variables');
      return new Response(JSON.stringify({ 
        error: 'AI service is currently unavailable. Please try again later.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Gemini API key found, processing request...');

    const requestBody = await req.text();
    console.log('Raw request body received');
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(requestBody);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid request format. Please try again.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { messages }: { messages: ChatMessage[] } = parsedBody;

    if (!messages || !Array.isArray(messages)) {
      console.error('Messages validation failed:', { messages });
      return new Response(JSON.stringify({ 
        error: 'Invalid message format. Please try again.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing chat request with', messages.length, 'messages');

    // Enhanced system prompt for better mental health support
    const systemPrompt = `You are Uplift AI, a compassionate and knowledgeable mental health and wellness assistant. Your primary goal is to provide supportive, empathetic, and helpful responses to users on their mental health journey.

Core Guidelines:
- Be warm, understanding, and non-judgmental in all interactions
- Provide practical, evidence-based wellness tips and coping strategies
- Encourage professional help when appropriate, especially for serious concerns
- Never provide medical diagnoses or replace professional therapy
- Focus on mindfulness, self-care, positive mental health practices, and resilience building
- Keep responses helpful but concise (aim for 2-3 paragraphs maximum)
- Use encouraging and hopeful language while validating feelings
- Offer specific, actionable suggestions when possible

Safety Protocols:
- If someone expresses suicidal thoughts or self-harm, immediately encourage them to seek professional help
- Provide crisis resources: "Please reach out for immediate help: Call 988 (US), text HOME to 741741, or contact emergency services"
- For serious mental health concerns, always recommend professional support

Your role is to be a supportive companion, offering guidance, encouragement, and practical tools for mental wellness while maintaining appropriate boundaries.`;

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.role !== 'user') {
      return new Response(JSON.stringify({ 
        error: 'Please provide a message to get started.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build conversation context (last 5 messages for context)
    const recentMessages = messages.slice(-5);
    let conversationText = systemPrompt + "\n\nConversation:\n";
    
    recentMessages.forEach(msg => {
      if (msg.role === 'user') {
        conversationText += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        conversationText += `Assistant: ${msg.content}\n`;
      }
    });
    
    conversationText += "Assistant: ";

    const geminiRequest = {
      contents: [{
        parts: [{
          text: conversationText
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
        stopSequences: ["User:", "Assistant:"]
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    console.log('Sending request to Gemini API...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiRequest),
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      let errorMessage = 'I\'m having trouble responding right now. Please try again in a moment.';
      if (response.status === 400) {
        errorMessage = 'I couldn\'t process your message. Could you try rephrasing it?';
      } else if (response.status === 403) {
        errorMessage = 'AI service is temporarily unavailable. Please try again later.';
      } else if (response.status === 429) {
        errorMessage = 'I\'m getting a lot of requests right now. Please wait a moment and try again.';
      }
      
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 200, // Return 200 to avoid frontend errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Gemini API response received successfully');
    
    // Enhanced response validation
    if (!data.candidates || 
        !data.candidates[0] || 
        !data.candidates[0].content || 
        !data.candidates[0].content.parts || 
        !data.candidates[0].content.parts[0] ||
        !data.candidates[0].content.parts[0].text) {
      
      console.error('Invalid response format from Gemini:', data);
      
      // Check if content was blocked
      if (data.candidates && data.candidates[0] && data.candidates[0].finishReason === 'SAFETY') {
        return new Response(JSON.stringify({ 
          response: "I understand you're reaching out, and I want to help. For your safety and wellbeing, I'd recommend speaking with a mental health professional who can provide the best support. If you're in crisis, please contact 988 (US) or your local emergency services." 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ 
        response: "I'm here to support you, but I'm having trouble generating a response right now. Please try asking your question in a different way, or feel free to reach out to a mental health professional for immediate support." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let aiResponse = data.candidates[0].content.parts[0].text.trim();
    
    // Clean up the response
    aiResponse = aiResponse.replace(/^Assistant:\s*/, '');
    aiResponse = aiResponse.replace(/\n\s*User:.*$/, '');
    
    // Ensure response isn't empty
    if (!aiResponse || aiResponse.length < 10) {
      aiResponse = "I'm here to support you on your wellness journey. Could you tell me a bit more about what's on your mind today?";
    }

    console.log('AI Chat response generated successfully');

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    
    // Return a helpful error message instead of technical details
    return new Response(JSON.stringify({ 
      response: "I'm experiencing some technical difficulties right now. Please try again in a moment, or if you need immediate support, consider reaching out to a mental health professional or crisis helpline." 
    }), {
      status: 200, // Return 200 to avoid frontend errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});