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
  query: z.string().describe('A pergunta do usuário sobre produtos, serviços e políticas.'),
});
export type KnowledgeCurationInput = z.infer<typeof KnowledgeCurationInputSchema>;

const KnowledgeCurationOutputSchema = z.object({
  answer: z.string().describe('A resposta para a pergunta do usuário.'),
});
export type KnowledgeCurationOutput = z.infer<typeof KnowledgeCurationOutputSchema>;

export async function knowledgeCuration(input: KnowledgeCurationInput): Promise<KnowledgeCurationOutput> {
  return knowledgeCurationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'knowledgeCurationPrompt',
  input: {schema: KnowledgeCurationInputSchema},
  output: {schema: KnowledgeCurationOutputSchema},
  prompt: `Você é a Aura, a curadora de conhecimento. Seu objetivo é responder a perguntas sobre os produtos, serviços e políticas da empresa.
\nUse as seguintes informações para responder à consulta do usuário. Se a informação não estiver disponível, responda que lamenta, mas não tem a resposta para essa pergunta no momento.\n\nInformações Disponíveis:\n- Maquininha de Cartão (2.5% débito, 3.5% crédito)
- PIX/Pagamentos Instantâneos (grátis)
- Saque Automático (1 dia útil)
- Cartão (sem anuidade)\n- Empréstimo (baseado nas vendas)\n\nConsulta do Usuário: {{{query}}} `,
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
