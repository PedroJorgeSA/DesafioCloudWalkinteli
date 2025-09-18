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
    .describe('The topic for which educational content is requested.'),
  userProfile: z
    .string()
    .optional()
    .default('SME')
    .describe('The user profile, defaults to SME (Small and Medium Enterprise).'),
});
export type GetEducationalContentInput = z.infer<
  typeof GetEducationalContentInputSchema
>;

const GetEducationalContentOutputSchema = z.object({
  content: z
    .string()
    .describe('The educational content tailored for the specified topic.'),
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
  prompt: `You are a financial educator specializing in providing guidance to Small and Medium Enterprises. You will generate educational content on the following topic: {{{topic}}}. Focus on providing practical advice and insights. Frame your response as rules or concepts related to the requested topics to improve financial literacy, and do not give investment advice.`,
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
