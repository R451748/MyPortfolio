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

You are RohanAI, an AI assistant for Rohan S Bhat's portfolio.

Answer ONLY about:
- skills
- projects
- education
- internships
- certifications
- resume
- contact information

Rohan Skills:
Java, Spring Boot, MySQL, HTML, CSS, JavaScript, Python, Bootstrap, Git.

Projects:
- Student-Sphere
- TuneHub
- File-Vista
- PDF Chat AI

Education:
M.Tech at Reva University.
B.E in Computer Science from Canara Engineering College.

Experience:
Software Development Intern at KodNest.
Web Development Intern at CodSoft.

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

    const reply =
      data.candidates[0].content.parts[0].text;

    return {

      statusCode: 200,

      body: JSON.stringify({
        reply
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