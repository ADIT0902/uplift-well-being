import { Router } from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/chat', authenticate, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return res.status(500).json({ error: 'AI service is currently unavailable' });
    }

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
      return res.status(400).json({ error: 'Please provide a message to get started.' });
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

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      geminiRequest,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.data.candidates || 
        !response.data.candidates[0] || 
        !response.data.candidates[0].content || 
        !response.data.candidates[0].content.parts || 
        !response.data.candidates[0].content.parts[0] ||
        !response.data.candidates[0].content.parts[0].text) {
      
      // Check if content was blocked
      if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].finishReason === 'SAFETY') {
        return res.json({ 
          response: "I understand you're reaching out, and I want to help. For your safety and wellbeing, I'd recommend speaking with a mental health professional who can provide the best support. If you're in crisis, please contact 988 (US) or your local emergency services." 
        });
      }
      
      return res.json({ 
        response: "I'm here to support you, but I'm having trouble generating a response right now. Please try asking your question in a different way, or feel free to reach out to a mental health professional for immediate support." 
      });
    }

    let aiResponse = response.data.candidates[0].content.parts[0].text.trim();
    
    // Clean up the response
    aiResponse = aiResponse.replace(/^Assistant:\s*/, '');
    aiResponse = aiResponse.replace(/\n\s*User:.*$/, '');
    
    // Ensure response isn't empty
    if (!aiResponse || aiResponse.length < 10) {
      aiResponse = "I'm here to support you on your wellness journey. Could you tell me a bit more about what's on your mind today?";
    }

    res.json({ response: aiResponse });
    
  } catch (error) {
    console.error('Error in AI chat:', error);
    
    res.json({ 
      response: "I'm experiencing some technical difficulties right now. Please try again in a moment, or if you need immediate support, consider reaching out to a mental health professional or crisis helpline." 
    });
  }
});

export default router;