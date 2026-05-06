// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {

  mobileMenuBtn.addEventListener('click', () => {

    navLinks.classList.toggle('active');

    const spans = mobileMenuBtn.querySelectorAll('span');

    spans[0].style.transform =
      navLinks.classList.contains('active')
        ? 'rotate(45deg) translate(5px, 5px)'
        : '';

    spans[1].style.opacity =
      navLinks.classList.contains('active')
        ? '0'
        : '1';

    spans[2].style.transform =
      navLinks.classList.contains('active')
        ? 'rotate(-45deg) translate(7px, -7px)'
        : '';

  });

}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {

  link.addEventListener('click', () => {

    navLinks.classList.remove('active');

    const spans = mobileMenuBtn.querySelectorAll('span');

    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';

  });

});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener('click', function (e) {

    e.preventDefault();

    const target = document.querySelector(
      this.getAttribute('href')
    );

    if (target) {

      const headerOffset = 80;

      const elementPosition =
        target.getBoundingClientRect().top;

      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({

        top: offsetPosition,
        behavior: 'smooth'

      });

    }

  });

});

// Update copyright year
const yearSpan = document.getElementById('current-year');

if (yearSpan) {

  yearSpan.textContent = new Date().getFullYear();

}

// Animate skill bars on scroll
const skillBars = document.querySelectorAll('.skill-progress');

const animateSkills = () => {

  skillBars.forEach(bar => {

    const rect = bar.getBoundingClientRect();

    const isVisible =
      rect.top < window.innerHeight &&
      rect.bottom >= 0;

    if (isVisible) {

      bar.style.width =
        bar.parentElement.previousElementSibling
          .lastElementChild.textContent;

    }

  });

};

window.addEventListener('scroll', animateSkills);
window.addEventListener('load', animateSkills);

/* ================================================= */
/* ================= AI CHATBOT ==================== */
/* ================================================= */

const aiButton = document.getElementById("aiButton");
const chatPopup = document.getElementById("chatPopup");
const closePopup = document.getElementById("closePopup");

const sendBtn = document.getElementById("sendBtn");
const chatInput = document.getElementById("chatInput");
const chatBody = document.getElementById("chatBody");

/* ================= OPEN CHAT ================= */

if (aiButton) {

  aiButton.addEventListener("click", () => {

    chatPopup.style.display = "flex";

  });

}

/* ================= CLOSE CHAT ================= */

if (closePopup) {

  closePopup.addEventListener("click", () => {

    chatPopup.style.display = "none";

  });

}

/* ================= ADD MESSAGE ================= */

function addMessage(message, type) {

  const div = document.createElement("div");

  div.classList.add(
    type === "user"
      ? "user-msg"
      : "bot-msg"
  );

  div.innerText = message;

  chatBody.appendChild(div);

  chatBody.scrollTop = chatBody.scrollHeight;

}

/* ================= AI RESPONSE ================= */

async function getAIResponse(message) {

  try {

    const response = await fetch(
      "/.netlify/functions/chat",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: message
        })

      }
    );

    const data = await response.json();

    return data.reply;

  } catch (error) {

    return "AI is currently unavailable.";

  }

}

/* ================= HANDLE CHAT ================= */

async function handleChat() {

  const message = chatInput.value.trim();

  if (message === "") return;

  addMessage(message, "user");

  chatInput.value = "";

  addMessage("Typing...", "bot");

  const botMessages =
    document.querySelectorAll(".bot-msg");

  const lastBotMessage =
    botMessages[botMessages.length - 1];

  const aiReply =
    await getAIResponse(message);

  lastBotMessage.innerText = aiReply;

}

/* ================= BUTTON EVENTS ================= */

if (sendBtn) {

  sendBtn.addEventListener(
    "click",
    handleChat
  );

}

if (chatInput) {

  chatInput.addEventListener(
    "keypress",
    (e) => {

      if (e.key === "Enter") {

        handleChat();

      }

    }
  );

}