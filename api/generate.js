// File: /api/generate.js (Debugging Version)

export default async function handler(request, response) {
  console.log("--- API Function Started ---"); // Checkpoint 1

  if (request.method !== 'POST') {
    console.log("Error: Method was not POST.");
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userInput, activeTool } = request.body;
    console.log("Checkpoint 2: Received userInput and activeTool.");

    const apiKey = process.env.GEMINI_API_KEY;
    // THIS IS THE MOST IMPORTANT CHECKPOINT
    console.log("Checkpoint 3: Checking for API Key. Is it found?", apiKey ? "Yes" : "No, it is undefined!");

    if (!apiKey) {
      // If the key is missing, this error will be thrown.
      throw new Error("SERVER_ERROR: GEMINI_API_KEY environment variable not found on Vercel.");
    }
    
    const metaPrompt = getMetaPrompt(activeTool, userInput);
    console.log("Checkpoint 4: Meta-prompt created successfully.");

    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    console.log("Checkpoint 5: About to call the Google API...");
    const googleResponse = await fetch(googleApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log("Checkpoint 6: Received a response from Google. Status:", googleResponse.status);

    if (!googleResponse.ok) {
      const errorBody = await googleResponse.json();
      console.error("CRITICAL: Google API returned an error:", errorBody);
      throw new Error(`Google API Error: ${errorBody.error?.message || 'Unknown error'}`);
    }

    const data = await googleResponse.json();
    console.log("Checkpoint 7: Successfully parsed Google's response. Sending data to user.");
    
    // Send the successful response from Google back to the user's browser
    return response.status(200).json(data);

  } catch (error) {
    console.error("--- CATCH BLOCK ERROR ---");
    console.error("The function crashed with this error:", error.message);
    // This sends a structured error back to the browser, which is better than crashing.
    return response.status(500).json({ error: { message: "An internal server error occurred: " + error.message } });
  }
}


// --- Helper Function ---
// (This function is the same as before, no changes needed here)
function getMetaPrompt(action, prompt) {
    // ... all your prompt cases here ...
}