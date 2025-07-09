// In your file: /api/generate.js

export default async function handler(req, res) {
  // 1. Ensure this is a POST request
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // 2. Get the prompt from the request body
  const { metaPrompt } = req.body;

  if (!metaPrompt) {
    return res.status(400).json({ error: 'metaPrompt is required in the request body.' });
  }

  // 3. Get the API key securely from environment variables
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("API Key is not configured.");
    return res.status(500).json({ error: 'API key is not configured on the server.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const payload = { contents: [{ role: "user", parts: [{ text: metaPrompt }] }] };

  try {
    // 4. Call the Google API
    const googleResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!googleResponse.ok) {
      // If Google's API returns an error, forward it
      const errorData = await googleResponse.json();
      console.error("Google API Error:", errorData);
      return res.status(googleResponse.status).json({ error: errorData.error.message });
    }

    const data = await googleResponse.json();
    
    // 5. Send the successful response back to the frontend
    return res.status(200).json(data);

  } catch (error) {
    // 6. Catch any other errors and send a JSON response
    console.error("Internal Server Error:", error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
}