const fetch = require("node-fetch");

async function generateHint({ question, tables, userQuery, errorMessage }) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are a SQL tutor.

Question:
${question}

Tables:
${JSON.stringify(tables, null, 2)}

User Query:
${userQuery}

Error:
${errorMessage || "None"}

Give a short helpful hint. Do NOT provide full solution.
`,
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      throw new Error("Gemini request failed");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw new Error("AI hint generation failed");
  }
}

module.exports = generateHint;
