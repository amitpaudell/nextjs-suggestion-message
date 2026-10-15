import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const prompt = `
      Create a list of exactly three open-ended and engaging questions
      for an anonymous social messaging platform like Qooh.me.

      Requirements:
      - Make the questions suitable for a diverse audience.
      - Avoid personal or sensitive topics.
      - Focus on universal themes that encourage friendly interaction.
      - Make each question intriguing and welcoming.
      - Return only the three questions as a single string.
      - Separate each question using exactly ||.
      - Do not add numbering, introductions, or explanations.

      Example format:
      What's a hobby you've recently started?||
      If you could have dinner with any historical figure, who would it be?||
      What's a simple thing that makes you happy?
    `;

    const result = streamText({
      model: openai('gpt-4o-mini'),
      prompt,
      maxOutputTokens: 200,
      onError({ error }) {
        console.error('OpenAI streaming error:', error);
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Unexpected API error:', error);

    return NextResponse.json(
      { message: 'Failed to generate questions.' },
      { status: 500 },
    );
  }
}
