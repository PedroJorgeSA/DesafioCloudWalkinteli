'use server';

/**
 * @fileOverview A knowledge curation AI agent for a generic payment processor.
 *
 * - knowledgeCuration - A function that handles the knowledge curation process.
 * - KnowledgeCurationInput - The input type for the knowledgeCuration function.
 * - KnowledgeCurationOutput - The return type for the knowledgeCuration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KnowledgeCurationInputSchema = z.object({
  query: z.string().describe('The user query about products, services, and policies.'),
});
export type KnowledgeCurationInput = z.infer<typeof KnowledgeCurationInputSchema>;

const KnowledgeCurationOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});
export type KnowledgeCurationOutput = z.infer<typeof KnowledgeCurationOutputSchema>;

export async function knowledgeCuration(input: KnowledgeCurationInput): Promise<KnowledgeCurationOutput> {
  return knowledgeCurationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'knowledgeCurationPrompt',
  input: {schema: KnowledgeCurationInputSchema},
  output: {schema: KnowledgeCurationOutputSchema},
  prompt: `You are Aura, the knowledge curator. Your goal is to answer questions about the company's products, services, and policies.
\nUse the following information to answer the user's query. If the information is not available, respond that you are sorry, but you don't have the answer to that question right now.\n\nAvailable Information:\n- Card Machine (2.5% debit, 3.5% credit)
- PIX/Instant Payments (free)
- Automatic Withdrawal (1 business day)
- Card (no annual fee)\n- Loan (based on sales)\n\nUser Query: {{{query}}} `,
});

const knowledgeCurationFlow = ai.defineFlow(
  {
    name: 'knowledgeCurationFlow',
    inputSchema: KnowledgeCurationInputSchema,
    outputSchema: KnowledgeCurationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
