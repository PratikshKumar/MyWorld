// ---------- PAGE FLOW ----------
const intro = document.getElementById("intro");
const chapters = document.getElementById("chapters");
const beginBtn = document.getElementById("beginBtn");

beginBtn.addEventListener("click", () => {
  const shell = intro.querySelector(".cardShell");
  shell.classList.add("fadeOut");

  burstStars();

  setTimeout(() => {
    intro.classList.remove("active");
    chapters.classList.add("active");
    chapters.classList.add("slideIn");
    setTimeout(() => chapters.classList.remove("slideIn"), 600);
  }, 650);
});

// ---------- CHAPTER CARDS ----------
const grid = document.getElementById("grid");

const chaptersData = [
  {
    title: "Chapter 1: Flower",
    art: "🌹",
    line: "A small flower for the start : because some bonds bloom quietly and beautifully."
  },
  { title: "Chapter 2: Food", art: "📷", line: "A little memory waits inside." },
  { title: "Chapter 3: Promise", art: "✨", line: "A spark that made ordinary days brighter." },
  { title: "Chapter 4: Memories", art: "☕", line: "A calm moment, like warm coffee and good talk." },
  { title: "Chapter 5: Compliments", art: "🌙", line: "Late night vibes and silent understanding." },
  { title: "Chapter 6: Final Letter", art: "💌", line: "Not dramatic. Just honest." },
  { title: "Chapter 7: The ASK", art: "🤗", line: "One cute question. One perfect answer." },
];

let unlockedIndex = 0; // only first is unlocked

function renderCards() {
  grid.innerHTML = "";

  chaptersData.forEach((ch, idx) => {
    const isUnlocked = idx <= unlockedIndex;

    const card = document.createElement("div");
    card.className = "chapterCard" + (isUnlocked ? "" : " locked");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.innerHTML = `
      <div class="cardTop">
        <span class="badge">${ch.title}</span>
        <span class="status">${isUnlocked ? "🔓 Unlocked" : "🔒 Locked"}</span>
      </div>

      <div class="cardArt" aria-hidden="true">
        <div class="emojiArt">${ch.art}</div>
      </div>

      <div class="cardLine">${ch.line}</div>

      ${isUnlocked ? "" : `
        <div class="lockOverlay">
          <div class="lockIcon">🔒</div>
          <div class="lockText">Locked</div>
          <div class="lockSub">Unlock previous chapter first</div>
        </div>
      `}
    `;

    const onActivate = () => {
      if (!isUnlocked) return;

      // Chapter 1 opens modal
      if (idx === 0) {
        openChapter1Modal();
        return;
      }

      
      if (typeof window.openChapterModal === "function") {
    window.openChapterModal(idx);
  }
    };

    card.addEventListener("click", onActivate);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") onActivate();
    });

    grid.appendChild(card);

  });
}
renderCards();

// ---------- CHAPTER 1 MODAL ----------
const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModal");
const doneBtn = document.getElementById("doneChapter1");
const roseMsgEl = document.getElementById("roseMsg");

// sample messages (you can replace later with your own)
const roseMessages = {
  1: "This flower says: your presence makes things feel lighter, without even trying.",
  2: "This Flower says: thank you for being the kind of friend that feels safe and real.",
  3: "This flower says: even small moments with you become memorable somehow.",
  4: "This flower says: you deserve soft days, big smiles, and people who choose you.",
  5: "This flower says: if friendship had a favorite person, it would probably pick you."
};
let roseOpened = false;

function openChapter1Modal(){
    roseOpened = false;
  modalOverlay.hidden = false;
  burstStars();
  // focus close button for accessibility
  setTimeout(() => closeModalBtn.focus(), 0);
}

function closeChapter1Modal(){
  modalOverlay.hidden = true;
}

doneBtn.addEventListener("click", () => {

    if (!roseOpened) {
    // avoid duplicating button
    if (!document.getElementById("roseWarnBtn")) {
      const warnBtn = document.createElement("button");
      warnBtn.id = "roseWarnBtn";
      warnBtn.className = "primaryBtn";
      warnBtn.style.marginTop = "12px";
      warnBtn.textContent =
        "Uhhfoooo shikuliii.. kam se kam ek flower to open krlo 🌸";

      warnBtn.addEventListener("click", () => {
        warnBtn.remove();
      });

      // insert button just above Done
      const actions = document.querySelector(".modalActions");
      actions.prepend(warnBtn);
    }

    burstStars();
    return; // ⛔ do NOT close modal
  }

  closeChapter1Modal();

  // Unlock next chapter once the chapter-1 interaction is "done"
  if (unlockedIndex === 0) {
    unlockedIndex = 1;
    burstStars();
    renderCards();
  }
});



// roses click => show message
document.querySelectorAll(".roseCircle").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-rose");

    roseOpened = true; // ✅ at least one flower opened

    roseMsgEl.textContent =
      roseMessages[id] || "A sweet message is waiting here ✨";

    // remove warning button if it exists
    const warnBtn = document.getElementById("roseWarnBtn");
    if (warnBtn) warnBtn.remove();

    burstStars();
  });
});


// ---------- STARS ANIMATION ----------
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let particles = [];
let animId = null;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function burstStars() {
  const count = 120;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 1.2 + Math.random() * 4.2;
    particles.push({
      x: cx + (Math.random() * 40 - 20),
      y: cy + (Math.random() * 40 - 20),
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      r: 1 + Math.random() * 2.2,
      life: 80 + Math.random() * 40,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2
    });
  }

  if (!animId) animateStars();
}

function drawStar(x, y, r, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  const spikes = 5;
  const outer = r * 2.0;
  const inner = r * 0.9;
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / spikes) * i;
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function animateStars() {
  animId = requestAnimationFrame(animateStars);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02;
    p.rot += p.vr;
    p.life -= 1;

    const alpha = Math.max(0, Math.min(1, p.life / 120));
    ctx.globalAlpha = alpha;

    ctx.fillStyle = alpha > 0.6 ? "rgba(255,255,255,0.95)" : "rgba(255,155,197,0.9)";
    drawStar(p.x, p.y, p.r, p.rot);
  });

  particles = particles.filter(p => p.life > 0);

  if (particles.length === 0) {
    cancelAnimationFrame(animId);
    animId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Expose small API for other scripts (chapter_modals.js)
window.__chaptersApi = {
  getUnlocked: () => unlockedIndex,
  setUnlocked: (v) => { unlockedIndex = v; },
  getTotal: () => chaptersData.length,
  render: () => renderCards(),
  burst: () => burstStars(),
};


// ---- THANK YOU PAGE CELEBRATION ----
function startCelebration() {
  const layer = document.querySelector("#thankyou .celebrate");
  if (!layer) return;

  // avoid duplicating
  if (layer.dataset.started === "1") return;
  layer.dataset.started = "1";

  const icons = ["🌸", "✨", "💖", "🌟", "🫶"];
  const pieces = 26;

  for (let i = 0; i < pieces; i++) {
    const s = document.createElement("span");
    s.className = "confetti";
    s.textContent = icons[Math.floor(Math.random() * icons.length)];

    const size = 14 + Math.random() * 18;     // 14..32px
    const dur = 4.5 + Math.random() * 6.5;    // 4.5..11s
    const delay = -(Math.random() * dur);

    s.style.fontSize = `${size}px`;
    s.style.left = `${Math.random() * 100}%`;
    s.style.animationDuration = `${dur}s`;
    s.style.animationDelay = `${delay}s`;

    layer.appendChild(s);
    
  }
}

// Buttons on thank you page
document.getElementById("backToChapters")?.addEventListener("click", () => {
  document.getElementById("thankyou")?.classList.remove("active");
  document.getElementById("chapters")?.classList.add("active");
});

document.getElementById("finalHug")?.addEventListener("click", () => {
  // tiny extra burst effect if you want
  burstStars?.();
  alert("🫂 Hug delivered. Now smile please 😌💖");
});

(async function trackVisitOncePerTab() {
  try {
    if (sessionStorage.getItem("counted_visit") === "1") return;
    sessionStorage.setItem("counted_visit", "1");

    const r = await fetch("/api/visit", { method: "POST" });
    const data = await r.json();
    console.log("Total visits:", data.visits);
  } catch (e) {
    console.log("Visit counter error:", e);
  }
})();




