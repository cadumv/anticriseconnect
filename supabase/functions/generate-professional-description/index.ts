
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

    let systemPrompt = `Você é um assistente especializado em criar perfis profissionais impactantes para engenheiros. 
Suas descrições devem ser:
- Concisas e diretas (máximo 1 parágrafo)
- Profissionais e técnicas 
- Em primeira pessoa
- Focadas nas competências específicas da área de engenharia mencionada
- Incluir termos técnicos relevantes para a especialidade
- Evitar clichês e frases genéricas
- EXATAMENTE 250 caracteres ou menos (isto é obrigatório)
- Em português brasileiro formal`;
    
    let userPrompt;
    
    if (action === 'improve') {
      userPrompt = `Melhore esta descrição profissional de um especialista em ${engineeringType || 'Engenharia'}${
        keywords && keywords.length > 0 
          ? ` com expertise em ${keywords.filter(k => k).join(', ')}`
          : ''
      }. 
      
Descrição atual: "${currentDescription}"

Analise criticamente a descrição atual e reescreva-a para:
1. Torná-la mais impactante e técnica
2. Usar vocabulário mais preciso da área
3. Eliminar quaisquer clichês ou generalizações
4. Manter tom profissional em primeira pessoa
5. Demonstrar competência técnica específica
6. Garantir que tenha EXATAMENTE 250 caracteres ou menos (obrigatório)`;
    } else {
      userPrompt = `Crie uma breve descrição profissional para um profissional de ${engineeringType || 'Engenharia'}${
        keywords && keywords.length > 0 
          ? ` com expertise em ${keywords.filter(k => k).join(', ')}`
          : ''
      }.

Dicas:
1. Use termos técnicos específicos da área de ${engineeringType}
2. Mencione habilidades e competências valorizadas no mercado
3. Inclua referências aos conhecimentos específicos (${keywords && keywords.length > 0 ? keywords.filter(k => k).join(', ') : 'da área'})
4. Destaque o valor que o profissional agrega aos projetos
5. Mantenha EXATAMENTE 250 caracteres ou menos (obrigatório)`;
    }

    console.log('Sending prompts to OpenAI:');
    console.log('System prompt:', systemPrompt);
    console.log('User prompt:', userPrompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using the more advanced model for better quality
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6, // Slightly lower for more consistent responses
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
      description = description.substring(0, 250);
      console.log('Description truncated to 250 characters');
    }
    
    console.log('Final generated description:', description);
    console.log('Character count:', description.length);

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
