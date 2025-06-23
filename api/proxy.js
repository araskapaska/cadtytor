// api/groq-proxy.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = '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'; // Замените на ваш реальный ключ
    const userMessage = req.body.message;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'Ты эксперт по Archicad. Отвечай кратко и по делу на русском языке. Помогай с вопросами по интерфейсу, инструментам и функционалу Archicad.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const botResponse = data.choices[0]?.message?.content || 'Не удалось получить ответ';
    
    res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
