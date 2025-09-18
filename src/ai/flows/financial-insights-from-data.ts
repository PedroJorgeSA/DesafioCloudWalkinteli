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
  { month: "January", revenue: 12000, expenses: 8000, profit: 4000 },
  { month: "February", revenue: 15000, expenses: 9000, profit: 6000 },
  { month: "March", revenue: 18000, expenses: 10000, profit: 8000 },
  { month: "April", revenue: 16000, expenses: 9500, profit: 6500 },
  { month: "May", revenue: 20000, expenses: 11000, profit: 9000 },
  { month: "June", revenue: 22000, expenses: 12000, profit: 10000 },
];

const FinancialInsightsInputSchema = z.object({
  query: z.string().describe('User query about the financial data.'),
});
export type FinancialInsightsInput = z.infer<typeof FinancialInsightsInputSchema>;

const FinancialInsightsOutputSchema = z.object({
  insights: z.string().describe('Insights, reports, and trends derived from the financial data based on the user query.'),
});
export type FinancialInsightsOutput = z.infer<typeof FinancialInsightsOutputSchema>;

export async function getFinancialInsights(input: FinancialInsightsInput): Promise<FinancialInsightsOutput> {
  return financialInsightsFlow(input);
}

const financialInsightsPrompt = ai.definePrompt({
  name: 'financialInsightsPrompt',
  input: {schema: z.object({ query: z.string(), financialData: z.string() })},
  output: {schema: FinancialInsightsOutputSchema},
  prompt: `You are Nexus, a financial analyst. Analyze the provided financial data to answer the user's query. Provide insights, reports, and trends.

User Query: {{{query}}}

Financial Data (last 6 months):
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
