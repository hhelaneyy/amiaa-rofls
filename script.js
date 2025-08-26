"use strict";

const FUNFACTS = [
  "im very eepy today pls forgib me",
  "mepphy is evil",
  "LA LA LA LAVA CHI CHI CHI CHICKEN",
  "my favourite horse is a white horse cuz in german they're called Schimmel wich means mold",
  "I'VE BEEN WAITING A WHOLE YEAR FOR THIS",
  "I GOT SICK I SORRY I SORRY I SORRY I SORRY",
  "this is the last time you're seeing this model",
  "IM SCARED IM SCARED IM SCARED IM SCARED IM SCARED",
  "happy ptide month i like women",
  "I HAVENT SUNG IN WEEKS",
  "guess whos back back again ami's back tell a friend",
  "the amis yearn for the mines",
  "i stream on wifi again",
  "uhm uhm uhm uh uh uhm uh hm",
  "the female lombax (lorax) is BACK BABYYY",
  "luigi."
];

// ===== Storage =====
function getAppData() {
  try {
    return JSON.parse(localStorage.getItem("ami_app_data")) || { collectedFacts: [], achievements: {} };
  } catch { return { collectedFacts: [], achievements: {} }; }
}

function setAppData(data) { try { localStorage.setItem("ami_app_data", JSON.stringify(data)); } catch {} }
function getCollectedFacts() { return getAppData().collectedFacts; }
function setCollectedFacts(facts) { const data = getAppData(); data.collectedFacts = facts; setAppData(data); }
function getAchievements() { return getAppData().achievements; }
function setAchievements(achievements) { const data = getAppData(); data.achievements = achievements; setAppData(data); }

// ===== UI =====
function showToast(title, subtitle) {
  const toast = document.getElementById("achievementToast");
  if (!toast) return;
  document.getElementById("toastTitle").textContent = title;
  document.getElementById("toastSubtitle").textContent = subtitle;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function updateFactCounter() {
  const counters = document.querySelectorAll('[id="factProgress"], [data-fact-counter]');
  const collected = getCollectedFacts().length;
  const total = FUNFACTS.length;

  counters.forEach(c => c.textContent = `${collected} / ${total} collected`);

  if (collected === total && !getAchievements().trulyFan) unlockAchievement("trulyFan", "Truly Fan Badge");
}

// ===== Achievements =====
function unlockAchievement(id, prize) {
  const achievements = getAchievements();
  if (achievements[id]) return;

  achievements[id] = { unlocked: true, unlockedAt: new Date().toISOString(), prize };
  setAchievements(achievements);

  if (id === "marathonAmi") {
    localStorage.setItem("marathonAmiUnlocked", "true");
  }

  const card = document.getElementById("ach_" + id);
  if (card) {
    card.classList.remove("locked");
    card.classList.add("unlocked");
    const emojiEl = document.getElementById("ach_" + id + "_emoji");
    if (emojiEl) emojiEl.textContent = "🏆";
  }

  showToast("New Achievement Unlocked!", `Prize: ${prize}`);
}

function checkAchievementStatus(id) {
  const achievements = getAchievements();
  return achievements[id] && achievements[id].unlocked;
}

function checkMarathonAchievement() {
  return localStorage.getItem("marathonAmiUnlocked") === "true";
}

// ===== Funfacts =====
function handleFactButton() {
  let collected = getCollectedFacts();

  if (Math.random() < 0.5 && collected.length > 0) {
    const randomOld = collected[Math.floor(Math.random() * collected.length)];
    document.getElementById("factText").textContent = randomOld;
    return;
  }

  const available = FUNFACTS.filter(f => !collected.includes(f));
  if (available.length === 0) {
    const randomOld = collected[Math.floor(Math.random() * collected.length)];
    document.getElementById("factText").textContent = randomOld;
    return;
  }

  const newFact = available[Math.floor(Math.random() * available.length)];
  document.getElementById("factText").textContent = newFact;

  collected.push(newFact);
  setCollectedFacts(collected);
  updateFactCounter();
}

// ===== Achievements page =====
function renderAchievements() {
  const achievementsConfig = [
    { id: "trulyFan", emoji: "🔒", counter: true },
    { id: "marathonAmi", emoji: "⏱️", counter: false }
  ];

  const marathonTimer = JSON.parse(localStorage.getItem("marathonTimer")) || { elapsed: 0 };

  achievementsConfig.forEach(({ id, emoji, counter }) => {
    const card = document.getElementById("ach_" + id);
    if (!card) return;

    const unlocked = id === "marathonAmi" ? checkMarathonAchievement() : checkAchievementStatus(id);
    const emojiEl = document.getElementById("ach_" + id + "_emoji");
    if (unlocked) {
      card.classList.remove("locked");
      card.classList.add("unlocked");
      if (emojiEl) emojiEl.textContent = "🏆";
    } else {
      card.classList.remove("unlocked");
      card.classList.add("locked");
      if (emojiEl) emojiEl.textContent = emoji;
    }

    if (counter) {
      const counterEl = card.querySelector('.achievement-counter');
      if (counterEl) {
        const collected = getCollectedFacts().length;
        const total = FUNFACTS.length;
        counterEl.textContent = `${collected} / ${total} collected`;
      }
    }

    if (id === "marathonAmi" && !unlocked) {
      const counterEl = card.querySelector('.achievement-counter');
      if (counterEl) {
        const seconds = Math.floor(marathonTimer.elapsed / 1000);
        counterEl.textContent = `${seconds} / 300 seconds`;
      }
    }
  });
}

// ===== Reset =====
function resetAll() {
  localStorage.removeItem("ami_app_data");
  localStorage.removeItem("marathonAmiUnlocked");
  localStorage.removeItem("marathonTimer");
  renderAchievements();
  updateFactCounter();
  const factText = document.getElementById("factText");
  if (factText) factText.textContent = "Click the button to reveal a funfact!";
  showToast("Progress Reset", "All achievements and collected facts have been reset");
}

// ===== Nav image expand =====
function enableNavImageExpand() {
  const navImage = document.querySelector(".nav-image");
  if (!navImage) return;

  navImage.addEventListener("click", () => {
    navImage.classList.toggle("expanded");
    const navText = navImage.nextElementSibling;
    if (navText && navText.classList.contains("nav-text")) navText.classList.toggle("visible");
  });
}

// ===== Marathon Timer with persistent storage =====
function startMarathonTimer() {
  const progressBar = document.querySelector(".timer-bar");
  const timerText = document.querySelector(".timer-text");
  if (!progressBar || !timerText) return;

  const duration = 5 * 60 * 1000; // 5 минут
  let saved = JSON.parse(localStorage.getItem("marathonTimer")) || {};
  let elapsed = saved.elapsed || 0;
  let startTime = Date.now();

  const interval = setInterval(() => {
    elapsed = Date.now() - startTime + (saved.elapsed || 0);
    const percentage = Math.min(100, (elapsed / duration) * 100);
    progressBar.style.width = percentage + "%";

    const seconds = Math.floor(Math.min(duration, elapsed) / 1000);
    timerText.textContent = `Time: ${seconds}s / 300s`;

    // сохраняем прогресс
    localStorage.setItem("marathonTimer", JSON.stringify({ elapsed }));

    if (elapsed >= duration) {
      if (!checkMarathonAchievement()) {
        unlockAchievement("marathonAmi", "Marathon with Ami");
      }
      clearInterval(interval);
      timerText.textContent = "Achievement unlocked!";
      localStorage.removeItem("marathonTimer");
      renderAchievements();
    }
  }, 1000);
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  updateFactCounter();
  enableNavImageExpand();
  startMarathonTimer();

  const factBtn = document.getElementById("factBtn");
  if (factBtn) {
    const factText = document.getElementById("factText");
    const collected = getCollectedFacts();
    factText.textContent = collected.length > 0 ? collected[collected.length - 1] : "Click the button to reveal a funfact!";
    factBtn.addEventListener("click", handleFactButton);
  }

  const resetBtn = document.getElementById("resetAchievements");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const confirmModal = document.getElementById("confirmModal");
      if (confirmModal) {
        confirmModal.classList.add("show");
        const yes = document.getElementById("confirmYes");
        const no = document.getElementById("confirmNo");
        if (yes) yes.onclick = () => { resetAll(); confirmModal.classList.remove("show"); };
        if (no) no.onclick = () => confirmModal.classList.remove("show");
      } else {
        if (confirm("Are you sure you want to reset all progress?")) resetAll();
      }
    });
  }

  renderAchievements();
});