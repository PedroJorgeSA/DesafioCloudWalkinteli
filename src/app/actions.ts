'use server';

import { getEducationalContent } from '@/ai/flows/educational-content-for-pmes';
import { getFinancialInsights } from '@/ai/flows/financial-insights-from-data';
import { knowledgeCuration } from '@/ai/flows/knowledge-curation-for-infinite-pay';

type AgentName = 'aura' | 'nexus' | 'wise';

const agentKeywords: Record<AgentName, string[]> = {
  aura: ['fee', 'pix', 'withdraw', 'card machine', 'account', 'card', 'loan', 'support'],
  nexus: ['analyze', 'analysis', 'sales', 'revenue', 'expenses', 'profit', 'data', 'report'],
  wise: ['how to', 'calculate', 'management', 'planning', 'cash flow', 'margin', 'pricing', 'learn'],
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
        const auraResponse = await knowledgeCuration({ query: message });
        responseText = auraResponse.answer;
        break;
      case 'nexus':
        const nexusResponse = await getFinancialInsights({ query: message });
        responseText = nexusResponse.insights;
        break;
      case 'wise':
        const wiseResponse = await getEducationalContent({ topic: message });
        responseText = wiseResponse.content;
        break;
      default:
        // Fallback to Aura if agent is not identified, though classifyQuery should always return one.
        const defaultResponse = await knowledgeCuration({ query: message });
        responseText = defaultResponse.answer;
        break;
    }
  } catch (error) {
    console.error(`Error processing query with agent ${agentName}:`, error);
    responseText = "An error occurred while trying to get a response. Please try again later.";
  }

  return { agentName, response: responseText };
}
