if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
}

document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  setupInstantPageTransitions();
  initFlipCards();
  initQuiz();
  initWallForm();
});

function setupInstantPageTransitions() {
  const loader = document.getElementById("page-loader");

  
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    
    
    link.addEventListener("mouseenter", () => {
      const targetUrl = link.getAttribute("href");
      if (targetUrl && !document.querySelector(`link[rel="prefetch"][href="${targetUrl}"]`)) {
        const prefetchLink = document.createElement("link");
        prefetchLink.rel = "prefetch";
        prefetchLink.href = targetUrl;
        document.head.appendChild(prefetchLink);
      }
    });

    
    link.addEventListener("click", (e) => {
      const targetUrl = link.getAttribute("href");
      
      if (!targetUrl || link.target === "_blank" || window.location.pathname.endsWith(targetUrl)) {
        return;
      }

      e.preventDefault();

      if (loader) loader.style.width = "70%";
      document.body.classList.add("fade-out");

      setTimeout(() => {
        if (loader) loader.style.width = "100%";
        window.location.href = targetUrl;
      }, 120);
    });
  });
}


function initFlipCards() {
  const cards = document.querySelectorAll(".flip-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });
}


const quizData = [
  {
    question: "Çocuk Hakları Sözleşmesi kaç yaşına kadar her bireyi çocuk kabul eder?",
    options: ["15 Yaş", "18 Yaş", "21 Yaş", "16 Yaş"],
    correct: 1
  },
  {
    question: "Aşağıdakilerden hangisi temel bir çocuk hakkıdır?",
    options: ["Gece geç saatlere kadar çalışma", "Ücretsiz ve kaliteli eğitim alma", "İstediği zaman okula gitmeme", "Sadece oyun oynayıp hiç okumama"],
    correct: 1
  },
  {
    question: "Dünya Çocuk Hakları Günü her yıl hangi tarihte kutlanır?",
    options: ["23 Nisan", "20 Kasım", "19 Mayıs", "10 Ekim"],
    correct: 1
  },
  {
    question: "Çocukların kendi fikirlerini özgürce söylemesi hangi hakka girer?",
    options: ["Sağlık Hakkı", "Oyun Hakkı", "Düşünce ve İfade Özgürlüğü", "Barınma Hakkı"],
    correct: 2
  }
];

let currentQuestion = 0;
let score = 0;

function initQuiz() {
  const qText = document.getElementById("question-text");
  if (!qText) return;
  loadQuestion();
}

function loadQuestion() {
  const q = quizData[currentQuestion];
  document.getElementById("question-text").textContent = q.question;
  document.getElementById("question-count").textContent = `Soru ${currentQuestion + 1} / ${quizData.length}`;
  document.getElementById("quiz-progress").style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;

  const container = document.getElementById("options-container");
  container.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.onclick = () => selectOption(idx, btn);
    container.appendChild(btn);
  });
}

function selectOption(index, btn) {
  const q = quizData[currentQuestion];
  const allBtns = document.querySelectorAll(".option-btn");
  allBtns.forEach(b => b.disabled = true);

  if (index === q.correct) {
    btn.classList.add("correct");
    score += 25;
    document.getElementById("quiz-score").textContent = `Puan: ${score}`;
  } else {
    btn.classList.add("wrong");
    allBtns[q.correct].classList.add("correct");
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }, 1200);
}

function showResult() {
  document.getElementById("quiz-body").classList.add("hidden");
  document.getElementById("quiz-header").classList.add("hidden");
  const resultCard = document.getElementById("quiz-result");
  resultCard.classList.remove("hidden");
  document.getElementById("final-score-text").textContent = `Toplam Puanın: ${score} / 100`;
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById("quiz-score").textContent = "Puan: 0";
  document.getElementById("quiz-body").classList.remove("hidden");
  document.getElementById("quiz-header").classList.remove("hidden");
  document.getElementById("quiz-result").classList.add("hidden");
  loadQuestion();
}


function initWallForm() {
  const form = document.getElementById("message-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const author = document.getElementById("author").value;
    const msg = document.getElementById("message").value;

    const list = document.getElementById("wall-messages");
    const item = document.createElement("div");
    item.className = "message-item";
    item.innerHTML = `
      <div class="msg-header">
        <strong>${escapeHtml(author)}</strong>
        <span class="msg-date">Az önce</span>
      </div>
      <p>${escapeHtml(msg)}</p>
    `;

    list.prepend(item);
    form.reset();
  });
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function setupThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;


  updateThemeIcon();

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    

    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    
    updateThemeIcon();
  });
}

function updateThemeIcon() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const isDark = document.body.classList.contains("dark-theme");
  btn.textContent = isDark ? "☀️" : "🌙";
}