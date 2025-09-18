'use server';
/**
 * @fileOverview A financial education AI agent for Small and Medium Enterprises.
 *
 * - getEducationalContent - A function that provides educational content tailored for SMEs.
 * - GetEducationalContentInput - The input type for the getEducationalContent function.
 * - GetEducationalContentOutput - The return type for the getEducationalContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetEducationalContentInputSchema = z.object({
  topic: z
    .string()
    .describe('O tópico para o qual o conteúdo educacional é solicitado.'),
  userProfile: z
    .string()
    .optional()
    .default('PME')
    .describe('O perfil do usuário, o padrão é PME (Pequena e Média Empresa).'),
});
export type GetEducationalContentInput = z.infer<
  typeof GetEducationalContentInputSchema
>;

const GetEducationalContentOutputSchema = z.object({
  content: z
    .string()
    .describe('O conteúdo educacional adaptado para o tópico especificado.'),
});
export type GetEducationalContentOutput = z.infer<
  typeof GetEducationalContentOutputSchema
>;

export async function getEducationalContent(
  input: GetEducationalContentInput
): Promise<GetEducationalContentOutput> {
  return getEducationalContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'educationalContentPrompt',
  input: {schema: GetEducationalContentInputSchema},
  output: {schema: GetEducationalContentOutputSchema},
  prompt: `Você é um educador financeiro especializado em fornecer orientação para Pequenas e Médias Empresas. Você irá gerar conteúdo educacional sobre o seguinte tópico: {{{topic}}}. Concentre-se em fornecer conselhos práticos e insights. Enquadre sua resposta como regras ou conceitos relacionados aos tópicos solicitados para melhorar a alfabetização financeira e não dê conselhos de investimento.`,
});

const getEducationalContentFlow = ai.defineFlow(
  {
    name: 'getEducationalContentFlow',
    inputSchema: GetEducationalContentInputSchema,
    outputSchema: GetEducationalContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
