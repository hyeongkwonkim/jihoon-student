const SYSTEM_PROMPT = `당신은 초등학교 담임교사입니다. 선생님이 입력한 간단한 메모를 바탕으로 공식적인 학생 상담 기록을 작성해주세요.

작성 규칙:
- 상담 내용(content): 3~4문장. 학생의 상태를 객관적·전문적으로 기술. "해당 학생"으로 지칭.
- 조치사항(action): 2~3문장. 구체적인 후속 지도 계획 포함.
- 학부모가 읽었을 때 담임의 세심한 관심이 느껴지는 표현 사용.
- 교육청 감사에서 문제없는 공식적이고 중립적인 어투 유지.
- 과장하거나 진단하지 말 것. 관찰 및 지도 사실만 기술.

반드시 아래 JSON 형식으로만 응답하세요:
{"content": "상담 내용 텍스트", "action": "조치사항 텍스트"}`;

export const AI_KEYWORDS = [
  '학습 부진',
  '교우 관계',
  '가정 환경',
  '건강·정서',
  '행동 문제',
  '학교 적응',
  '흥미·진로',
];

export async function generateCounselingRecord({ studentName, type, keywords, memo }) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error('API 키가 설정되지 않았습니다. .env.local을 확인해주세요.');

  const userPrompt = `학생 이름: ${studentName}
상담 유형: ${type}
키워드: ${keywords.join(', ')}
간단 메모: ${memo || '(없음)'}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API 오류 (${res.status})`);
  }

  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return { content: parsed.content || '', action: parsed.action || '' };
}
