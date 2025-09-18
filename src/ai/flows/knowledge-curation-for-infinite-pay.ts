'use server';

/**
 * @fileOverview A knowledge curation AI agent for InfinitePay.
 *
 * - knowledgeCurationForInfinitePay - A function that handles the knowledge curation process.
 * - KnowledgeCurationForInfinitePayInput - The input type for the knowledgeCurationForInfinitePay function.
 * - KnowledgeCurationForInfinitePayOutput - The return type for the knowledgeCurationForInfinitePay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KnowledgeCurationForInfinitePayInputSchema = z.object({
  query: z.string().describe('The user query about InfinitePay products, services, and policies.'),
});
export type KnowledgeCurationForInfinitePayInput = z.infer<typeof KnowledgeCurationForInfinitePayInputSchema>;

const KnowledgeCurationForInfinitePayOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});
export type KnowledgeCurationForInfinitePayOutput = z.infer<typeof KnowledgeCurationForInfinitePayOutputSchema>;

export async function knowledgeCurationForInfinitePay(input: KnowledgeCurationForInfinitePayInput): Promise<KnowledgeCurationForInfinitePayOutput> {
  return knowledgeCurationForInfinitePayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'knowledgeCurationForInfinitePayPrompt',
  input: {schema: KnowledgeCurationForInfinitePayInputSchema},
  output: {schema: KnowledgeCurationForInfinitePayOutputSchema},
  prompt: `You are Aura, the knowledge curator for InfinitePay. Your goal is to answer questions about InfinitePay's products, services, and policies.
\nUse the following information to answer the user's query. If the information is not available, respond that you are sorry, but you don't have the answer to that question right now.\n\nAvailable Information:\n- Maquininha (2.5% débito, 3.5% crédito)
- PIX (gratuito)
- Saque automático (1 dia útil)
- Cartão (sem anuidade)\n- Empréstimo (baseado em vendas)\n\nUser Query: {{{query}}} `,
});

const knowledgeCurationForInfinitePayFlow = ai.defineFlow(
  {
    name: 'knowledgeCurationForInfinitePayFlow',
    inputSchema: KnowledgeCurationForInfinitePayInputSchema,
    outputSchema: KnowledgeCurationForInfinitePayOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
