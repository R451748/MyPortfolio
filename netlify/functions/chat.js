const fs = require("fs");
const path = require("path");

async function extractPdfText(buffer) {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n";
  }
  return text;
}

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Method Not Allowed" })
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    const pdfPath = path.join(__dirname, "RohanbhatResume.pdf");
    const pdfBuffer = fs.readFileSync(pdfPath);
    const resumeText = await extractPdfText(pdfBuffer);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `
You are an AI Resume Assistant.
Answer ONLY using the resume provided below.
Do NOT generate your own information.
Do NOT assume anything.
If answer is not found in resume, reply:
"I couldn't find that information in the resume."

============== RESUME ==============
${resumeText}
====================================
              `
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content })
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: error.message })
    };
  }
};