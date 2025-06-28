
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

serve(async (req) => {
  console.log('AI Chat function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if API key exists
    if (!geminiApiKey) {
      console.error('Gemini API key not found in environment variables');
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Gemini API key found, processing request...');

    const requestBody = await req.text();
    console.log('Raw request body:', requestBody);
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(requestBody);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { messages }: { messages: ChatMessage[] } = parsedBody;

    if (!messages || !Array.isArray(messages)) {
      console.error('Messages validation failed:', { messages });
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing chat request with', messages.length, 'messages');

    // Convert messages to Gemini format
    const systemPrompt = `You are Uplift AI, a compassionate mental health and wellness assistant. You provide supportive, empathetic responses to help users with their mental health journey. 

Key guidelines:
- Be warm, understanding, and non-judgmental
- Provide practical wellness tips and coping strategies
- Encourage users to seek professional help when needed
- Never provide medical diagnoses or replace professional therapy
- Focus on mindfulness, self-care, and positive mental health practices
- Keep responses concise but helpful
- If someone expresses serious mental health concerns or suicidal thoughts, encourage them to seek immediate professional help

Your goal is to be a supportive companion on their wellness journey.`;

    // Build conversation history for Gemini
    let conversationText = systemPrompt + "\n\nConversation:\n";
    
    messages.forEach(msg => {
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
        maxOutputTokens: 500,
      }
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
      
      let errorMessage = 'Gemini API request failed';
      if (response.status === 400) {
        errorMessage = 'Invalid request to Gemini API';
      } else if (response.status === 403) {
        errorMessage = 'Gemini API access forbidden - check API key';
      } else if (response.status === 429) {
        errorMessage = 'Gemini API rate limit exceeded';
      } else if (response.status === 500) {
        errorMessage = 'Gemini API server error';
      }
      
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Gemini API response received successfully');
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Invalid response format from Gemini:', data);
      return new Response(JSON.stringify({ error: 'Invalid response format from Gemini' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    console.log('AI Chat response generated successfully');

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
