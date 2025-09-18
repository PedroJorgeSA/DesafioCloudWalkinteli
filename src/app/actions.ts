'use server';

import { getEducationalContent } from '@/ai/flows/educational-content-for-pmes';
import { getFinancialInsights } from '@/ai/flows/financial-insights-from-data';
import { knowledgeCurationForInfinitePay } from '@/ai/flows/knowledge-curation-for-infinite-pay';

type AgentName = 'aura' | 'nexus' | 'wise';

const agentKeywords: Record<AgentName, string[]> = {
  aura: ['taxa', 'pix', 'saque', 'maquininha', 'conta', 'cartão', 'empréstimo', 'suporte'],
  nexus: ['analise', 'análise', 'vendas', 'receita', 'despesas', 'lucro', 'dados', 'relatório'],
  wise: ['como', 'calcular', 'gestão', 'planejamento', 'fluxo', 'margem', 'precificação', 'aprender'],
};

function classifyQuery(query: string): AgentName {
  const queryLower = query.toLowerCase();

  const scores: Record<AgentName, number> = {
    aura: 0,
    nexus: 0,
    wise: 0,
  };

  for (const agent in agentKeywords) {
    for (const keyword of agentKeywords[agent as AgentName]) {
      if (queryLower.includes(keyword)) {
        scores[agent as AgentName]++;
      }
    }
  }

  const maxScore = Math.max(...Object.values(scores));
  
  if (maxScore > 0) {
    const bestAgent = Object.keys(scores).find(agent => scores[agent as AgentName] === maxScore) as AgentName;
    return bestAgent;
  }

  // Default to Aura for general queries
  return 'aura';
}

export async function processQuery(message: string): Promise<{ agentName: AgentName; response: string }> {
  const agentName = classifyQuery(message);
  let responseText = "I'm sorry, I couldn't process your request.";

  try {
    switch (agentName) {
      case 'aura':
        const auraResponse = await knowledgeCurationForInfinitePay({ query: message });
        responseText = auraResponse.answer;
        break;
      case 'nexus':
        const nexusResponse = await getFinancialInsights({ financialData: message });
        responseText = nexusResponse.insights;
        break;
      case 'wise':
        const wiseResponse = await getEducationalContent({ topic: message });
        responseText = wiseResponse.content;
        break;
      default:
        // Fallback to Aura if agent is not identified, though classifyQuery should always return one.
        const defaultResponse = await knowledgeCurationForInfinitePay({ query: message });
        responseText = defaultResponse.answer;
        break;
    }
  } catch (error) {
    console.error(`Error processing query with agent ${agentName}:`, error);
    responseText = "An error occurred while trying to get a response. Please try again later.";
  }

  return { agentName, response: responseText };
}
