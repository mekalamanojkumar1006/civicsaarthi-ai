// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This code runs in Supabase Edge Functions (Deno runtime)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ChatRequestBody {
  prompt: string
  language?: 'en' | 'te'
  context?: string
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
}

const SYSTEM_INSTRUCTION = `You are CivicSaarthi AI (సివిక్ సారథి), an official citizen welfare assistant for India with special depth on Telangana and Central Government welfare schemes.
Your mission is to guide citizens accurately, empathetically, and reliably on government schemes, subsidies, eligibility, application processes, and required documents.

GUIDELINES:
1. Provide accurate, factual, and actionable information based on official Government of India (GoI) and State Government portals.
2. Always clarify that your answers are preliminary informational guidance and not official government determinations.
3. If the user asks in Telugu (or requests Telugu), respond in clear, fluent Telugu (తెలుగు) with English scheme names in parentheses where appropriate.
4. If the user asks in English, respond in professional, accessible English.
5. Ground your answers with official source references (e.g., pmkisan.gov.in, pmsuryaghar.gov.in, nha.gov.in, telangana.gov.in, myscheme.gov.in).
6. Mention specific criteria (income limit, land holding, domicile, category) and required documents (Aadhaar, Ration Card, Income Certificate, Caste Certificate, etc.) when relevant.
7. Be structured, concise, and helpful. Never fabricate government benefits, subsidy amounts, or approval guarantees.`

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'GEMINI_API_KEY is not configured in Supabase secrets.',
          isDemoFallback: true,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    const { prompt, language = 'en', context, history = [] }: ChatRequestBody = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Prompt is required.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Build Gemini contents payload
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = []

    // Add recent conversation history if provided
    for (const msg of history.slice(-6)) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })
    }

    // Format current prompt with optional RAG / document context
    let promptText = prompt
    if (context) {
      promptText = `[RETRIEVED OFFICIAL DOCUMENT CONTEXT]:\n${context}\n\n[CITIZEN QUESTION]:\n${prompt}\n\nPlease answer the citizen question strictly using the provided document context where relevant, and cite specific clauses or page details.`
    }

    contents.push({
      role: 'user',
      parts: [{ text: promptText }],
    })

    // Call Google Gemini API (gemini-2.5-flash with fallback to gemini-1.5-flash)
    let geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents,
          generationConfig: {
            temperature: 0.2,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    // Fallback model if 2.5-flash is unavailable
    if (!geminiResponse.ok && geminiResponse.status === 404) {
      geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_INSTRUCTION }],
            },
            contents,
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1024,
            },
          }),
        }
      )
    }

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      return new Response(
        JSON.stringify({
          success: false,
          error: `Gemini API returned status ${geminiResponse.status}: ${errorText}`,
          isDemoFallback: true,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    const geminiData = await geminiResponse.json()
    const responseText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No response generated. Please refine your query.'

    // Extract citations or construct standard authoritative source citations
    const citations = [
      {
        title: 'myScheme National Citizen Portal',
        sourceName: 'Ministry of Electronics & Information Technology, GoI',
        sourceUrl: 'https://myscheme.gov.in',
        clauseReference: 'National Welfare Registry',
        isDemoCitation: false,
      },
    ]

    return new Response(
      JSON.stringify({
        success: true,
        text: responseText,
        citations,
        model: 'gemini-2.5-flash',
        isLiveAi: true,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error'
    return new Response(
      JSON.stringify({
        success: false,
        error: message,
        isDemoFallback: true,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  }
})
