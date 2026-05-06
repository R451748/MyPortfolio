const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

exports.handler = async function(event) {

  if (event.httpMethod !== "POST") {

    return {

      statusCode: 405,

      body: JSON.stringify({
        reply: "Method Not Allowed"
      })

    };

  }

  try {

    // Get user message
    const { message } = JSON.parse(event.body);

    // Read Resume PDF
    const pdfPath = path.join(
  __dirname,
  "../../RohanbhatResume.pdf"
);

    const pdfBuffer = fs.readFileSync(pdfPath);

    // Extract text from PDF
    const pdfData = await pdfParse(pdfBuffer);

    const resumeText = pdfData.text;

    // Send to Groq AI
    const response = await fetch(

      "https://api.groq.com/openai/v1/chat/completions",

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          "Authorization":
            `Bearer ${process.env.GROQ_API_KEY}`

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

    console.log(data);

    return {

      statusCode: 200,

      body: JSON.stringify({

        reply:
          data.choices[0].message.content

      })

    };

  } catch (error) {

    console.error(error);

    return {

      statusCode: 500,

      body: JSON.stringify({

        reply: error.message

      })

    };

  }

};