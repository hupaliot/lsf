(function () {
  "use strict";

  const DATA = window.LSF_DATA;
  const app = document.getElementById("app");
  const STORAGE_KEY = "signons:v1";
  const DAY = 24 * 60 * 60 * 1000;
  // Intervalles (en jours) de la méthode Leitner, par boîte 1 à 5.
  const BOX_INTERVALS = [0, 1, 3, 7, 16, 35];

  /* ---------- État persistant ---------- */

  function defaultState() {
    return { lessons: {}, cards: {}, streak: { last: null, count: 0 }, xp: 0 };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? Object.assign(defaultState(), JSON.parse(raw)) : defaultState();
    } catch (e) {
      return defaultState();
    }
  }

  let state = loadState();

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* mode privé */ }
  }

  function today() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }

  function addXp(n) {
    state.xp += n;
    const t = today();
    if (state.streak.last !== t) {
      state.streak.count = state.streak.last === t - DAY ? state.streak.count + 1 : 1;
      state.streak.last = t;
    }
    saveState();
  }

  function currentStreak() {
    const t = today();
    return state.streak.last === t || state.streak.last === t - DAY ? state.streak.count : 0;
  }

  /* ---------- Utilitaires ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function elixUrl(word) {
    return "https://dico.elix-lsf.fr/dictionnaire/" + encodeURIComponent(word);
  }

  /* Lecteur vidéo d'un signe : vidéo libre si elle existe, sinon lien Elix. */
  function mountVideo(container, word) {
    container.innerHTML = `<p class="muted">Recherche d'une vidéo libre…</p>`;
    const elix = `<a href="${elixUrl(word)}" target="_blank" rel="noopener">Voir sur Elix ↗</a>`;
    window.LSF_VIDEOS.find(word).then((videos) => {
      if (!container.isConnected) return;
      if (!videos.length) {
        container.innerHTML = `<p class="muted">Pas encore de vidéo libre pour ce signe.</p>
          <a class="btn small" href="${elixUrl(word)}" target="_blank" rel="noopener">Voir sur Elix ↗</a>`;
        return;
      }
      let i = 0;
      function show() {
        const v = videos[i];
        const license = v.license
          ? (v.licenseUrl ? `<a href="${esc(v.licenseUrl)}" target="_blank" rel="noopener">${esc(v.license)}</a>` : esc(v.license))
          : "";
        container.innerHTML = `
          <video class="sign-video" src="${esc(v.src)}" autoplay loop muted playsinline controls preload="auto"></video>
          <div class="video-tools">
            <button class="btn small" data-rate="0.5">Ralenti</button>
            <button class="btn small" data-rate="1">Normal</button>
            ${videos.length > 1 ? `<button class="btn small" data-other>Autre version (${i + 1}/${videos.length})</button>` : ""}
          </div>
          <p class="credit">${v.author ? `Signé par ${esc(v.author)} · ` : ""}${license}${license ? " · " : ""}${
            v.page ? `<a href="${esc(v.page)}" target="_blank" rel="noopener">${esc(v.source)}</a>` : esc(v.source)} · ${elix}</p>`;
        const video = container.querySelector("video");
        container.querySelectorAll("[data-rate]").forEach((b) => (b.onclick = () => { video.playbackRate = Number(b.dataset.rate); }));
        const other = container.querySelector("[data-other]");
        if (other) other.onclick = () => { i = (i + 1) % videos.length; show(); };
      }
      show();
    }).catch(() => {
      if (!container.isConnected) return;
      container.innerHTML = `<p class="muted">Impossible de charger les vidéos (êtes-vous hors ligne ?).</p>
        <a class="btn small" href="${elixUrl(word)}" target="_blank" rel="noopener">Voir sur Elix ↗</a>`;
    });
  }

  function cardKey(themeId, word) { return themeId + "|" + word; }

  function allWords() {
    return DATA.themes.flatMap((t) => t.words.map((w) => ({ theme: t, word: w, key: cardKey(t.id, w) })));
  }

  function dueCards() {
    const now = Date.now();
    return allWords().filter((c) => state.cards[c.key] && state.cards[c.key].due <= now);
  }

  function learnedCount() {
    return Object.values(state.cards).filter((c) => c.box >= 3).length;
  }

  let cleanup = null; // arrêt de la caméra / des minuteries en quittant une page

  /* ---------- Routage ---------- */

  const routes = {
    "": renderHome,
    lecons: renderLessons,
    alphabet: renderAlphabet,
    vocabulaire: renderVocab,
    revisions: renderReview,
    quiz: renderQuiz
  };

  function router() {
    if (cleanup) { cleanup(); cleanup = null; }
    const parts = location.hash.replace(/^#\/?/, "").split("/");
    const [name, param] = parts;
    const view = routes[name] || renderHome;
    document.querySelectorAll(".nav a").forEach((a) => {
      a.classList.toggle("active", a.dataset.route === (name || "home"));
    });
    view(param ? decodeURIComponent(param) : undefined);
    app.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", router);

  /* ---------- Accueil ---------- */

  function renderHome() {
    const lessonsDone = Object.keys(state.lessons).length;
    const due = dueCards().length;
    const inDeck = Object.keys(state.cards).length;
    app.innerHTML = `
      <section class="hero">
        <h1>Apprenez la Langue des Signes Française</h1>
        <p>Des leçons courtes, l'alphabet en mode miroir, du vocabulaire par thème et des révisions espacées
        pour retenir durablement.</p>
        <div class="hero-actions">
          <a class="btn primary" href="#/lecons">Commencer une leçon</a>
          ${due ? `<a class="btn" href="#/revisions">Réviser ${due} signe${due > 1 ? "s" : ""}</a>` : ""}
        </div>
      </section>
      <section class="stats">
        <div class="stat"><span class="stat-value">${currentStreak()}</span><span class="stat-label">jour(s) de suite 🔥</span></div>
        <div class="stat"><span class="stat-value">${state.xp}</span><span class="stat-label">points d'expérience</span></div>
        <div class="stat"><span class="stat-value">${lessonsDone}/${DATA.lessons.length}</span><span class="stat-label">leçons terminées</span></div>
        <div class="stat"><span class="stat-value">${learnedCount()}/${inDeck}</span><span class="stat-label">signes maîtrisés</span></div>
      </section>
      <section>
        <h2>Parcours conseillé</h2>
        <ol class="path">
          <li><a href="#/lecons">Lire les leçons</a> pour comprendre comment fonctionne la LSF.</li>
          <li><a href="#/alphabet">Apprendre l'alphabet</a> pour épeler votre prénom.</li>
          <li><a href="#/vocabulaire">Découvrir le vocabulaire</a> par thème et l'ajouter à vos révisions.</li>
          <li><a href="#/revisions">Réviser chaque jour</a> quelques minutes : c'est la régularité qui compte.</li>
        </ol>
      </section>`;
  }

  /* ---------- Leçons ---------- */

  function renderLessons(id) {
    if (id) return renderLesson(id);
    app.innerHTML = `
      <h1>Leçons</h1>
      <p class="lead">Les bases pour comprendre la LSF, chacune suivie d'un petit quiz.</p>
      <div class="grid">
        ${DATA.lessons.map((l, i) => {
          const done = state.lessons[l.id];
          return `<a class="card lesson-card" href="#/lecons/${l.id}">
            <span class="badge">${i + 1}</span>
            <h3>${esc(l.title)}</h3>
            <p class="muted">${l.duration}${done ? ` · ✅ ${done.score}/${l.quiz.length}` : ""}</p>
          </a>`;
        }).join("")}
      </div>`;
  }

  function renderLesson(id) {
    const lesson = DATA.lessons.find((l) => l.id === id);
    if (!lesson) { location.hash = "#/lecons"; return; }
    const idx = DATA.lessons.indexOf(lesson);
    const next = DATA.lessons[idx + 1];
    app.innerHTML = `
      <a class="back" href="#/lecons">← Toutes les leçons</a>
      <article class="lesson">
        <h1>${esc(lesson.title)}</h1>
        ${lesson.body}
      </article>
      <section class="panel">
        <h2>Vérifiez vos connaissances</h2>
        <div id="lesson-quiz"></div>
      </section>`;
    runQuiz(document.getElementById("lesson-quiz"), lesson.quiz, (score) => {
      const prev = state.lessons[lesson.id];
      if (!prev || score > prev.score) state.lessons[lesson.id] = { score };
      addXp(10 + score * 5);
      return next
        ? `<a class="btn primary" href="#/lecons/${next.id}">Leçon suivante : ${esc(next.title)} →</a>`
        : `<a class="btn primary" href="#/alphabet">Passer à l'alphabet →</a>`;
    });
  }

  /* ---------- Moteur de quiz (QCM) ---------- */

  function runQuiz(container, questions, onFinish) {
    const qs = questions.map((q) => {
      const order = shuffle(q.options.map((_, i) => i));
      return { q: q.q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer), extra: q.extra };
    });
    let i = 0, score = 0;

    function show() {
      if (i >= qs.length) {
        const footer = onFinish ? onFinish(score) || "" : "";
        container.innerHTML = `
          <div class="quiz-result">
            <p class="big">${score === qs.length ? "🎉" : score >= qs.length / 2 ? "👍" : "💪"} ${score} / ${qs.length}</p>
            <p>${score === qs.length ? "Parfait !" : "Relisez la leçon et réessayez si besoin."}</p>
            <div class="row"><button class="btn" data-retry>Recommencer</button>${footer}</div>
          </div>`;
        container.querySelector("[data-retry]").onclick = () => runQuiz(container, questions, onFinish);
        return;
      }
      const cur = qs[i];
      container.innerHTML = `
        <p class="muted">Question ${i + 1} / ${qs.length}</p>
        ${cur.extra || ""}
        <p class="question">${esc(cur.q)}</p>
        <div class="options">
          ${cur.options.map((o, k) => `<button class="option" data-k="${k}">${esc(o)}</button>`).join("")}
        </div>
        <div class="feedback" aria-live="polite"></div>`;
      container.querySelectorAll(".option").forEach((btn) => {
        btn.onclick = () => {
          const k = Number(btn.dataset.k);
          const ok = k === cur.answer;
          if (ok) score++;
          container.querySelectorAll(".option").forEach((b, bk) => {
            b.disabled = true;
            if (bk === cur.answer) b.classList.add("correct");
            else if (bk === k) b.classList.add("wrong");
          });
          const fb = container.querySelector(".feedback");
          fb.innerHTML = `<p>${ok ? "✅ Bonne réponse !" : "❌ La bonne réponse était : <strong>" + esc(cur.options[cur.answer]) + "</strong>"}</p>
            <button class="btn primary" data-next>${i + 1 < qs.length ? "Question suivante" : "Voir le résultat"}</button>`;
          const nextBtn = fb.querySelector("[data-next]");
          nextBtn.onclick = () => { i++; show(); };
          nextBtn.focus();
        };
      });
    }
    show();
  }

  /* ---------- Alphabet ---------- */

  function renderAlphabet(mode) {
    mode = mode || "apprendre";
    const tabs = [["apprendre", "Apprendre"], ["miroir", "Miroir"], ["epeler", "Épeler"], ["quiz", "Quiz"]];
    app.innerHTML = `
      <h1>Alphabet dactylologique</h1>
      <p class="lead">Une configuration de main par lettre, réalisée avec la main dominante, devant l'épaule.</p>
      <p class="notice">ℹ️ Les descriptions sont indicatives. Vérifiez toujours avec une vidéo ou une personne sourde :
      certaines lettres comportent un mouvement ou une orientation difficile à décrire par écrit.</p>
      <div class="tabs" role="tablist">
        ${tabs.map(([k, label]) => `<a role="tab" href="#/alphabet/${k}" class="tab ${k === mode ? "active" : ""}" aria-selected="${k === mode}">${label}</a>`).join("")}
      </div>
      <div id="alpha-view"></div>`;
    const view = document.getElementById("alpha-view");
    ({ apprendre: alphaLearn, miroir: alphaMirror, epeler: alphaSpell, quiz: alphaQuiz }[mode] || alphaLearn)(view);
  }

  function alphaLearn(view) {
    view.innerHTML = `
      <div class="letter-grid">
        ${DATA.alphabet.map((a, i) => `<button class="letter" data-i="${i}">${a.l}</button>`).join("")}
      </div>
      <div id="letter-detail" class="panel letter-detail" aria-live="polite"></div>`;
    const detail = view.querySelector("#letter-detail");
    function select(i) {
      const a = DATA.alphabet[i];
      view.querySelectorAll(".letter").forEach((b) => b.classList.toggle("active", Number(b.dataset.i) === i));
      detail.innerHTML = `<div class="big-letter">${a.l}</div><p>${esc(a.d)}</p>
        <a class="btn" href="${elixUrl(a.l.toLowerCase())}" target="_blank" rel="noopener">Chercher sur Elix ↗</a>`;
    }
    view.querySelectorAll(".letter").forEach((b) => (b.onclick = () => select(Number(b.dataset.i))));
    select(0);
  }

  function alphaMirror(view) {
    let idx = 0;
    view.innerHTML = `
      <div class="mirror">
        <div class="mirror-video">
          <video id="cam" autoplay playsinline muted></video>
          <p id="cam-msg" class="cam-msg">Activez la caméra pour vous voir en train de signer, comme dans un miroir.
          Rien n'est enregistré ni envoyé : l'image reste sur votre appareil.</p>
          <button class="btn primary" id="cam-start">Activer la caméra</button>
        </div>
        <div class="mirror-target panel">
          <div class="big-letter" id="m-letter"></div>
          <p id="m-desc"></p>
          <div class="row">
            <button class="btn" id="m-prev">← Précédente</button>
            <button class="btn" id="m-rand">Au hasard</button>
            <button class="btn primary" id="m-next">Suivante →</button>
          </div>
        </div>
      </div>`;
    const letterEl = view.querySelector("#m-letter");
    const descEl = view.querySelector("#m-desc");
    function show() {
      letterEl.textContent = DATA.alphabet[idx].l;
      descEl.textContent = DATA.alphabet[idx].d;
    }
    view.querySelector("#m-prev").onclick = () => { idx = (idx + 25) % 26; show(); };
    view.querySelector("#m-next").onclick = () => { idx = (idx + 1) % 26; addXp(1); show(); };
    view.querySelector("#m-rand").onclick = () => { idx = Math.floor(Math.random() * 26); show(); };
    show();

    let stream = null;
    view.querySelector("#cam-start").onclick = async () => {
      const msg = view.querySelector("#cam-msg");
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        msg.textContent = "Votre navigateur ne permet pas d'accéder à la caméra (une connexion HTTPS est nécessaire).";
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        const video = view.querySelector("#cam");
        video.srcObject = stream;
        video.classList.add("on");
        msg.hidden = true;
        view.querySelector("#cam-start").hidden = true;
      } catch (e) {
        msg.textContent = "Impossible d'accéder à la caméra : " + e.message;
      }
    };
    cleanup = () => { if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }

  function alphaSpell(view) {
    let timer = null;
    view.innerHTML = `
      <div class="panel spell">
        <p>Un mot s'affiche lettre par lettre : signez chaque lettre en rythme. Augmentez la vitesse au fur et à mesure.</p>
        <div class="row">
          <label>Mot : <input id="s-word" type="text" maxlength="20" placeholder="Votre prénom…" autocomplete="off"></label>
          <button class="btn" id="s-rand">Mot au hasard</button>
        </div>
        <div class="row">
          <label>Vitesse : <input id="s-speed" type="range" min="400" max="2500" step="100" value="1500">
          <span id="s-speed-label"></span></label>
        </div>
        <div class="spell-display">
          <div class="big-letter" id="s-letter">?</div>
          <div class="spell-word" id="s-progress"></div>
          <p class="muted" id="s-desc"></p>
        </div>
        <button class="btn primary" id="s-go">▶ Lancer</button>
      </div>`;
    const input = view.querySelector("#s-word");
    const speed = view.querySelector("#s-speed");
    const speedLabel = view.querySelector("#s-speed-label");
    const letterEl = view.querySelector("#s-letter");
    const progress = view.querySelector("#s-progress");
    const desc = view.querySelector("#s-desc");
    const updateSpeed = () => (speedLabel.textContent = (speed.value / 1000).toFixed(1) + " s / lettre");
    speed.oninput = updateSpeed;
    updateSpeed();

    function normalize(s) {
      return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[^A-Z]/g, "");
    }

    view.querySelector("#s-rand").onclick = () => {
      input.value = DATA.spellingWords[Math.floor(Math.random() * DATA.spellingWords.length)];
    };

    view.querySelector("#s-go").onclick = () => {
      clearTimeout(timer);
      const word = normalize(input.value) || DATA.spellingWords[Math.floor(Math.random() * DATA.spellingWords.length)];
      input.value = word;
      let i = 0;
      (function step() {
        if (i >= word.length) {
          letterEl.textContent = "✓";
          desc.textContent = "Bravo ! Recommencez plus vite, ou essayez un autre mot.";
          progress.innerHTML = word.split("").map((c) => `<span class="done">${c}</span>`).join("");
          addXp(word.length);
          return;
        }
        const c = word[i];
        letterEl.textContent = c;
        desc.textContent = DATA.alphabet.find((a) => a.l === c).d;
        progress.innerHTML = word.split("").map((ch, k) =>
          `<span class="${k < i ? "done" : k === i ? "cur" : ""}">${ch}</span>`).join("");
        i++;
        timer = setTimeout(step, Number(speed.value));
      })();
    };
    cleanup = () => clearTimeout(timer);
  }

  function alphaQuiz(view) {
    const picks = shuffle(DATA.alphabet).slice(0, 8);
    const questions = picks.map((a) => {
      const wrong = shuffle(DATA.alphabet.filter((x) => x.l !== a.l)).slice(0, 3).map((x) => x.l);
      return {
        q: "« " + a.d + " » — quelle lettre est décrite ?",
        options: [a.l, ...wrong],
        answer: 0
      };
    });
    view.innerHTML = `<div class="panel" id="aq"></div>`;
    runQuiz(view.querySelector("#aq"), questions, (score) => { addXp(score * 2); return ""; });
  }

  /* ---------- Vocabulaire ---------- */

  function renderVocab(themeId) {
    if (themeId) return renderTheme(themeId);
    app.innerHTML = `
      <h1>Vocabulaire</h1>
      <p class="lead">Choisissez un thème, regardez chaque signe en vidéo, puis ajoutez-le à vos révisions.</p>
      <div class="grid">
        ${DATA.themes.map((t) => {
          const added = t.words.filter((w) => state.cards[cardKey(t.id, w)]).length;
          return `<a class="card theme-card" href="#/vocabulaire/${t.id}">
            <span class="theme-icon" aria-hidden="true">${t.icon}</span>
            <h3>${esc(t.title)}</h3>
            <div class="progress"><span style="width:${(added / t.words.length) * 100}%"></span></div>
            <p class="muted">${added} / ${t.words.length} dans vos révisions</p>
          </a>`;
        }).join("")}
      </div>`;
  }

  function renderTheme(themeId) {
    const theme = DATA.themes.find((t) => t.id === themeId);
    if (!theme) { location.hash = "#/vocabulaire"; return; }
    const open = new Set();
    function draw() {
      app.innerHTML = `
        <a class="back" href="#/vocabulaire">← Tous les thèmes</a>
        <h1>${theme.icon} ${esc(theme.title)}</h1>
        <div class="row">
          <button class="btn primary" id="add-all">Ajouter tout le thème aux révisions</button>
        </div>
        <ul class="word-list">
          ${theme.words.map((w) => {
            const c = state.cards[cardKey(theme.id, w)];
            return `<li class="word">
              <span class="word-label">${esc(w)}</span>
              ${c ? `<span class="box-badge" title="Boîte de révision">Boîte ${c.box}</span>` : ""}
              <button class="btn small" data-show="${esc(w)}" aria-expanded="${open.has(w)}">${open.has(w) ? "Masquer" : "Voir le signe"}</button>
              <button class="btn small ${c ? "" : "primary"}" data-w="${esc(w)}">${c ? "Retirer" : "+ Réviser"}</button>
              <div class="word-video" ${open.has(w) ? "" : "hidden"}></div>
            </li>`;
          }).join("")}
        </ul>`;
      app.querySelector("#add-all").onclick = () => {
        theme.words.forEach((w) => {
          const k = cardKey(theme.id, w);
          if (!state.cards[k]) state.cards[k] = { box: 1, due: Date.now() };
        });
        saveState();
        draw();
      };
      app.querySelectorAll("[data-show]").forEach((b) => {
        const w = b.dataset.show;
        const box = b.parentElement.querySelector(".word-video");
        if (open.has(w)) mountVideo(box, w);
        b.onclick = () => {
          if (open.has(w)) {
            open.delete(w);
            box.hidden = true;
            box.innerHTML = "";
          } else {
            open.add(w);
            box.hidden = false;
            mountVideo(box, w);
          }
          b.textContent = open.has(w) ? "Masquer" : "Voir le signe";
          b.setAttribute("aria-expanded", open.has(w));
        };
      });
      app.querySelectorAll("[data-w]").forEach((b) => {
        b.onclick = () => {
          const k = cardKey(theme.id, b.dataset.w);
          if (state.cards[k]) delete state.cards[k];
          else state.cards[k] = { box: 1, due: Date.now() };
          saveState();
          draw();
        };
      });
    }
    draw();
  }

  /* ---------- Révisions espacées (Leitner) ---------- */

  function renderReview() {
    const queue = shuffle(dueCards());
    const total = queue.length;
    if (!Object.keys(state.cards).length) {
      app.innerHTML = `<h1>Révisions</h1>
        <div class="panel empty"><p>Vous n'avez encore aucun signe à réviser.</p>
        <a class="btn primary" href="#/vocabulaire">Choisir du vocabulaire</a></div>`;
      return;
    }
    if (!total) {
      const next = Math.min(...Object.values(state.cards).map((c) => c.due));
      const days = Math.max(1, Math.round((next - Date.now()) / DAY));
      app.innerHTML = `<h1>Révisions</h1>
        <div class="panel empty"><p>🎉 Tout est à jour ! Prochaine révision dans ${days} jour${days > 1 ? "s" : ""}.</p>
        <a class="btn" href="#/vocabulaire">Ajouter d'autres signes</a></div>`;
      return;
    }
    let done = 0;
    function show() {
      const c = queue.shift();
      if (!c) {
        app.innerHTML = `<h1>Révisions</h1><div class="panel empty">
          <p>✅ Séance terminée : ${done} signe${done > 1 ? "s" : ""} révisé${done > 1 ? "s" : ""}.</p>
          <a class="btn primary" href="#/">Retour à l'accueil</a></div>`;
        return;
      }
      app.innerHTML = `
        <h1>Révisions</h1>
        <div class="progress"><span style="width:${(done / total) * 100}%"></span></div>
        <p class="muted">${done} / ${total} · ${esc(c.theme.title)}</p>
        <div class="flashcard panel">
          <p class="muted">Comment signe-t-on…</p>
          <p class="flash-word">${esc(c.word)}</p>
          <p class="muted">Faites le signe de mémoire, puis vérifiez avec la vidéo.</p>
          <button class="btn primary" id="reveal">Voir le signe</button>
          <div class="flash-video" hidden></div>
          <div class="grade" hidden>
            <p>Comment ça s'est passé ?</p>
            <div class="row">
              <button class="btn bad" data-g="0">Pas encore</button>
              <button class="btn" data-g="1">Difficile</button>
              <button class="btn good" data-g="2">Je savais !</button>
            </div>
          </div>
          <button class="btn link" id="skip-video">J'ai vérifié autrement</button>
        </div>`;
      const grade = app.querySelector(".grade");
      const revealGrade = () => { grade.hidden = false; app.querySelector("#skip-video").hidden = true; };
      app.querySelector("#reveal").onclick = () => {
        const box = app.querySelector(".flash-video");
        box.hidden = false;
        app.querySelector("#reveal").hidden = true;
        mountVideo(box, c.word);
        revealGrade();
      };
      app.querySelector("#skip-video").onclick = revealGrade;
      grade.querySelectorAll("[data-g]").forEach((b) => {
        b.onclick = () => {
          const g = Number(b.dataset.g);
          const card = state.cards[c.key];
          if (g === 0) { card.box = 1; queue.push(c); }
          else if (g === 2) card.box = Math.min(5, card.box + 1);
          card.due = g === 0 ? Date.now() : today() + BOX_INTERVALS[card.box] * DAY;
          if (g !== 0) done++;
          addXp(g === 2 ? 3 : 1);
          show();
        };
      });
    }
    show();
  }

  /* ---------- Quiz général ---------- */

  function renderQuiz() {
    const lessonQs = DATA.lessons.flatMap((l) => l.quiz);
    const alphaQs = shuffle(DATA.alphabet).slice(0, 3).map((a) => ({
      q: "« " + a.d + " » — quelle lettre est décrite ?",
      options: [a.l, ...shuffle(DATA.alphabet.filter((x) => x.l !== a.l)).slice(0, 3).map((x) => x.l)],
      answer: 0
    }));
    const questions = shuffle(shuffle(lessonQs).slice(0, 7).concat(alphaQs));
    app.innerHTML = `
      <h1>Quiz général</h1>
      <p class="lead">10 questions tirées au hasard dans les leçons et l'alphabet.</p>
      <div class="panel" id="gq"></div>`;
    runQuiz(app.querySelector("#gq"), questions, (score) => {
      addXp(score * 3);
      return `<a class="btn primary" href="#/quiz/${Date.now()}">Nouveau quiz</a>`;
    });
  }

  /* ---------- Démarrage ---------- */

  router();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
