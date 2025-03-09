
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { engineeringType, keywords, currentDescription, action } = requestData;
    console.log('Request received:', { engineeringType, keywords, action, descriptionLength: currentDescription?.length });
    
    // First verify if we have an OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let prompt;
    
    if (action === 'improve') {
      prompt = `Melhore a seguinte descrição profissional de um especialista em ${engineeringType || 'Engenharia'}${
        keywords && keywords.length > 0 
          ? ` com expertise em ${keywords.filter(k => k).join(', ')}`
          : ''
      }. A descrição deve continuar profissional, concisa (máximo 2 parágrafos) e destacar as competências da área. Mantenha o tom pessoal em primeira pessoa, mas melhore a fluência e impacto. Não ultrapasse 250 caracteres.
      
      Descrição atual: "${currentDescription}"`;
    } else {
      prompt = `Crie uma breve descrição profissional em primeira pessoa para um profissional de ${engineeringType || 'Engenharia'}${
        keywords && keywords.length > 0 
          ? ` com expertise em ${keywords.filter(k => k).join(', ')}`
          : ''
      }. A descrição deve ser profissional, concisa (máximo 2 parágrafos) e destacar as competências da área. Escreva em português do Brasil e evite clichês. Não use mais que 250 caracteres.`;
    }

    console.log('Sending prompt to OpenAI:', prompt);

    // Adjust OpenAI API call to use a more reliable model
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Você é um assistente especializado em criar perfis profissionais concisos e impactantes para engenheiros.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error response:', errorData);
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${response.status} ${response.statusText}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('OpenAI API response:', JSON.stringify(data));
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return new Response(
        JSON.stringify({ error: data.error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the generated description and ensure it doesn't exceed 250 characters
    let description = data.choices[0].message.content.trim();
    
    if (description.length > 250) {
      description = description.substring(0, 247) + '...';
    }
    
    console.log('Generated description:', description);

    return new Response(
      JSON.stringify({ description }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-professional-description function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
