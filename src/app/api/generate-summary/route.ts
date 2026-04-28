import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { discussionContent, previousViewpoints } = await req.json();

    const allPoints = previousViewpoints.length > 0 ? previousViewpoints : [discussionContent];
    
    const participantCount = previousViewpoints.length || 1;
    const pointsText = previousViewpoints.map((p: string, i: number) => (i+1) + '. ' + p).join('\n');
    
    const prompt = '分析讨论:' + pointsText + ' 输出JSON:' + JSON.stringify({
      topic: '主题',
      keyPoints: [{sentiment: 'pro', text: '支持', votes: 1}],
      consensus: '共识',
      duration: '05:00',
      participants: participantCount,
      views: participantCount,
      supportData: [{label: '支持', value: 50}],
      decisionTree: [{question: '问题', children: [{answer: '同意', next: '结论', support: 50}]}]
    });

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

    generatedContent = generatedContent
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/^[\s\S]*?\{/, '{')
      .replace(/\}[\s\S]*$/, '}');

    let summary;
    try {
      summary = JSON.parse(generatedContent);
    } catch {
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          summary = JSON.parse(jsonMatch[0]);
        } catch {
          summary = {
            topic: '讨论主题',
            keyPoints: [{sentiment: 'pro', text: 'AI有助于学习', votes: 3}, {sentiment: 'con', text: '学生过度依赖', votes: 2}],
            consensus: '需要平衡使用',
            duration: '05:00',
            participants: participantCount,
            views: participantCount,
            supportData: [{label: '支持', value: 60}, {label: '反对', value: 40}],
            decisionTree: [{question: 'AI应该被鼓励吗', children: [{answer: '同意', next: '平衡使用', support: 60}]}]
          };
        }
      } else {
        summary = {
          topic: '讨论主题',
          keyPoints: [{sentiment: 'pro', text: 'AI有助于学习', votes: 3}, {sentiment: 'con', text: '学生过度依赖', votes: 2}],
          consensus: '需要平衡使用',
          duration: '05:00',
          participants: participantCount,
          views: participantCount,
          supportData: [{label: '支持', value: 60}, {label: '反对', value: 40}],
          decisionTree: [{question: 'AI应该被鼓励吗', children: [{answer: '同意', next: '平衡使用', support: 60}]}]
        };
      }
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}