// File: /api/generate.js

// This is the function that will be executed when a request comes to /api/generate
export default async function handler(request, response) {
  // We only want to handle POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Get the user's prompt and the active tool from the request body sent by the client
    const { userInput, activeTool } = request.body;
    
    // This is the secret key. It's read from the Vercel Environment Variables.
    // It is NEVER exposed to the public client-side code.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("API key is not configured on the server.");
    }
    
    // We re-create the meta-prompt on the server, which is more secure
    const metaPrompt = getMetaPrompt(activeTool, userInput);

    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: metaPrompt }] }]
    };

    // Make the actual call to the Google API from the server
    const googleResponse = await fetch(googleApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!googleResponse.ok) {
      const errorBody = await googleResponse.json();
      console.error("Google API Error:", errorBody);
      // Forward the error from Google's API to our client
      return response.status(googleResponse.status).json(errorBody);
    }

    const data = await googleResponse.json();
    
    // Send the successful response from Google back to the user's browser
    response.status(200).json(data);

  } catch (error) {
    // Handle any other errors that might occur
    console.error("Internal Server Error:", error);
    response.status(500).json({ error: { message: error.message || "An unknown error occurred." } });
  }
}


// --- Helper Function ---
// This function constructs the correct prompt based on the tool the user selected
function getMetaPrompt(action, prompt) {
    const prompts = {
        refine: `You are an expert prompt engineer. Your task is to refine and enhance the following user-submitted prompt to make it clearer, more specific, and more effective for a large language model. Add details, context, and constraints. Return only the improved prompt.`,
        variations: `You are a creative prompt assistant. Your task is to generate 3 distinct yet related variations of the user's prompt. Each variation should explore a different angle, style, or focus. Format the output as a numbered list.`,
        ideas: `You are an idea-generation bot. Based on the user's topic, brainstorm 5 creative and interesting prompt ideas that could be used to generate compelling text, stories, or scripts. Format the output as a numbered list.`,
        persona: `You are an expert prompt engineer. The user wants to add a persona to their prompt. Analyze the user's input, which contains the desired persona and the base prompt (e.g., "Persona: a cynical detective. Prompt: describe a rainy night"). Your task is to integrate the persona seamlessly into the prompt to guide the AI's voice and style. Return the complete, refined prompt.`,
        format: `You are a formatting expert for AI prompts. The user will provide a desired format and a base prompt (e.g., "Format: JSON with keys 'name' and 'capital'. Prompt: list of European countries and their capitals"). Your task is to combine these into a single, clear prompt that instructs the AI to generate the output in the specified format. Return only the final, combined prompt.`,
        constraints: `You are an expert prompt engineer specializing in constraints. The user will provide a constraint and a base prompt (e.g., "Constraint: use simple language, under 50 words. Prompt: explain quantum computing"). Your task is to merge the constraint into the prompt in a way that effectively limits the AI's output as requested. Return only the final, constrained prompt.`,
        summarize: `You are a text analysis expert. Your task is to summarize the following text. Create a concise summary that captures the main points and key information. Format the output with a main summary paragraph followed by bullet points for key takeaways.`,
        grammar: `You are an expert editor. Please proofread the following text for grammatical errors, spelling mistakes, awkward phrasing, and punctuation issues. Provide a corrected version of the text. If the text is perfect, simply state that "The text is grammatically correct and requires no changes."`,
        keywords: `You are an SEO expert. Your task is to extract the most relevant keywords from the following text. Please categorize them into 'Primary Keywords' (main topics), 'Secondary Keywords' (related terms), and 'Long-tail Keywords' (phrases of 3+ words). Format the output clearly with Markdown headings for each category.`,
        tone: `You are a communications expert. Your task is to adjust the tone of the following text. The user will provide the text and the desired new tone. Rewrite the text to match the new tone while preserving the core message. The user input format will be: [Desired Tone] followed by the text. For example: "Formal: [user's text]".`,
        plagiarism: `You are a plagiarism detection assistant. Your task is to analyze the following text and identify if there are sections that are likely unoriginal. While you cannot browse the web in real-time, simulate a plagiarism check by identifying sentences or phrases that are generic, common knowledge, or sound like they might be copied from a source. For each potentially unoriginal part, quote it and briefly explain why it was flagged. If the text seems original, state that clearly.`,
        seo: `You are an SEO expert. Based on the following topic or keywords, generate a compelling, SEO-friendly meta title (under 60 characters) and a meta description (under 160 characters). The description should be engaging and include a call-to-action. Format the output clearly with "Meta Title" and "Meta Description" headings.`,
        content: `You are a content strategist. Based on the following blog post topic, create a detailed and well-structured outline. The outline should include a catchy headline, an introduction hook, at least 3-4 main sections with sub-bullet points for key ideas, and a concluding summary.`,
        code: `You are a senior software developer and code reviewer. Analyze the following code snippet. Your task is to refactor it by improving its readability, efficiency, and adherence to best practices. Provide the refactored code and a brief, bulleted list of the specific changes you made and why.`,
        design: `You are a UX writer. Based on the following description of a UI element, generate three distinct options for clear, concise, and user-friendly copy. Label them "Option 1", "Option 2", and "Option 3".`
    };
    return `${prompts[action]}\n\nUser's input: "${prompt}"`;
}