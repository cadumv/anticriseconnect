
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

    let systemPrompt = `Você é um especialista em escrita técnica e copywriting para perfis profissionais de engenheiros.
Você domina a norma culta do português brasileiro e conhece a nomenclatura correta de todas as especialidades de engenharia (ex: 'Engenheiro Eletricista' e não 'Engenheiro Elétrico').

Você deve produzir descrições profissionais semelhantes ao seguinte exemplo de alta qualidade:
"Engenheiro Eletricista especializado em NR10, focado em segurança elétrica industrial. Experiência em projetos de energia solar fotovoltaica, garantindo eficiência energética e sustentabilidade."

Suas descrições profissionais devem ser:
- Concisas e diretas (máximo 1 parágrafo)
- Profissionais, técnicas e atrativas para o mercado
- Em primeira pessoa
- Específicas para cada especialidade de engenharia, evitando generalizações
- Ricas em termos técnicos relevantes e precisos para a especialidade
- Livres de erros gramaticais e de nomenclatura técnica
- Sem clichês, lugares-comuns ou frases genéricas
- Destacando diferenciação profissional e valor agregado
- EXATAMENTE 250 caracteres ou menos (isto é OBRIGATÓRIO)
- Em português brasileiro formal e técnico
- Combinando certificações relevantes, áreas de especialização e proposta de valor`;
    
    let userPrompt;
    
    if (action === 'improve') {
      userPrompt = `Melhore esta descrição profissional de um especialista em ${engineeringType || 'Engenharia'}${
        keywords && keywords.length > 0 
          ? ` com expertise em ${keywords.filter(k => k).join(', ')}`
          : ''
      }. 
      
Descrição atual: "${currentDescription}"

Analise criticamente a descrição atual e reescreva-a para:
1. Utilizar a nomenclatura técnica correta da engenharia mencionada
2. Incluir certificações ou normativas relevantes para a área (como NR10 para segurança elétrica)
3. Especificar áreas de especialização técnica com terminologia precisa
4. Usar vocabulário técnico da área específica
5. Eliminar quaisquer generalizações, clichês ou frases feitas
6. Manter tom profissional em primeira pessoa
7. Demonstrar competência técnica específica e valor agregado
8. Garantir correção gramatical e terminológica
9. Apresentar uma proposta de valor clara (como "garantindo eficiência energética")
10. Garantir que tenha EXATAMENTE 250 caracteres ou menos (obrigatório)`;
    } else {
      userPrompt = `Crie uma descrição profissional impactante para um profissional de ${engineeringType || 'Engenharia'}${
        keywords && keywords.length > 0 
          ? ` com expertise em ${keywords.filter(k => k).join(', ')}`
          : ''
      }.

Requisitos:
1. Use a nomenclatura técnica CORRETA para esta especialidade de engenharia
2. Inclua certificações ou normativas relevantes para a área (ex: NR10 para segurança elétrica)
3. Empregue termos técnicos específicos e precisos da área de ${engineeringType}
4. Mencione habilidades e competências valorizadas no mercado atual
5. Relacione explicitamente as competências com as áreas de atuação mencionadas (${keywords && keywords.length > 0 ? keywords.filter(k => k).join(', ') : 'da área'})
6. Destaque o valor diferenciado que o profissional agrega aos projetos e organizações (ex: "garantindo eficiência energética e sustentabilidade")
7. Evite completamente frases genéricas ou clichês que poderiam se aplicar a qualquer profissional
8. Garanta correção gramatical e terminológica impecável
9. Mantenha EXATAMENTE 250 caracteres ou menos (obrigatório)`;
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
        temperature: 0.7, // Slightly increased for more creative yet precise responses
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
