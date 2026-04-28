import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { discussionContent, approachType } = await req.json();

    const prompt = `Generate a speaking prompt for: "${approachType}"

Discussion point: ${discussionContent}

Requirements:
- 1-2 sentences
- Conversational style
- Help speaker continue the discussion

Response:`;

const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.ARK_API_KEY,
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: {
          messages: [
            { role: 'user', content: prompt }
          ]
        },
        parameters: {
          temperature: 0.7,
          max_tokens: 150,
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: 500 });
    }

    const data = await response.json();
    const generatedPrompt = data.output?.text || data.output?.choices?.[0]?.message?.content || '';

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}