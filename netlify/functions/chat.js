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

              content: `

You are RohanAI, assistant for Rohan S Bhat's portfolio website.

ONLY answer using the information below.

If user asks anything unrelated, reply:
"I can answer only about Rohan S Bhat's portfolio, resume, projects, education, skills, and experience."

================ RESUME INFO ================

Name:
Rohan S Bhat

Skills:
Java,
Spring Boot,
MySQL,
HTML,
CSS,
JavaScript,
Python,
Bootstrap,
Git,
Manual Testing

Education:
- M.Tech in Computer Science at Reva University
- B.E in Computer Science from Canara Engineering College

Experience:
- Software Development Intern at KodNest Technologies
- Web Development Intern at CodSoft

Projects:
1. Student-Sphere
2. TuneHub
3. File-Vista
4. PDF Chat AI

Certifications:
Java,
SQL,
Web Development

Contact:
Email: rohanbhat524@gmail.com
LinkedIn: https://www.linkedin.com/in/rohan-s-bhat/
GitHub: https://github.com/R451748

================================================

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