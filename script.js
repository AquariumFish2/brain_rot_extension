// Using Picsum photos for card images
function getImages(count) {
  const images = [];
  const usedSeeds = new Set();
  while (images.length < count) {
    const seed = Math.floor(Math.random() * 1000);
    if (!usedSeeds.has(seed)) {
      usedSeeds.add(seed);
      images.push(`https://picsum.photos/seed/${seed}/200/200`);
    }
  }
  return images;
}
      const DIFFS = {
        easy: { pairs: 8, cols: 4, time: 120 },
        normal: { pairs: 12, cols: 6, time: 180 },
        hard: { pairs: 18, cols: 6, time: 240 },
      };

      const KEY = "tf_scores";

      let cur = "easy",
        flipped = [],
        matched = 0,
        moves = 0,
        timeLeft = 0,
        ticker = null,
        locked = false,
        total = 0;

      function loadScores() {
          return JSON.parse(localStorage.getItem(KEY)) || {};
      }

      function saveScore(difficulty, score) {
        const savedScore = loadScores();
        if (!savedScore[difficulty] || score > savedScore[difficulty]){
                savedScore[difficulty] = score;
            }
          localStorage.setItem(KEY, JSON.stringify(savedScore));
      }

      function renderLanding() {
        const savedScore = loadScores();
        console.log(savedScore);
        ["easy", "normal", "hard"].forEach((difficulty) => {
          const score = savedScore[difficulty];
          const scoreBoxContent = document.getElementById("sc-" + difficulty);
          const box = document.getElementById("sbox-" + difficulty);
          const badge = document.getElementById("badge-" + difficulty);
          if (score) {
            // Add has class to change the card and the badge
            box.classList.add("has");
            badge.classList.add("has");
            scoreBoxContent.textContent = score;
            badge.textContent = "Best: " + score;
          } else {
            box.classList.remove("has");
            badge.classList.remove("has");
            scoreBoxContent.textContent = "—";
            badge.textContent = "No record";
          }
        });
      }

      function showScreen(id) {
        document.querySelectorAll(".screen").forEach((screen) => {
          screen.classList.remove("on");
          screen.scrollTop = 0;
        });
        document.getElementById(id).classList.add("on");
      }

      function goLanding() {
        clearInterval(ticker);
        document.getElementById("winOverlay").classList.remove("on");
        document.getElementById("loseOverlay").classList.remove("on");
        document.getElementById("timerPill").classList.remove("on", "warn");
        document.getElementById("backBtn").classList.remove("on");
        renderLanding();
        showScreen("landingScreen");
      }

      function startGame(d) {
        cur = d;
        const configure = DIFFS[d];
        total = configure.pairs;
        timeLeft = configure.time;
        flipped = [];
        matched = 0;
        moves = 0;
        locked = false;
        document.getElementById("timerPill").classList.add("on");
        document.getElementById("timerPill").classList.remove("warn");
        document.getElementById("backBtn").classList.add("on");
        document.getElementById("pairsVal").textContent = "0/" + total;
        document.getElementById("movesVal").textContent = "0";
        document.getElementById("progFill").style.width = "0%";
        const savedScores = loadScores();
        document.getElementById("bestVal").textContent = savedScores[d] || "—";
        buildGrid(configure);
        renderTimer();
        showScreen("gameScreen");
        clearInterval(ticker);
        ticker = setInterval(tick, 1000);
      }

      function cols(ideal) {
        const w = window.innerWidth;
        if (w < 360) return Math.min(ideal, 4);
        if (w < 480) return Math.min(ideal, 5);
        return ideal;
      }

      function buildGrid(cfg) {
        const g = document.getElementById("grid");
        g.innerHTML = "";
        g.style.gridTemplateColumns = "repeat(" + cols(cfg.cols) + ",1fr)";
        
        const gallery = getImages(cfg.pairs);
        [...gallery, ...gallery]
          .sort(() => Math.random() - 0.5)
          .forEach((url) => {
            const c = document.createElement("div");
            c.className = "card";
            c.dataset.e = url;
            c.innerHTML = `
              <div class="card-inner">
                <div class="card-b">
                  <div class="card-b-in">
                    <div class="card-b-dot"></div>
                  </div>
                </div>
                <div class="card-f">
                  <img src="${url}" alt="Memory Card" loading="lazy">
                </div>
              </div>`;
            c.addEventListener("click", () => flip(c));
            g.appendChild(c);
          });
      }

      function flip(card) {
        if (
          locked ||
          card.classList.contains("flipped") ||
          card.classList.contains("matched") ||
          flipped.length >= 2
        )
          return;
        card.classList.add("flipped");
        flipped.push(card);
        if (flipped.length === 2) {
          moves++;
          document.getElementById("movesVal").textContent = moves;
          locked = true;
          if (flipped[0].dataset.e === flipped[1].dataset.e) {
            setTimeout(() => {
              flipped.forEach((c) => c.classList.add("matched"));
              matched++;
              document.getElementById("pairsVal").textContent =
                matched + "/" + total;
              document.getElementById("progFill").style.width =
                (matched / total) * 100 + "%";
              flipped = [];
              locked = false;
              if (matched === total) setTimeout(triggerWin, 400);
            }, 300);
          } else {
            setTimeout(() => {
              flipped.forEach((c) => c.classList.remove("flipped"));
              flipped = [];
              locked = false;
            }, 800);
          }
        }
      }

      function tick() {
        timeLeft--;
        renderTimer();
        if (timeLeft <= 0) {
          clearInterval(ticker);
          triggerLose(false);
        }
      }
      function renderTimer() {
        const m = Math.floor(timeLeft / 60),
          s = timeLeft % 60;
        const p = document.getElementById("timerPill");
        p.textContent = m + ":" + (s < 10 ? "0" : "") + s;
        p.classList.toggle("warn", timeLeft <= 20);
      }

      function calcScore() {
        return Math.max(
          0,
          Math.round(matched * 100 + timeLeft * 5 - moves * 3),
        );
      }

      function triggerWin() {
        clearInterval(ticker);
        const score = calcScore();
        const old = loadScores()[cur];
        const isNew = !old || score > old;
        saveScore(cur, score);
        const m = Math.floor(timeLeft / 60),
          s = timeLeft % 60;
        const ts = m + ":" + (s < 10 ? "0" : "") + s;
        document.getElementById("wMoves").textContent = moves;
        document.getElementById("wTime").textContent = ts;
        document.getElementById("wScore").textContent = score;
        document.getElementById("wMovesS").textContent = moves;
        document.getElementById("wTimeS").textContent = ts;
        document.getElementById("newBestTag").style.display = isNew
          ? "block"
          : "none";
        document.getElementById("winOverlay").classList.add("on");
      }

      function triggerLose(skipped) {
        clearInterval(ticker);
        document.getElementById("lPairs").textContent = matched + "/" + total;
        document.getElementById("lMoves").textContent = moves;
        document.getElementById("loseTitleEl").textContent = skipped
          ? "Skipped."
          : "Time's up.";
        document.getElementById("loseMsgEl").textContent = skipped
          ? "No warmup today. Try again anytime."
          : "You found " +
            matched +
            " of " +
            total +
            " pairs. Give it another shot.";
        document.getElementById("loseOverlay").classList.add("on");
      }

      function playAgain() {
        document.getElementById("winOverlay").classList.remove("on");
        document.getElementById("loseOverlay").classList.remove("on");
        startGame(cur);
      }

      function goToSite() {
        document.querySelector(".app").style.opacity = "0";
        document.querySelector(".app").style.transition = "opacity 0.5s";
      }

      window.addEventListener("resize", () => {
        if (document.getElementById("gameScreen").classList.contains("on")) {
          const g = document.getElementById("grid");
          g.style.gridTemplateColumns =
            "repeat(" + cols(DIFFS[cur].cols) + ",1fr)";
        }
      });

      renderLanding();