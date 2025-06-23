// api/groq-proxy.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';
        const userMessage = req.body.message;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama3-70b-8192',
                messages: [
                    {
                        role: 'system',
                        content: 'Ты эксперт по Archicad. Отвечай кратко и точно на русском языке. Помогай с вопросами по интерфейсу, инструментам и функциям программы.'
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
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const botResponse = data.choices[0]?.message?.content || "Не удалось получить ответ";
        
        res.status(200).json({ response: botResponse });
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
