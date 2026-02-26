const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // fast + cost efficient
});

function buildPrompt({ question, tables, userQuery, errorMessage }) {
  const schemaDescription = tables
    .map((table) => {
      const columns = table.columns
        .map((col) => `${col.name} (${col.type})`)
        .join(", ");
      return `Table: ${table.tableName}\nColumns: ${columns}`;
    })
    .join("\n\n");

  return `
You are an SQL tutor.

IMPORTANT RULES:
- Do NOT provide the full SQL solution.
- Give only conceptual hints.
- Guide the student step-by-step.
- If the query has an error, explain what kind of mistake it might be.
- Keep hints concise and educational.

========================
QUESTION:
${question}

DATABASE SCHEMA:
${schemaDescription}

USER QUERY:
${userQuery}

ERROR MESSAGE (if any):
${errorMessage || "None"}
========================

Now provide a helpful hint:
`;
}

async function generateHint({ question, tables, userQuery, errorMessage }) {
  try {
    const prompt = buildPrompt({
      question,
      tables,
      userQuery,
      errorMessage,
    });

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error("AI hint generation failed");
  }
}

module.exports = generateHint;
