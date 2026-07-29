(function () {
  "use strict";

  const TOTAL_DAYS = 7;
  const pack = window.VIVA_CONTENT_PACK;
  const main = document.getElementById("appMain");
  const liveRegion = document.getElementById("liveRegion");
  const largeTextToggle = document.getElementById("largeTextToggle");
  const contrastToggle = document.getElementById("contrastToggle");

  if (!pack || !pack.days) {
    main.innerHTML = `
      <section class="screen-card" aria-labelledby="contentErrorTitle">
        <h1 id="contentErrorTitle">Today's moment is not available.</h1>
        <p>Please ask the person who set up Viva to check the content pack.</p>
      </section>`;
    return;
  }

  const packSlug = String(pack.id || "week-1").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const keys = {
    progress: `viva-${packSlug}-progress-v1`,
    largeText: "viva-preference-large-text",
    highContrast: "viva-preference-high-contrast",
    checks: `viva-${packSlug}-checks-day-`
  };

  let progress = loadProgress();
  let currentView = "today";
  let currentUtterance = null;
  let speechState = "idle";

  initializePreferences();
  renderToday(false);
  registerServiceWorker();

  largeTextToggle.addEventListener("click", function () {
    const enabled = !document.documentElement.classList.contains("large-text");
    applyLargeText(enabled);
    writeStorage(localStorage, keys.largeText, String(enabled));
    announce(`Large Text turned ${enabled ? "on" : "off"}.`);
  });

  contrastToggle.addEventListener("click", function () {
    const enabled = !document.documentElement.classList.contains("high-contrast");
    applyHighContrast(enabled);
    writeStorage(localStorage, keys.highContrast, String(enabled));
    announce(`High Contrast turned ${enabled ? "on" : "off"}.`);
  });

  main.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const action = button.dataset.action;

    if (action !== "speech-play" && action !== "speech-pause" && action !== "speech-stop") {
      stopSpeech(false);
    }

    switch (action) {
      case "start":
        renderChecklist(true);
        break;
      case "listen":
        renderListen(true);
        break;
      case "help":
        renderHelp(true);
        break;
      case "complete":
        completeCurrentDay();
        break;
      case "repeat-day":
        clearDayChecks(progress.currentDay);
        announce(`Day ${progress.currentDay} is ready to repeat.`);
        renderChecklist(true);
        break;
      case "back-today":
      case "show-next":
        renderToday(true);
        break;
      case "view-week":
        renderWeekComplete(true);
        break;
      case "start-week-over":
        startWeekOver();
        break;
      case "speech-play":
        playSpeech();
        break;
      case "speech-pause":
        pauseSpeech();
        break;
      case "speech-stop":
        stopSpeech(true);
        break;
      default:
        break;
    }
  });

  main.addEventListener("change", function (event) {
    const checkbox = event.target.closest("input[data-step-index]");
    if (!checkbox) return;

    const dayNumber = Number(checkbox.dataset.day);
    const checkedSteps = loadDayChecks(dayNumber);
    const stepIndex = Number(checkbox.dataset.stepIndex);

    if (checkbox.checked && !checkedSteps.includes(stepIndex)) {
      checkedSteps.push(stepIndex);
    } else if (!checkbox.checked) {
      const position = checkedSteps.indexOf(stepIndex);
      if (position !== -1) checkedSteps.splice(position, 1);
    }

    saveDayChecks(dayNumber, checkedSteps);
    updateChecklistProgress(dayNumber);
  });

  window.addEventListener("pagehide", function () {
    stopSpeech(false);
  });

  function renderToday(shouldFocus) {
    if (progress.weekComplete) {
      renderWeekComplete(shouldFocus);
      return;
    }

    currentView = "today";
    const dayNumber = progress.currentDay;
    const day = getDay(dayNumber);
    const completedCount = progress.completedDays.length;

    setScreen(`
      <section class="screen-card today-screen" aria-labelledby="todayTitle">
        <p class="day-label">Today · Day ${dayNumber} of ${TOTAL_DAYS}</p>
        <h1 id="todayTitle" tabindex="-1">${escapeHtml(getGreeting())}</h1>
        <h2>${escapeHtml(day.title)}</h2>
        <p class="daily-prompt">${escapeHtml(day.prompt)}</p>
        <p class="progress-note">${completedCount === 0 ? "Your first gentle moment is ready." : `${completedCount} ${completedCount === 1 ? "day" : "days"} completed this week.`}</p>

        <div class="action-grid" aria-label="Today's actions">
          <button class="action-button primary-action" type="button" data-action="start" aria-label="Start today's step-by-step checklist">
            <span class="action-name">Start</span>
            <span class="action-detail">Step-by-step checklist</span>
          </button>
          <button class="action-button" type="button" data-action="listen" aria-label="Listen to today's voice guidance">
            <span class="action-name">Listen</span>
            <span class="action-detail">Calm voice guidance</span>
          </button>
          <button class="action-button" type="button" data-action="help" aria-label="Open help for today's Companion Moment">
            <span class="action-name">Ask a Question</span>
            <span class="action-detail">See today's help</span>
          </button>
          <button class="action-button complete-action" type="button" data-action="complete" aria-label="Mark Day ${dayNumber} complete">
            <span class="action-name">Mark Complete</span>
            <span class="action-detail">Finish Day ${dayNumber}</span>
          </button>
        </div>

        <button class="secondary-button full-width-button" type="button" data-action="repeat-day" aria-label="Repeat Day ${dayNumber} without advancing">
          Repeat Day <span class="button-explanation">— stays on Day ${dayNumber}</span>
        </button>
      </section>`, shouldFocus);
  }

  function renderChecklist(shouldFocus) {
    currentView = "checklist";
    const dayNumber = progress.currentDay;
    const day = getDay(dayNumber);
    const checkedSteps = loadDayChecks(dayNumber);
    const checklist = day.steps.map(function (step, index) {
      const isChecked = checkedSteps.includes(index);
      return `
        <li class="checklist-item">
          <label>
            <input type="checkbox" data-day="${dayNumber}" data-step-index="${index}" aria-label="Step ${index + 1}: ${escapeHtml(step)}" ${isChecked ? "checked" : ""}>
            <span><span class="step-number">Step ${index + 1}</span>${escapeHtml(step)}</span>
          </label>
        </li>`;
    }).join("");

    setScreen(`
      <section class="screen-card" aria-labelledby="checklistTitle">
        <p class="day-label">Day ${dayNumber} of ${TOTAL_DAYS} · Checklist</p>
        <h1 id="checklistTitle" tabindex="-1">${escapeHtml(day.title)}</h1>
        <p id="checklistProgress" class="checklist-progress" aria-live="polite"></p>
        <ol class="checklist" aria-label="Today's steps">
          ${checklist}
        </ol>
        <div class="bottom-actions">
          <button class="primary-button" type="button" data-action="back-today" aria-label="Go back to the Today screen">Back to Today</button>
        </div>
      </section>`, shouldFocus);

    updateChecklistProgress(dayNumber);
  }

  function renderListen(shouldFocus) {
    currentView = "listen";
    speechState = "idle";
    const dayNumber = progress.currentDay;
    const day = getDay(dayNumber);
    const speechAvailable = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

    setScreen(`
      <section class="screen-card" aria-labelledby="listenTitle">
        <p class="day-label">Day ${dayNumber} of ${TOTAL_DAYS} · Listen</p>
        <h1 id="listenTitle" tabindex="-1">Voice Guidance</h1>
        <p class="screen-intro">Viva will read today's prepared guidance in one calm voice.</p>
        ${speechAvailable ? `
          <div class="speech-controls" aria-label="Voice guidance controls">
            <button id="speechPlay" class="primary-button" type="button" data-action="speech-play" aria-label="Play voice guidance">Play</button>
            <button id="speechPause" class="secondary-button" type="button" data-action="speech-pause" aria-label="Pause voice guidance" disabled>Pause</button>
            <button id="speechStop" class="secondary-button" type="button" data-action="speech-stop" aria-label="Stop voice guidance" disabled>Stop</button>
          </div>
          <p id="speechStatus" class="speech-status" aria-live="polite">Voice guidance is ready.</p>` : `
          <div class="notice" role="status">
            Voice guidance is not available in this browser. You can still read the prepared guidance below and use every other part of Viva.
          </div>`}
        <blockquote class="voice-script">${escapeHtml(day.voiceScript)}</blockquote>
        <div class="bottom-actions">
          <button class="secondary-button full-width-button" type="button" data-action="back-today" aria-label="Go back to the Today screen">Back to Today</button>
        </div>
      </section>`, shouldFocus);
  }

  function renderHelp(shouldFocus) {
    currentView = "help";
    const dayNumber = progress.currentDay;
    const day = getDay(dayNumber);

    setScreen(`
      <section class="screen-card" aria-labelledby="helpTitle">
        <p class="day-label">Day ${dayNumber} of ${TOTAL_DAYS} · Help</p>
        <h1 id="helpTitle" tabindex="-1">A Little Help for Today</h1>
        <p class="screen-intro">Here is calm, simple guidance for today's activity.</p>
        <div id="helpAnswer" class="help-panel" aria-live="polite">
          <p>Preparing today's help…</p>
        </div>
        <div class="bottom-actions">
          <button class="primary-button" type="button" data-action="back-today" aria-label="Go back to the Today screen">Back to Today</button>
        </div>
      </section>`, shouldFocus);

    answerQuestion(day, "").then(function (answer) {
      if (currentView !== "help" || progress.currentDay !== dayNumber) return;
      const panel = document.getElementById("helpAnswer");
      if (panel) panel.innerHTML = `<p>${escapeHtml(answer)}</p>`;
    });
  }

  function renderConfirmation(finishedDay, shouldFocus) {
    currentView = "confirmation";
    const finishedWeek = finishedDay === TOTAL_DAYS;
    const nextDay = progress.currentDay;

    setScreen(`
      <section class="screen-card completion-screen" aria-labelledby="doneTitle">
        <div class="completion-mark" aria-hidden="true">✓</div>
        <p class="day-label">Day ${finishedDay} complete</p>
        <h1 id="doneTitle" tabindex="-1">You're done for today.</h1>
        <p class="completion-message">${finishedWeek
          ? "You completed all seven Companion Moments. That is something to feel good about."
          : `Day ${nextDay} will be here whenever you are ready. There is no need to rush.`}</p>
        <button class="primary-button full-width-button" type="button" data-action="${finishedWeek ? "view-week" : "show-next"}" aria-label="${finishedWeek ? "View the completed week" : `See Day ${nextDay}`}">
          ${finishedWeek ? "View My Completed Week" : `See Day ${nextDay}`}
        </button>
      </section>`, shouldFocus);
  }

  function renderWeekComplete(shouldFocus) {
    currentView = "week-complete";

    setScreen(`
      <section class="screen-card completion-screen" aria-labelledby="weekTitle">
        <div class="completion-mark" aria-hidden="true">7</div>
        <p class="day-label">Companion Moment · Week complete</p>
        <h1 id="weekTitle" tabindex="-1">You've completed the week.</h1>
        <p class="completion-message">Seven gentle moments, one day at a time. Thank you for spending this time with Viva.</p>
        <button class="primary-button full-width-button" type="button" data-action="start-week-over" aria-label="Start the seven-day week again at Day 1">
          Start the Week Again
        </button>
      </section>`, shouldFocus);
  }

  function completeCurrentDay() {
    const finishedDay = progress.currentDay;
    if (!progress.completedDays.includes(finishedDay)) {
      progress.completedDays.push(finishedDay);
      progress.completedDays.sort(function (a, b) { return a - b; });
    }

    if (finishedDay < TOTAL_DAYS) {
      progress.currentDay = finishedDay + 1;
    } else {
      progress.weekComplete = true;
    }

    saveProgress();
    announce(`Day ${finishedDay} marked complete.`);
    renderConfirmation(finishedDay, true);
  }

  function startWeekOver() {
    progress = defaultProgress();
    saveProgress();
    for (let dayNumber = 1; dayNumber <= TOTAL_DAYS; dayNumber += 1) {
      clearDayChecks(dayNumber);
    }
    announce("A new week has started at Day 1.");
    renderToday(true);
  }

  // AI BACKEND SWAP POINT:
  // Replace only this async function later. The shipped MVP is intentionally
  // static, makes no network calls, and always returns the current day's help.
  async function answerQuestion(day, question) {
    void question;
    return day.help;
  }

  function playSpeech() {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

    if (speechState === "paused") {
      window.speechSynthesis.resume();
      speechState = "speaking";
      setSpeechStatus("Voice guidance is playing.");
      updateSpeechControls();
      return;
    }

    if (speechState === "speaking") return;

    window.speechSynthesis.cancel();
    const day = getDay(progress.currentDay);
    const utterance = new SpeechSynthesisUtterance(day.voiceScript);
    const preferredVoice = chooseCalmEnglishVoice();
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.lang = preferredVoice ? preferredVoice.lang : "en-US";
    utterance.rate = 0.88;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = function () {
      speechState = "speaking";
      setSpeechStatus("Voice guidance is playing.");
      updateSpeechControls();
    };
    utterance.onend = function () {
      speechState = "idle";
      currentUtterance = null;
      setSpeechStatus("Voice guidance is finished.");
      updateSpeechControls();
    };
    utterance.onerror = function (event) {
      speechState = "idle";
      currentUtterance = null;
      if (event.error !== "interrupted" && event.error !== "canceled") {
        setSpeechStatus("Voice guidance could not play. You can read the prepared guidance below.");
      }
      updateSpeechControls();
    };

    currentUtterance = utterance;
    speechState = "speaking";
    setSpeechStatus("Starting voice guidance…");
    updateSpeechControls();
    window.speechSynthesis.speak(utterance);
  }

  function pauseSpeech() {
    if (!("speechSynthesis" in window) || speechState !== "speaking") return;
    window.speechSynthesis.pause();
    speechState = "paused";
    setSpeechStatus("Voice guidance is paused.");
    updateSpeechControls();
  }

  function stopSpeech(shouldUpdateStatus) {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    currentUtterance = null;
    speechState = "idle";
    if (shouldUpdateStatus) setSpeechStatus("Voice guidance is stopped.");
    updateSpeechControls();
  }

  function chooseCalmEnglishVoice() {
    const voices = window.speechSynthesis.getVoices();
    const preferredNames = ["samantha", "karen", "serena", "moira", "ava", "aria", "jenny", "zira", "victoria", "daniel"];
    const englishVoices = voices.filter(function (voice) {
      return /^en([-_]|$)/i.test(voice.lang);
    });

    englishVoices.sort(function (a, b) {
      return voiceScore(b) - voiceScore(a);
    });
    return englishVoices[0] || null;

    function voiceScore(voice) {
      const name = voice.name.toLowerCase();
      const preferredIndex = preferredNames.findIndex(function (preferred) {
        return name.includes(preferred);
      });
      let score = preferredIndex === -1 ? 0 : 30 - preferredIndex;
      if (voice.localService) score += 4;
      if (/^en-us$/i.test(voice.lang)) score += 2;
      return score;
    }
  }

  function updateSpeechControls() {
    const playButton = document.getElementById("speechPlay");
    const pauseButton = document.getElementById("speechPause");
    const stopButton = document.getElementById("speechStop");
    if (!playButton || !pauseButton || !stopButton) return;

    playButton.disabled = speechState === "speaking";
    playButton.textContent = speechState === "paused" ? "Resume" : "Play";
    playButton.setAttribute("aria-label", speechState === "paused" ? "Resume voice guidance" : "Play voice guidance");
    pauseButton.disabled = speechState !== "speaking";
    stopButton.disabled = speechState === "idle";
  }

  function setSpeechStatus(message) {
    const status = document.getElementById("speechStatus");
    if (status) status.textContent = message;
  }

  function updateChecklistProgress(dayNumber) {
    const status = document.getElementById("checklistProgress");
    if (!status) return;
    const day = getDay(dayNumber);
    const checkedCount = loadDayChecks(dayNumber).length;
    status.textContent = `${checkedCount} of ${day.steps.length} steps checked.`;
  }

  function getDay(dayNumber) {
    return pack.days[dayNumber] || pack.days[String(dayNumber)];
  }

  function defaultProgress() {
    return { currentDay: 1, completedDays: [], weekComplete: false };
  }

  function loadProgress() {
    const fallback = defaultProgress();
    try {
      const saved = JSON.parse(localStorage.getItem(`viva-${String(pack.id || "week-1").replace(/[^a-z0-9-]/gi, "-").toLowerCase()}-progress-v1`));
      if (!saved || typeof saved !== "object") return fallback;

      const completedDays = Array.isArray(saved.completedDays)
        ? [...new Set(saved.completedDays.map(Number).filter(function (day) { return day >= 1 && day <= TOTAL_DAYS; }))]
        : [];
      const currentDay = Math.min(TOTAL_DAYS, Math.max(1, Number(saved.currentDay) || 1));
      return {
        currentDay: currentDay,
        completedDays: completedDays,
        weekComplete: Boolean(saved.weekComplete) && completedDays.includes(TOTAL_DAYS)
      };
    } catch (error) {
      return fallback;
    }
  }

  function saveProgress() {
    writeStorage(localStorage, keys.progress, JSON.stringify(progress));
  }

  function loadDayChecks(dayNumber) {
    try {
      const saved = JSON.parse(sessionStorage.getItem(keys.checks + dayNumber));
      if (!Array.isArray(saved)) return [];
      const stepCount = getDay(dayNumber).steps.length;
      return [...new Set(saved.map(Number).filter(function (index) {
        return Number.isInteger(index) && index >= 0 && index < stepCount;
      }))];
    } catch (error) {
      return [];
    }
  }

  function saveDayChecks(dayNumber, checkedSteps) {
    writeStorage(sessionStorage, keys.checks + dayNumber, JSON.stringify(checkedSteps));
  }

  function clearDayChecks(dayNumber) {
    try {
      sessionStorage.removeItem(keys.checks + dayNumber);
    } catch (error) {
      // The checklist still works for the current view if session storage is blocked.
    }
  }

  function initializePreferences() {
    const largeText = readBooleanPreference(keys.largeText, false);
    const highContrast = readBooleanPreference(keys.highContrast, true);
    applyLargeText(largeText);
    applyHighContrast(highContrast);
  }

  function applyLargeText(enabled) {
    document.documentElement.classList.toggle("large-text", enabled);
    largeTextToggle.setAttribute("aria-pressed", String(enabled));
    largeTextToggle.setAttribute("aria-label", `Turn Large Text ${enabled ? "off" : "on"}`);
    largeTextToggle.textContent = `Large Text: ${enabled ? "On" : "Off"}`;
  }

  function applyHighContrast(enabled) {
    document.documentElement.classList.toggle("high-contrast", enabled);
    contrastToggle.setAttribute("aria-pressed", String(enabled));
    contrastToggle.setAttribute("aria-label", `Turn High Contrast ${enabled ? "off" : "on"}`);
    contrastToggle.textContent = `High Contrast: ${enabled ? "On" : "Off"}`;
  }

  function readBooleanPreference(key, fallback) {
    try {
      const saved = localStorage.getItem(key);
      return saved === null ? fallback : saved === "true";
    } catch (error) {
      return fallback;
    }
  }

  function writeStorage(storage, key, value) {
    try {
      storage.setItem(key, value);
    } catch (error) {
      // Viva remains usable when private browsing or browser policy blocks storage.
    }
  }

  function setScreen(html, shouldFocus) {
    main.innerHTML = html;
    if (shouldFocus) {
      const heading = main.querySelector("h1");
      if (heading) heading.focus();
      else main.focus();
    }
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning.";
    if (hour < 18) return "Good afternoon.";
    return "Good evening.";
  }

  function announce(message) {
    liveRegion.textContent = "";
    window.setTimeout(function () {
      liveRegion.textContent = message;
    }, 40);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function registerServiceWorker() {
    const isSafeContext = window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if ("serviceWorker" in navigator && isSafeContext) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("./sw.js").catch(function () {
          // The app still renders normally when service workers are blocked.
        });
      });
    }
  }
}());
