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

              content:
                "You are RohanAI assistant for portfolio website."

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
          data.choices[0].message.content

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