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

    const { message } = JSON.parse(event.body);

    const response = await fetch(

      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,

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

                  text: message

                }

              ]

            }

          ]

        })

      }

    );

    const data = await response.json();

    console.log(data);

    if (data.error) {

      return {

        statusCode: 500,

        body: JSON.stringify({
          reply: data.error.message
        })

      };

    }

    return {

      statusCode: 200,

      body: JSON.stringify({

        reply:
          data.candidates[0].content.parts[0].text

      })

    };

  } catch (error) {

    return {

      statusCode: 500,

      body: JSON.stringify({

        reply: error.message

      })

    };

  }

};