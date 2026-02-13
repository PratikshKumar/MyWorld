// chapter_modals.js
// Requires: script.js to expose window.__chaptersApi

(function () {
  // ---- helpers ----
  function api() {
    const a = window.__chaptersApi;
    if (!a) {
      console.warn("Missing window.__chaptersApi. Make sure chapter_modals.js is loaded AFTER script.js");
    }
    return a;
  }

  // Create one reusable overlay for chapters 2-7
  const overlay = document.createElement("div");
  overlay.className = "chOverlay";
  overlay.id = "chOverlay";
  overlay.hidden = true;

  overlay.innerHTML = `
    <div class="chCard" role="dialog" aria-modal="true" aria-labelledby="chTitle">
      <div class="chTop">
        <h3 id="chTitle" class="chTitle">Chapter</h3>
        <button class="chClose" id="chClose" aria-label="Close">✕</button>
      </div>
      <p class="chSub" id="chSub"></p>
      <div class="chBody" id="chBody"></div>
      <div class="chActions">
        <button class="chSecondary" id="chAgain" type="button">Another ✨</button>
        <button class="chDone" id="chDone" type="button">Done 💖</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const titleEl = overlay.querySelector("#chTitle");
  const subEl = overlay.querySelector("#chSub");
  const bodyEl = overlay.querySelector("#chBody");
  const closeBtn = overlay.querySelector("#chClose");
  const doneBtn = overlay.querySelector("#chDone");
  const againBtn = overlay.querySelector("#chAgain");

  let currentChapterIndex = null;

  const chapterDefs = {
    // index: 1 -> Chapter 2
    1: {
      title: "Chapter 2: Food Chapter 🍟🍫",
      sub: "Because some friendships are basically: ‘eat first, talk later’ 😄",
      build() {
        const msgBox = document.createElement("div");
        msgBox.className = "chPanel";
        msgBox.innerHTML = `<p class="chMsg" id="foodMsg">Pick a dish… I’ll tell you what it reminds me of ✨</p>`;

        const chips = document.createElement("div");
        chips.className = "chChips";
        const items = [
          { label: "🍕 Pizza", msg: "Pizza energy = chaotic happiness. Like our talks: random, fun, and always satisfying." },
          { label: "🍫 Chocolate", msg: "Chocolate = mood fixer. Just like you… you quietly make everything better." },
          { label: "🍝 Pasta", msg: "Pasta = comfort. The kind of comfort your friendship gives—soft, warm, real." },
          { label: "🍦 Ice Cream", msg: "Ice cream = sweet memories. Even small moments with you feel special." },
          { label: "☕ Coffee", msg: "Coffee = Yeh to teri bhi fav. calm vibe. You’re the friend who feels like ‘peace’ in a busy day." },
        ];
        items.forEach(it => {
          const b = document.createElement("button");
          b.className = "chip";
          b.type = "button";
          b.textContent = it.label;
          b.addEventListener("click", () => {
            overlay.querySelector("#foodMsg").textContent = it.msg;
            api()?.burst();
          });
          chips.appendChild(b);
        });

        const grid = document.createElement("div");
        grid.className = "chGrid2";
        const left = document.createElement("div");
        left.className = "chPanel";
        left.innerHTML = `<p class="chMsg">If friendship had a flavor, ours would be: <strong>sweet + spicy + always extra</strong> 😌</p>`;
        const right = document.createElement("div");
        right.className = "chPanel";
        right.appendChild(chips);

        grid.append(left, right);
        bodyEl.append(grid, msgBox);
      },
      again() {
        const lines = [
          "A small reminder: you’re the kind of friend people feel lucky to have.",
          "Friendship with you is like comfort food—no explanations needed.",
          "You make ordinary days taste better. (Yes, that was cheesy 😄)",
        ];
        return lines[Math.floor(Math.random() * lines.length)];
      }
    },

    2: {
  title: "Chapter 3: Promise Chapter 🤝✨",
  sub: "Tiny promises that make a friendship feel safe.",
  showAgain: false, // hides global Another button
  build() {
    const wrap = document.createElement("div");
    wrap.className = "chGrid2";

    // LEFT: checkbox promises + seal button below
    const left = document.createElement("div");
    left.className = "chPanel";
    left.innerHTML = `
      
       <p class="chMsg"><strong>Click the promises</strong> you want this friendship to always keep and Seal them:</p>

      <div class="promiseList" id="promiseList"></div>

      <button class="bigBtn" id="promiseSeal" type="button" style="margin-top:12px;">
        Seal it ✨
      </button>

      <p class="chMsg" id="sealResult" style="margin-top:10px; opacity:.9;">
        (Seal it after selecting any promises 💗)
      </p>
    `;

    const list = left.querySelector("#promiseList");
    const promises = [
      "I’ll cheer for you, loudly and proudly.",
      "I’ll listen — even when I can’t fix it.",
      "I’ll respect your silence, not just your smile.",
      "I’ll choose kindness, even in misunderstandings.",
      "I’ll stay real — no fake vibes, ever.",
    ];

    promises.forEach(text => {
      const row = document.createElement("label");
      row.className = "promise";
      row.innerHTML = `<input type="checkbox" /> <span>${text}</span>`;
      list.appendChild(row);
    });

    left.querySelector("#promiseSeal").addEventListener("click", () => {
      const checked = [...left.querySelectorAll('input[type="checkbox"]')]
        .filter(x => x.checked).length;

      const msg = checked
        ? `Sealed 💖 You picked ${checked} promise${checked > 1 ? "s" : ""}.`
        : "Sealed anyway 💖 Even without checkboxes… you matter. Always.";

      left.querySelector("#sealResult").textContent = msg;
      api()?.burst();
    });

    // RIGHT: eternal promises 3-at-a-time
    const right = document.createElement("div");
    right.className = "chPanel";
    right.innerHTML = `
      <p class="chMsg">
        <strong>Some eternal promises to you</strong> which don’t need your approval.<br/>
        At a time, <strong>3</strong> promises will be shown.
      </p>

      <div class="chPanel" style="margin-top:10px;">
        <div id="eternalPromises" class="timeline"></div>
      </div>

      <button class="chip" id="eternalBtn" type="button" style="margin-top:12px;">
        I have some more promises for you. Click here to see my next promises ✨
      </button>
    `;

    // ✅ keep YOUR list (you said you expanded it). Just edit below.
    const eternalList = [
 
  "I’ll be proud of you in rooms you never enter.",
  "I’ll protect your peace like it’s my own.",
  "I’ll always want good things for you — genuinely.",
  "I’ll listen, even when you don’t know how to explain.",
  "I’ll be honest with you, gently and always.",
   "I’ll never make you feel small for having feelings.",
  "I’ll celebrate your wins like they’re mine.",
  "I’ll stand by you without needing the spotlight.",
"I’ll choose respect — even in silence, even in distance.",
  "I’ll never compete with you — only support you.",
  "I’ll be patient with your healing, no timelines.",
  "I’ll respect your boundaries and guard them fiercely.",
  "I’ll check on you, not just when it’s easy.",
  "I’ll believe in you on the days you don’t.",
  "I’ll keep you safe in my words and my actions.",
  "I’ll never turn your vulnerability into a weakness.",
    "I’ll remind you of your worth when you forget it.",
  "I’ll stay — not out of habit, but by choice.",
  "I’ll make space for your silence and your storms.",
  "I’ll choose kindness when misunderstanding shows up.",
  "I’ll always mean well for you, even from afar."
];


    let start = 0;
    const holder = right.querySelector("#eternalPromises");
    const btn = right.querySelector("#eternalBtn");

    function renderSet() {
      holder.innerHTML = "";

      const set = [
        eternalList[start],
        eternalList[start + 1],
        eternalList[start + 2],
      ];

      set.forEach((text, idx) => {
        const item = document.createElement("div");
        item.className = "tItem";
        item.innerHTML = `
          <div class="tDot"></div>
          <div class="tText">
            <strong>Promise ${idx + 1}</strong>
            <div>${text}</div>
          </div>
        `;
        holder.appendChild(item);
      });
    }

    // Show first 3 immediately (optional but nicer)
    renderSet();

    btn.addEventListener("click", () => {
      start += 3;
      if (start >= eternalList.length) start = 0;
      renderSet();
      api()?.burst();
    });

    wrap.append(left, right);
    bodyEl.appendChild(wrap);
  }
},

        3: {
    title: "Chapter 4: Little Memories 📸🌙",
    sub: "Not the big events… the small moments that stayed.",
    showAgain: false, // ✅ hides “Another ✨” button for this chapter
    build() {
        const grid = document.createElement("div");
        grid.className = "chGrid2";

        const left = document.createElement("div");
        left.className = "chPanel";
        left.innerHTML = `
        <p class="chMsg"><strong>A tiny timeline</strong> :</p>
        <div class="timeline">
            <div class="tItem">
            <div class="tDot"></div>
            <div class="tText">
                <strong>“The first real laugh”</strong>
                <div>That moment when it didn’t feel formal anymore — just… easy.</div>
            </div>
            </div>
            <div class="tItem">
            <div class="tDot"></div>
            <div class="tText">
                <strong>“The random deep talk”</strong>
                <div>Somehow we went from jokes to life in 2 minutes 😄</div>
            </div>
            </div>
            <div class="tItem">
            <div class="tDot"></div>
            <div class="tText">
                <strong>“The comfort day”</strong>
                <div>No big drama… just calm. And it mattered a lot.</div>
            </div>
            </div>
        </div>
        `;

        const right = document.createElement("div");
        right.className = "chPanel";
        right.innerHTML = `
        <p class="chMsg" id="memMsg">
            Click below… I saved a memory for you 💗
        </p>
        <button class="bigBtn" id="memBtn" type="button">Give me a memory ✨</button>
        <div id="memBox" style="margin-top:12px;"></div>
        `;

        const memBtn = right.querySelector("#memBtn");
        const memBox = right.querySelector("#memBox");
        const memMsg = right.querySelector("#memMsg");

        memBtn.addEventListener("click", () => {
        // ✅ show your image
        memBox.innerHTML = `
            <img class="memoryImg" src="memory.jpg" alt="Our memory" />
            <p class="memoryCaption">
            Some moments don’t need a reason — they just feel special… like this one 🌙✨
            </p>
        `;
        memMsg.textContent = "Here it is… a memory that makes me smile 😊";
        api()?.burst();

        // optional: hide the button after showing once
        memBtn.style.display = "none";
        });

        grid.append(left, right);
        bodyEl.appendChild(grid);
    }
    },


    4: {
      title: "Chapter 5: Compliments Chapter ✨😌",
      sub: "Press the button. Get a compliment. (Unlimited.)",
      showAgain : false,
      build() {
        const wrap = document.createElement("div");
        wrap.className = "compWrap";

        const panel = document.createElement("div");
        panel.className = "chPanel";

        panel.innerHTML = `
            <div class="compCard">
            <div class="sparkles" aria-hidden="true">
                <span></span><span></span><span></span><span></span><span></span>
            </div>

            <div class="compInner">
                <div class="compQuote" aria-hidden="true">“</div>
                <p class="compText" id="compMsg">Tap the button… I’ll drop something sweet 😌✨</p>
            </div>
            </div>

            <button class="bigBtn" id="compBtn" type="button" style="margin-top:12px;">
            I have Compliment for you Dr. Sahibaaa. Click here  ✨
            </button>
        `;

        const compliments = [
            "You’re the definition of ‘soft heart, strong mind’.",
            "You deserve love that feels calm, not confusing.",
            "You’re rare — the good kind of rare.",
            "You bring warmth without even trying.",
            "People feel better after talking to you — that’s a superpower.",
            "You have a presence that feels peaceful, not overwhelming.",
            "You make ordinary moments feel lighter.",
            "You care deeply, and that’s one of your strongest qualities.",
            "You’re thoughtful in ways most people don’t notice — but it matters.",
            "You have a gentle confidence that feels very real.",
            "You’re strong — not loud-strong, but steady-strong. That’s rare.",
            "You’re the type of person whose absence is noticed in a room.",
            "You make kindness look effortless.",
            "You’re easy to trust, and that’s not common.",
            "You handle things with grace, even when they’re heavy.",
            "You make space for others without losing yourself.",
            "You’re someone people remember for all the right reasons.",
            "You have a heart that chooses kindness, even when it’s not easy.",
            "You’re quietly impressive.",
            "You make the world feel a little softer.",
            "You’re exactly the kind of person this world needs more of."
        ];


        const msg = panel.querySelector("#compMsg");
        const btn = panel.querySelector("#compBtn");

        
        let hasClicked = false;

        let compIndex = 0;
        function showCompliment() {
        const text = compliments[compIndex];
        compIndex = (compIndex + 1) % compliments.length; // ✅ next one, loops back

        msg.textContent = text;

        // first click changes button text
        if (!hasClicked) {
            hasClicked = true;
            btn.textContent = "One more Compliment for you. Click again pls ✨";
        }

        // replay animation
        msg.classList.remove("compPop");
        void msg.offsetWidth;
        msg.classList.add("compPop");

        api()?.burst();
        }


        btn.addEventListener("click", showCompliment);

        wrap.appendChild(panel);
        bodyEl.appendChild(wrap);
        },
      again() {
        const lines = [
          "Your heart is pretty. That’s the real flex.",
          "Your efforts don’t go unnoticed.",
          "You deserve softness, always.",
        ];
        return lines[Math.floor(Math.random() * lines.length)];
      }
    },

     5: {
      title: "Chapter 6: Final Letter 💌",
      sub: "Not dramatic. Just honest.",
      showAgain: false,
      build() {
        const panel = document.createElement("div");
        panel.className = "chPanel";

        panel.innerHTML = `
          <div class="letter" id="letterBox">Click “Type it” to reveal the letter…</div>
          <button class="bigBtn" id="typeBtn" type="button" style="margin-top:12px;">Type it ✨</button>
        `;

        const text =
        `Dear Shikuliiii,

        I don’t know how to write “thank you” in a way that feels enough.
        So I’ll write it simply:

        Thank you for being the kind of friend who feels safe.
        Thank you for the laughs, the patience, and the calm energy.
        And thank you for existing the way you do — it matters more than you know.

        If this website is small…
        it’s only because I couldn’t fit your value into one screen.

        — Yours, always cheering for you 💗`;

        const box = panel.querySelector("#letterBox");
        const btn = panel.querySelector("#typeBtn");

        let typedOnce = false;

        btn.addEventListener("click", () => {
        if (typedOnce) return; // ✅ don’t type again

        typedOnce = true;
        api()?.burst();
        typeWriter(box, text, 12);

        // ✅ after typing finishes, change button text and disable further typing
        const durationMs = text.length * 12 + 200; // speed(12ms) * chars + small buffer
        setTimeout(() => {
            btn.textContent = "So now lets move to the last chapter. Click on Done and answer the question";
            btn.disabled = true;
            btn.style.cursor = "default";
            btn.style.filter = "brightness(0.95)";
            btn.style.opacity = "0.95";
        }, durationMs);
        });


        bodyEl.appendChild(panel);
      },
      again() {
        const lines = [
          "You’re not just a chapter. You’re the reason the story feels good.",
          "This friendship deserves softness and respect—always.",
          "If you ever doubt yourself, remember: you’re deeply loved.",
        ];
        return lines[Math.floor(Math.random() * lines.length)];
      }
    },

    // ✅ idx=6 => Card index 6 => Chapter 7: THE ASK
    6: {
        title: "Chapter 7: The ASK 💞",
        sub: "Okay… this one is important 😌",
        showAgain: false, // ✅ hide global Another
        build() {
            const card = overlay.querySelector(".chCard");
            card.classList.add("askBig");

            const rain = document.createElement("div");
            rain.className = "askRain";
            card.prepend(rain);

            // Create falling stars + flowers
            const drops = 22; // increase for more, keep ~18-30
            const icons = ["✨", "🌟", "🌸", "💗"]; // mix
            for (let i = 0; i < drops; i++) {
            const s = document.createElement("span");
            s.className = "askDrop";
            s.textContent = icons[Math.floor(Math.random() * icons.length)];

            // random size and position
            const size = 14 + Math.random() * 16; // 14..30px
            s.style.fontSize = `${size}px`;
            s.style.left = `${Math.random() * 100}%`;

            // random speed & delay
            const dur = 4.5 + Math.random() * 5.5; // 4.5..10s
            const delay = -(Math.random() * dur);  // negative makes it already “in motion”
            s.style.animationDuration = `${dur}s`;
            s.style.animationDelay = `${delay}s`;

            // slight sideways drift
            const drift = (Math.random() * 60 - 30).toFixed(1); // -30..30
            s.style.transform = `translateX(${drift}px)`;

            rain.appendChild(s);
            }

            const wrap = document.createElement("div");
            wrap.className = "askWrap";

            wrap.innerHTML = `
                <div class="cuteArt" aria-hidden="true">🧸🎀</div>

                <div class="askText" id="askTextBlock">
                <h2 class="askTitle">
                <span> So, Dr. Vanshikaa Sharma </span> <br />
                    <span>Will you be my BFF-entine? (Best friends forever) </span>
                </h2>
                <div class="askUnderline" aria-hidden="true"></div>
                </div>

                <div class="askTermsBox" id="askTermsBox">
                <p class="askTerms">
              "
                    <strong> As you grow from princess to queen, <br />
                    until you find your heart’s king, <br /> 
                     may I walk beside you as your prince?  </strong> "
                </p>
                </div>

                <div class="askBtns" id="askBtns">
                <button class="askYes" id="askYes" type="button">Yes 💖</button>
                <button class="askNo" id="askNo" type="button">No 😤</button>
                </div>
            `;

            bodyEl.appendChild(wrap);

            const yesBtn = wrap.querySelector("#askYes");
            const noBtn = wrap.querySelector("#askNo");
            const askTextBlock = wrap.querySelector("#askTextBlock");
            const termsBox = wrap.querySelector("#askTermsBox");
            const doneBtnEl = overlay.querySelector("#chDone");

            const noTexts = ["No 😤","Try again 😌", "Itna bhaaw kyu kha rhi ho🥲", "Not allowed 🙈","Are you sure? 😳","Nahi yaar 😂","Nope 😭","Click Yes 😌", "Maan jaao sahibaaa😓" , "Arre yaaar😭"];
            let noIdx = 0;

            // ✅ No starts aligned with Yes (normal flow).
            // Only after first click we switch it to absolute positioning.
            let isAbsolute = false;

            function toAbsoluteAtCurrentSpot() {
                const b = noBtn.getBoundingClientRect();
                const c = card.getBoundingClientRect();

                card.style.position = "relative";
                noBtn.style.position = "absolute";
                noBtn.style.left = `${b.left - c.left}px`;
                noBtn.style.top  = `${b.top - c.top}px`;
                isAbsolute = true;
            }

            function rectsOverlap(a, b, pad = 12){
                return !(
                a.right < b.left - pad ||
                a.left > b.right + pad ||
                a.bottom < b.top - pad ||
                a.top > b.bottom + pad
                );
            }

            function moveNoSafely(){
                // Forbidden zones in card coords
                const cardRect = card.getBoundingClientRect();

                const forbiddenRects = [
                askTextBlock.getBoundingClientRect(),
                termsBox.getBoundingClientRect(),
                yesBtn.getBoundingClientRect(),
                doneBtnEl.getBoundingClientRect(),
                ].map(r => ({
                left: r.left - cardRect.left,
                top: r.top - cardRect.top,
                right: r.right - cardRect.left,
                bottom: r.bottom - cardRect.top
                }));

                // also keep top header zone safe
                forbiddenRects.push({ left: 0, top: 0, right: card.clientWidth, bottom: 120 });

                const pad = 16;
                const bw = noBtn.offsetWidth;
                const bh = noBtn.offsetHeight;

                const maxX = Math.max(pad, card.clientWidth - bw - pad);
                const maxY = Math.max(pad, card.clientHeight - bh - pad);

                for (let tries = 0; tries < 80; tries++){
                const x = pad + Math.random() * (maxX - pad);
                const y = pad + Math.random() * (maxY - pad);

                const candidate = { left:x, top:y, right:x+bw, bottom:y+bh };
                const collides = forbiddenRects.some(f => rectsOverlap(candidate, f, 14));

                if (!collides){
                    noBtn.style.left = `${x}px`;
                    noBtn.style.top = `${y}px`;
                    return;
                }
                }

                // fallback
                noBtn.style.left = `${pad}px`;
                noBtn.style.top = `${Math.min(maxY, card.clientHeight - bh - pad)}px`;
            }

            // ✅ Move only on click (no hover listeners)
            noBtn.addEventListener("click", () => {
                noIdx = (noIdx + 1) % noTexts.length;
                noBtn.textContent = noTexts[noIdx];

                if (!isAbsolute) {
                toAbsoluteAtCurrentSpot(); // first click converts it and keeps same spot
                }

                moveNoSafely();
                api()?.burst();
            });

            yesBtn.addEventListener("click", () => {
                api()?.burst();
                overlay.hidden = true;

                const ch = document.getElementById("chapters");
                const ty = document.getElementById("thankyou");
                if (ch && ty) {
                ch.classList.remove("active");
                ty.classList.add("active");
                ty.classList.add("slideIn");
                setTimeout(() => ty.classList.remove("slideIn"), 600);
                }
                startCelebration?.();
            });

            // Special behavior for last chapter Done handled in global Done handler
            },


        },

  };

  function typeWriter(el, text, speed) {
    el.textContent = "";
    let i = 0;
    const t = setInterval(() => {
      el.textContent += text[i] || "";
      i++;
      if (i >= text.length) clearInterval(t);
    }, speed);
  }

  function openChapterModal(idx) {
    // idx is 1..6 here (Chapter 2..7)
    const def = chapterDefs[idx];
    if (!def) return;

    currentChapterIndex = idx;

    titleEl.textContent = def.title;
    subEl.textContent = def.sub;

    closeBtn.style.display = "none";   

    againBtn.hidden = def.showAgain === false;
    doneBtn.style.display = (idx === 6) ? "none" : "";

    bodyEl.innerHTML = "";
    // reset theme classes each time
    const card = overlay.querySelector(".chCard");
    card.classList.remove("askBig", "askTheme");

    // remove old rain layer if exists
    const oldRain = card.querySelector(".askRain");
    if (oldRain) oldRain.remove();

    def.build();

    overlay.hidden = false;
    api()?.burst();
    setTimeout(() => closeBtn.focus(), 0);
  }

  function closeModal() {
    overlay.hidden = true;
    currentChapterIndex = null;
  }



  // "Another" button changes the message inside the modal if possible
  againBtn.addEventListener("click", () => {
    if (currentChapterIndex == null) return;
    const def = chapterDefs[currentChapterIndex];
    if (!def?.again) return;

    // Find the first message paragraph and replace it
    const p = bodyEl.querySelector(".chMsg");
    if (p) p.textContent = def.again();
    api()?.burst();
  });

  // Done unlocks next if this is the current frontier
        doneBtn.addEventListener("click", () => {
        const a = api();
        if (!a) return;

        // ✅ Special behavior for last chapter Done: go back to chapters page
        if (currentChapterIndex === a.getTotal() - 1) {
            closeModal();

            const intro = document.getElementById("intro");
            const ch = document.getElementById("chapters");
            const ty = document.getElementById("thankyou");

            if (intro) intro.classList.remove("active");
            if (ty) ty.classList.remove("active");
            if (ch) {
            ch.classList.add("active");
            ch.classList.add("slideIn");
            setTimeout(() => ch.classList.remove("slideIn"), 600);
            }
            return;
        }

        // Normal unlock flow for chapters 2-6
        const cardIndex = currentChapterIndex;
        const unlocked = a.getUnlocked();

        if (cardIndex === unlocked && unlocked < a.getTotal() - 1) {
            a.setUnlocked(unlocked + 1);
            a.burst();
            a.render();
        }

        closeModal();
        });


  // expose open function to script.js
  window.openChapterModal = openChapterModal;
})();





