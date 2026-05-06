const fetch = (...args) =>
  import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event) {

  try {

    const { message } = JSON.parse(event.body);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          contents: [

            {

              parts: [

                {

                  text: `
You are RohanAI assistant.

Answer only about Rohan's:
- skills
- projects
- education
- internships
- resume
- contact
                  
User Question:
${message}
                  `
                }

              ]

            }

          ]

        })

      }
    );

    const data = await response.json();

    return {

      statusCode: 200,

      body: JSON.stringify({
        reply: data.candidates[0].content.parts[0].text
      })

    };

  } catch (error) {

    return {

      statusCode: 500,

      body: JSON.stringify({
        reply: "AI is currently unavailable."
      })

    };

  }

};