'use server';
/**
 * @fileOverview A Genkit flow for Nexus to analyze financial data and provide insights, reports, and trends.
 *
 * - getFinancialInsights - A function that triggers the financial insights flow.
 * - FinancialInsightsInput - The input type for the getFinancialInsights function.
 * - FinancialInsightsOutput - The return type for the getFinancialInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const salesData = [
  { month: "Janeiro", revenue: 12000, expenses: 8000, profit: 4000 },
  { month: "Fevereiro", revenue: 15000, expenses: 9000, profit: 6000 },
  { month: "Março", revenue: 18000, expenses: 10000, profit: 8000 },
  { month: "Abril", revenue: 16000, expenses: 9500, profit: 6500 },
  { month: "Maio", revenue: 20000, expenses: 11000, profit: 9000 },
  { month: "Junho", revenue: 22000, expenses: 12000, profit: 10000 },
];

const FinancialInsightsInputSchema = z.object({
  query: z.string().describe('Consulta do usuário sobre os dados financeiros.'),
});
export type FinancialInsightsInput = z.infer<typeof FinancialInsightsInputSchema>;

const FinancialInsightsOutputSchema = z.object({
  insights: z.string().describe('Insights, relatórios e tendências derivados dos dados financeiros com base na consulta do usuário.'),
});
export type FinancialInsightsOutput = z.infer<typeof FinancialInsightsOutputSchema>;

export async function getFinancialInsights(input: FinancialInsightsInput): Promise<FinancialInsightsOutput> {
  return financialInsightsFlow(input);
}

const financialInsightsPrompt = ai.definePrompt({
  name: 'financialInsightsPrompt',
  input: {schema: z.object({ query: z.string(), financialData: z.string() })},
  output: {schema: FinancialInsightsOutputSchema},
  prompt: `Você é o Nexus, um analista financeiro. Analise os dados financeiros fornecidos para responder à consulta do usuário. Forneça insights, relatórios e tendências.

Consulta do Usuário: {{{query}}}

Dados Financeiros (últimos 6 meses):
{{{financialData}}}
`,
});

const financialInsightsFlow = ai.defineFlow(
  {
    name: 'financialInsightsFlow',
    inputSchema: FinancialInsightsInputSchema,
    outputSchema: FinancialInsightsOutputSchema,
  },
  async (input) => {
    const financialDataString = JSON.stringify(salesData, null, 2);
    const {output} = await financialInsightsPrompt({
      query: input.query,
      financialData: financialDataString,
    });
    return output!;
  }
);
