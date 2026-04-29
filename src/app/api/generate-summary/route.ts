import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { discussionContent, previousViewpoints } = await req.json();

    console.log('=== API /generate-summary ===');
    console.log('discussionContent:', discussionContent);
    console.log('previousViewpoints:', previousViewpoints);
    console.log('previousViewpoints.length:', previousViewpoints?.length);

    const allPoints = previousViewpoints?.length > 0 ? previousViewpoints : [discussionContent];
    console.log('allPoints:', allPoints);
    
    const participantCount = previousViewpoints?.length || 1;
    const pointsText = allPoints.map((p: string, i: number) => (i+1) + '. ' + p).join('\n');
    console.log('pointsText:', pointsText);

    if (!process.env.ARK_API_KEY) {
      console.error('Missing ARK_API_KEY env variable');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const prompt = 'You must respond in ENGLISH only. Analyze this discussion and create a JSON summary. Output ONLY valid JSON, no other text. JSON format:' + JSON.stringify({
      topic: 'Main topic discussed',
      keyPoints: [{sentiment: 'pro', text: 'Support point from discussion', votes: 1}],
      consensus: 'Group consensus summary',
      duration: '05:00',
      participants: participantCount,
      views: participantCount,
      supportData: [{label: 'Support', value: 50}, {label: 'Oppose', value: 30}, {label: 'Neutral', value: 20}],
      decisionTree: [{question: 'Key question from discussion', children: [{answer: 'Agreement', next: 'Next step', support: 50}]}]
    }) + '\n\nDiscussion points:\n' + pointsText + '\n\nRespond in English only. Use English for all fields.:';


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
          temperature: 0.5,
          max_tokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('ARK API error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    const data = await response.json();
    console.log('ARK response:', data);
    let generatedContent = data.output?.text || data.output?.choices?.[0]?.message?.content || '';

    let jsonStr = generatedContent;
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    jsonStr = jsonStr
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

let summary;
    try {
      summary = JSON.parse(jsonStr);
    } catch (e) {
      console.error('JSON parse error:', e, 'Content:', jsonStr.substring(0, 300));
      summary = {
        topic: 'AI in Education Discussion',
        keyPoints: [
          {sentiment: 'pro', text: 'AI tools help students learn faster', votes: 3}, 
          {sentiment: 'con', text: 'Students rely too much on AI', votes: 2}
        ],
        consensus: 'Balance use of AI as a learning supplement',
        duration: '05:00',
        participants: participantCount,
        views: participantCount,
        supportData: [{label: 'Support', value: 60}, {label: 'Oppose', value: 25}, {label: 'Neutral', value: 15}],
        decisionTree: [{question: 'Should AI be encouraged?', children: [{answer: 'Yes', next: 'Balanced use', support: 60}]}]
      };
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}