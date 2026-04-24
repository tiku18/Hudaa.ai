export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  // We pull the key securely from Vercel's Environment Variables
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ reply: 'Server Error: API key is missing.' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: `You are Hudaa, an Islamic AI assistant. Answer the following question strictly based on the Qur'an, Sunnah, and the understanding of the Salaf al-Salih. Be respectful, highly accurate, and use Arabic terms with English translations where appropriate. Format your response cleanly. Question: ${prompt}` 
          }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const aiReply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: 'Sorry, I am having trouble connecting to the network right now.' });
  }
}
