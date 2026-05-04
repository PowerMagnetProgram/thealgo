const PRIMARY_BG = "#0d1b2a";
const CARD_BG = "#1b263b";
const ACCENT = "#00d4ff";
const TEXT = "#e6f7ff";

const STORAGE_KEYS = {
  responseLog: "powermagnet.responses.log",
  authUsers: "powermagnet.auth.users",
  authSession: "powermagnet.auth.session",
  gameScores: "powermagnet.game.scores",
  directMessages: "powermagnet.direct.messages",
  communityMessages: "powermagnet.community.messages",
  messageReadState: "powermagnet.message.readstate",
};

const AUTH_PASSWORD_MIN_LENGTH = 6;
const GAME_SCORE_LABELS = {
  binaryBrainChallenge: "Binary Brain Challenge",
  neuralBinaryTraining: "Neural Binary Training",
};

const INVITE_MESSAGES = [
  "🤝 Great opportunities are better shared! Invite a friend to join PowerMagnetProgram 🚀",
  "🎯 Imagine building tech projects with your friends! Share the program with them!",
  "💡 One invite could change someone's life. Invite a friend today!",
  "🚀 Bring your tribe to PowerMagnetProgram. Build and grow together!",
  "🔥 Who do you know that wants to build an app or website? Tell them now!",
];

const THANK_YOU_MESSAGES = [
  "🎉 Thank you for completing the PowerMagnetProgram Funnel!",
  "🙏 Your responses are recorded. Welcome aboard!",
  "🚀 You are now part of the growing PowerMagnet community!",
];

const FUNNEL_QUESTIONS = [
  "What name should the PowerMagnet energy recognize you by?",
  "Where on the planet is your magnetic field centered? 🌍",
  "What energy or desire pulled you toward PowerMagnetProgram?",
  "What magnetic outcomes do you want to attract into your life or business?",
  "What powerful skills, ideas, or energy can you share with the PowerMagnet tribe?",
  "In your view, how can the Value Ladder and Funnel unite to create momentum and flow?",
  "What kind of transformation or feedback have others noticed in you?",
  "Describe your dream customer - the person your energy truly serves.",
  "Where does your ideal audience or client usually gather or connect?",
  "Drop your email so we can magnetically keep in touch. ✉️",
  "What's the best phone number for energy updates and collaboration? 📞",
  "What's your main channel for attracting attention or energy flow?",
  "Where online can we explore your world - blog, portfolio, or website? 🌐",
  "What's your origin story - how did your magnetic journey begin?",
  "What key lessons or magnetic moments shaped your mindset?",
  "What imperfections or lessons remind you that you're beautifully human? ❤️",
  "What strong beliefs or polarities charge your personality? ⚡",
  "In one powerful sentence - who are you at your magnetic core?",
  "If your life was a movie, what magnetic theme or title would it carry? 🎬",
];

const BENEFITS = [
  "Boost creative thinking 🤖",
  "Encrypt mindset techniques 🔐",
  "Learn programming & binary 🧠",
  "Train to solve complex puzzles 🚀",
  "Build neural habits & focus ✨",
];

const LOCAL_BRAIN_FALLBACKS = [
  "Stay focused. Every bit counts!",
  "Try encoding a message using: Encode: success",
  "Decode binary to understand how computers talk.",
];

const ARTICLES = {
  students: {
    title: "Students: Why Master Art of Binanme helps you learn faster",
    body: "Students benefit from binary thinking because it trains decision-making and logic. Master Art of Binanme breaks down binary into playful exercises and real-life analogies.",
  },
  programmers: {
    title: "Programmers & Hackers: Improve your low-level intuition",
    body: "Programmers strengthen their low-level intuition by practicing binary transformations and pattern recognition.",
  },
  entrepreneurs: {
    title: "Entrepreneurs: Binary clarity for better decisions",
    body: "Entrepreneurs gain clarity by reducing complex decisions to binary choices.",
  },
};

function initResponseFiles() {
  if (!localStorage.getItem(STORAGE_KEYS.responseLog)) {
    localStorage.setItem(
      STORAGE_KEYS.responseLog,
      "### PowerMagnetProgram Funnel Responses ###\n\n"
    );
  }
}

function saveToFile(key, value) {
  try {
    const current = localStorage.getItem(STORAGE_KEYS.responseLog) || "";
    const line = `[${new Date().toISOString()}] ${key}: ${value}\n`;
    localStorage.setItem(STORAGE_KEYS.responseLog, `${current}${line}`);
  } catch (error) {
    console.error("Save error:", error);
  }
}

function getStoredJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Unable to parse stored JSON for ${key}.`, error);
    return fallback;
  }
}

function setStoredJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function fallbackHashPassword(password) {
  let hash = 0;
  for (let index = 0; index < password.length; index += 1) {
    hash = (hash << 5) - hash + password.charCodeAt(index);
    hash |= 0;
  }
  return `fallback-${Math.abs(hash).toString(16)}`;
}

async function hashPassword(password) {
  if (!window.crypto || !window.crypto.subtle) {
    return fallbackHashPassword(password);
  }

  const bytes = new TextEncoder().encode(password);
  const buffer = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

function createDefaultGameScores() {
  return {
    binaryBrainChallenge: {
      correct: 0,
      attempts: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastPlayedAt: null,
    },
    neuralBinaryTraining: {
      correct: 0,
      attempts: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastPlayedAt: null,
    },
  };
}

function mergeGameScores(rawScores = {}) {
  const defaults = createDefaultGameScores();
  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [
      key,
      {
        ...value,
        ...(rawScores[key] || {}),
      },
    ])
  );
}

function formatGameAccuracy(stats) {
  if (!stats.attempts) {
    return "No rounds yet";
  }

  return `${Math.round((stats.correct / stats.attempts) * 100)}% accuracy`;
}

function formatTimestamp(timestamp) {
  if (!timestamp) {
    return "Unknown time";
  }

  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return "Unknown time";
  }

  return parsed.toLocaleString();
}

function createDefaultReadState() {
  return {
    directByUser: {},
    communityReadAt: null,
  };
}

function mergeReadState(rawState = {}) {
  return {
    ...createDefaultReadState(),
    ...rawState,
    directByUser: {
      ...createDefaultReadState().directByUser,
      ...(rawState.directByUser || {}),
    },
  };
}

function toTimestampNumber(value) {
  if (!value) {
    return 0;
  }

  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function textToBinary(text) {
  return Array.from(new TextEncoder().encode(text))
    .map((byte) => byte.toString(2).padStart(8, "0"))
    .join(" ");
}

function binaryToText(binaryStr) {
  let normalized = binaryStr.trim().replace(/\n/g, " ").replace(/\t/g, " ");
  const tokens = normalized.split(" ").filter((token) => token !== "");
  let bytesData = [];

  if (
    tokens.length > 0 &&
    tokens.every((token) => /^[01]{8}$/.test(token))
  ) {
    bytesData = tokens.map((token) => parseInt(token, 2));
  } else {
    normalized = normalized.replace(/[^01]/g, "");
    if (normalized.length % 8 !== 0) {
      throw new Error("Binary not multiple of 8 bits.");
    }
    for (let index = 0; index < normalized.length; index += 8) {
      bytesData.push(parseInt(normalized.slice(index, index + 8), 2));
    }
  }

  return new TextDecoder("utf-8", { fatal: true }).decode(
    new Uint8Array(bytesData)
  );
}

function localBrain(prompt) {
  const normalized = prompt.toLowerCase().trim();

  if (normalized.startsWith("encode:")) {
    return textToBinary(prompt.slice(7).trim());
  }

  if (normalized.startsWith("decode:")) {
    try {
      return binaryToText(prompt.slice(7).trim());
    } catch (error) {
      return `Decode error: ${error.message}`;
    }
  }

  if (normalized.includes("binary")) {
    return "Binary uses 0s and 1s to represent data. Try: Encode: Hello";
  }

  return randomChoice(LOCAL_BRAIN_FALLBACKS);
}

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  if (options.className) {
    element.className = options.className;
  }
  if (options.text !== undefined) {
    element.textContent = options.text;
  }
  if (options.html) {
    element.innerHTML = options.html;
  }
  if (options.type) {
    element.type = options.type;
  }
  if (options.placeholder) {
    element.placeholder = options.placeholder;
  }
  if (options.value !== undefined) {
    element.value = options.value;
  }
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  return element;
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise((resolve, reject) => {
    const buffer = createElement("textarea", { value: text });
    buffer.style.position = "fixed";
    buffer.style.opacity = "0";
    document.body.appendChild(buffer);
    buffer.focus();
    buffer.select();

    try {
      const ok = document.execCommand("copy");
      document.body.removeChild(buffer);
      if (!ok) {
        reject(new Error("Copy command failed."));
        return;
      }
      resolve();
    } catch (error) {
      document.body.removeChild(buffer);
      reject(error);
    }
  });
}

function downloadTextFile(filename, contents) {
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

class ToastManager {
  constructor(root) {
    this.root = root;
  }

  show(message, duration = 2400) {
    const toast = createElement("div", { className: "toast", text: message });
    this.root.appendChild(toast);
    window.setTimeout(() => toast.remove(), duration);
  }
}

class ModalManager {
  constructor(root) {
    this.root = root;
    this.titleEl = root.querySelector("#modal-title");
    this.bodyEl = root.querySelector("#modal-body");
    this.actionsEl = root.querySelector("#modal-actions");
    this.closeButton = root.querySelector("#modal-close");
    this.close = this.close.bind(this);

    this.root.addEventListener("click", (event) => {
      if (event.target.hasAttribute("data-close-modal")) {
        this.close();
      }
    });

    this.closeButton.addEventListener("click", this.close);
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !this.root.classList.contains("hidden")) {
        this.close();
      }
    });
  }

  show({ title, body, actions = [] }) {
    this.titleEl.textContent = title;
    this.bodyEl.innerHTML = "";

    if (typeof body === "string") {
      this.bodyEl.innerHTML = body;
    } else if (body instanceof HTMLElement) {
      this.bodyEl.appendChild(body);
    }

    this.actionsEl.innerHTML = "";
    actions.forEach((action) => {
      const button = createElement("button", {
        className: action.className || "secondary-button",
        text: action.label,
        type: "button",
      });
      button.addEventListener("click", () => {
        if (action.keepOpen !== true) {
          this.close();
        }
        if (typeof action.onClick === "function") {
          action.onClick();
        }
      });
      this.actionsEl.appendChild(button);
    });

    if (actions.length === 0) {
      const closeBtn = createElement("button", {
        className: "secondary-button",
        text: "Close",
        type: "button",
      });
      closeBtn.addEventListener("click", this.close);
      this.actionsEl.appendChild(closeBtn);
    }

    this.root.classList.remove("hidden");
    this.root.setAttribute("aria-hidden", "false");
  }

  close() {
    this.root.classList.add("hidden");
    this.root.setAttribute("aria-hidden", "true");
    this.bodyEl.innerHTML = "";
    this.actionsEl.innerHTML = "";
  }
}

class AuthManager {
  getUsers() {
    return getStoredJson(STORAGE_KEYS.authUsers, []);
  }

  saveUsers(users) {
    setStoredJson(STORAGE_KEYS.authUsers, users);
  }

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.authSession);
  }

  createSession(user) {
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      loggedInAt: new Date().toISOString(),
    };

    setStoredJson(STORAGE_KEYS.authSession, session);
    return session;
  }

  getSession() {
    const session = getStoredJson(STORAGE_KEYS.authSession, null);
    if (!session || !session.id || !session.email) {
      return null;
    }

    const user = this.getUsers().find(
      (candidate) =>
        candidate.id === session.id &&
        candidate.email === normalizeEmail(session.email)
    );

    if (!user) {
      this.clearSession();
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      loggedInAt: session.loggedInAt || user.lastLoginAt || user.createdAt,
    };
  }

  async register({ name, email, password, confirmPassword }) {
    const trimmedName = name.trim();
    const normalizedEmail = normalizeEmail(email);

    if (!trimmedName) {
      throw new Error("Please enter your full name.");
    }

    if (!isValidEmail(normalizedEmail)) {
      throw new Error("Please enter a valid email address.");
    }

    if (password.length < AUTH_PASSWORD_MIN_LENGTH) {
      throw new Error(
        `Password must be at least ${AUTH_PASSWORD_MIN_LENGTH} characters long.`
      );
    }

    if (password !== confirmPassword) {
      throw new Error("Password confirmation does not match.");
    }

    const users = this.getUsers();
    if (users.some((candidate) => candidate.email === normalizedEmail)) {
      throw new Error("An account with that email already exists.");
    }

    const timestamp = new Date().toISOString();
    const user = {
      id: `pm-${Date.now()}`,
      name: trimmedName,
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      createdAt: timestamp,
      lastLoginAt: timestamp,
    };

    users.push(user);
    this.saveUsers(users);

    return this.createSession(user);
  }

  async login({ email, password }) {
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      throw new Error("Please enter a valid email address.");
    }

    if (!password) {
      throw new Error("Please enter your password.");
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(
      (candidate) => candidate.email === normalizedEmail
    );

    if (userIndex === -1) {
      throw new Error("No account was found for that email.");
    }

    const passwordHash = await hashPassword(password);
    const user = users[userIndex];
    if (user.passwordHash !== passwordHash) {
      throw new Error("Incorrect password. Please try again.");
    }

    users[userIndex] = {
      ...user,
      lastLoginAt: new Date().toISOString(),
    };
    this.saveUsers(users);

    return this.createSession(users[userIndex]);
  }
}

class BasePage {
  constructor(app) {
    this.app = app;
    this.container = null;
  }

  mount(container) {
    this.container = container;
  }

  destroy() {}
}

class DashboardPage extends BasePage {
  mount(container) {
    super.mount(container);
    container.innerHTML = `
      <section class="page">
        <div class="hero-card">
          <p class="eyebrow">Dashboard</p>
          <h3 class="page-title">⚡ Power Magnet Dashboard ⚡</h3>
          <p class="page-copy">Master Art of Binanme - Control Center</p>
        </div>
        <div class="card">
          <div class="canvas-wrap">
            <canvas class="wave-canvas" aria-label="Animated wave visual"></canvas>
          </div>
        </div>
      </section>
    `;

    this.canvas = container.querySelector(".wave-canvas");
    this.context = this.canvas.getContext("2d");
    this.phase = 0;
    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    this.resize();
    window.addEventListener("resize", this.resize);
    this.frameId = requestAnimationFrame(this.animate);
  }

  resize() {
    const bounds = this.canvas.parentElement.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    this.canvas.width = bounds.width * ratio;
    this.canvas.height = Math.max(140, bounds.height) * ratio;
    this.canvas.style.height = `${Math.max(140, bounds.height)}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  animate() {
    const ctx = this.context;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = ACCENT;
    ctx.beginPath();

    for (let x = 0; x < Math.max(200, width); x += 6) {
      const y = height / 2 + 20 * Math.sin(x * 0.02 + this.phase * 0.12);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    this.phase += 1;
    this.frameId = requestAnimationFrame(this.animate);
  }

  destroy() {
    window.removeEventListener("resize", this.resize);
    cancelAnimationFrame(this.frameId);
  }
}

class FunnelSession {
  constructor(app, container, options = {}) {
    this.app = app;
    this.container = container;
    this.onReturn = options.onReturn || (() => {});
    this.responses = {};
    this.stageIndex = 0;
    this.userName = null;
    this.typeTimers = [];
    this.reminderTimeout = null;
    this.inviteInterval = null;
    this.inviteHideTimeout = null;
    this.finished = false;
  }

  mount() {
    initResponseFiles();
    this.container.innerHTML = `
      <div class="funnel-layout">
        <div class="card funnel-header">
          <div>
            <p class="eyebrow">Embedded Funnel</p>
            <h3 class="page-title">💫 Magnet Funnel</h3>
          </div>
          <span class="progress-chip">Question 1 of ${FUNNEL_QUESTIONS.length}</span>
        </div>
        <div class="card question-card">
          <div class="question-block">
            <div class="typed-question"></div>
            <input class="text-input mono-text" type="text" aria-label="Current funnel answer">
            <div class="button-row">
              <button class="secondary-button js-next" type="button">Next →</button>
              <button class="ghost-button js-skip" type="button">Skip</button>
              <button class="secondary-button js-summary" type="button">📋 Summary</button>
            </div>
            <p class="reminder-text"></p>
            <div class="button-row js-funnel-links hidden"></div>
          </div>
        </div>
      </div>
    `;

    this.progressLabel = this.container.querySelector(".progress-chip");
    this.questionLabel = this.container.querySelector(".typed-question");
    this.input = this.container.querySelector(".text-input");
    this.nextButton = this.container.querySelector(".js-next");
    this.skipButton = this.container.querySelector(".js-skip");
    this.summaryButton = this.container.querySelector(".js-summary");
    this.reminderLabel = this.container.querySelector(".reminder-text");
    this.linksRow = this.container.querySelector(".js-funnel-links");

    this.nextButton.addEventListener("click", () => this.nextStage());
    this.skipButton.addEventListener("click", () => this.skipStage());
    this.summaryButton.addEventListener("click", () => this.showSummary());
    this.showQuestion();
    this.startInviteReminderLoop();
  }

  clearTypewriter() {
    this.typeTimers.forEach((timer) => clearTimeout(timer));
    this.typeTimers = [];
  }

  typeText(text, speed = 20) {
    this.clearTypewriter();
    this.questionLabel.textContent = "";

    for (let index = 0; index <= text.length; index += 1) {
      const timer = window.setTimeout(() => {
        this.questionLabel.textContent = text.slice(0, index);
      }, speed * index);
      this.typeTimers.push(timer);
    }
  }

  showQuestion() {
    const total = FUNNEL_QUESTIONS.length;
    this.progressLabel.textContent = `Question ${this.stageIndex + 1} of ${total}`;

    let question = FUNNEL_QUESTIONS[this.stageIndex];
    if (this.userName && question.includes("{name}")) {
      question = question.replace("{name}", this.userName);
    }

    this.typeText(question);
    this.input.focus();
  }

  nextStage() {
    const answer = this.input.value.trim();

    if ((this.stageIndex === 0 || this.stageIndex === 1) && !answer) {
      this.app.modal.show({
        title: "Input required",
        body:
          '<p class="modal-copy">Please enter a response to proceed. This helps us personalize your experience.</p>',
      });
      return;
    }

    const key = FUNNEL_QUESTIONS[this.stageIndex];
    if (answer) {
      this.responses[key] = answer;
      saveToFile(key, answer);
      if (this.stageIndex === 0) {
        this.userName = answer.split(/\s+/)[0];
      }
    } else {
      this.responses[key] = "";
      saveToFile(key, "<skipped>");
    }

    this.input.value = "";
    this.stageIndex += 1;

    if (this.stageIndex < FUNNEL_QUESTIONS.length) {
      if (Math.random() < 0.3) {
        this.reminderLabel.textContent = randomChoice([
          "Magnetic thought! Keep going...",
          "Nice - your answers are shaping a path.",
          "You're doing great - next question!",
        ]);
        clearTimeout(this.reminderTimeout);
        this.reminderTimeout = window.setTimeout(() => {
          this.reminderLabel.textContent = "";
        }, 1200);
      }
      this.showQuestion();
      return;
    }

    this.finishFunnel();
  }

  skipStage() {
    const key = FUNNEL_QUESTIONS[this.stageIndex];
    this.responses[key] = "<skipped>";
    saveToFile(key, "<skipped>");
    this.input.value = "";
    this.stageIndex += 1;

    if (this.stageIndex < FUNNEL_QUESTIONS.length) {
      this.showQuestion();
      return;
    }

    this.finishFunnel();
  }

  finishFunnel() {
    this.finished = true;
    this.progressLabel.textContent = `Question ${FUNNEL_QUESTIONS.length} of ${FUNNEL_QUESTIONS.length}`;
    this.typeText(randomChoice(THANK_YOU_MESSAGES));
    this.input.classList.add("hidden");
    this.nextButton.disabled = true;
    this.skipButton.disabled = true;

    this.linksRow.classList.remove("hidden");
    this.linksRow.innerHTML = "";

    const whatsappButton = createElement("button", {
      className: "link-button whatsapp-button",
      text: "💬 WhatsApp",
      type: "button",
    });
    whatsappButton.addEventListener("click", () => {
      window.open(
        "https://wa.me/2347054015789?text=Hello%20from%20PowerMagnetProgram",
        "_blank",
        "noopener"
      );
    });

    const telegramButton = createElement("button", {
      className: "link-button telegram-button",
      text: "📱 Telegram",
      type: "button",
    });
    telegramButton.addEventListener("click", () => {
      window.open("https://t.me/PowerMagnetProgram", "_blank", "noopener");
    });

    const returnButton = createElement("button", {
      className: "secondary-button",
      text: "🔙 Return to Main Menu",
      type: "button",
    });
    returnButton.addEventListener("click", () => this.onReturn());

    this.linksRow.append(whatsappButton, telegramButton, returnButton);
  }

  buildSummaryText() {
    return FUNNEL_QUESTIONS.map((question, index) => {
      const answer = this.responses[question] ?? "<no answer>";
      return `${index + 1}. ${question}\n➡ ${answer}`;
    }).join("\n\n");
  }

  showSummary() {
    if (Object.keys(this.responses).length === 0) {
      this.app.modal.show({
        title: "Summary",
        body: '<p class="modal-copy">No responses yet.</p>',
      });
      return;
    }

    const summaryText = this.buildSummaryText();
    const pre = createElement("pre", {
      className: "summary-pre mono-text",
      text: summaryText,
    });

    this.app.modal.show({
      title: "Your Magnet Funnel Summary",
      body: pre,
      actions: [
        {
          label: "Close",
          className: "ghost-button",
        },
        {
          label: "Export to file",
          className: "secondary-button",
          onClick: () => downloadTextFile("magnet_summary.txt", summaryText),
        },
      ],
    });
  }

  startInviteReminderLoop() {
    this.inviteInterval = window.setInterval(() => {
      this.reminderLabel.textContent = randomChoice(INVITE_MESSAGES);
      clearTimeout(this.inviteHideTimeout);
      this.inviteHideTimeout = window.setTimeout(() => {
        this.reminderLabel.textContent = "";
      }, 5000);
    }, 30000);
  }

  destroy() {
    this.clearTypewriter();
    clearTimeout(this.reminderTimeout);
    clearTimeout(this.inviteHideTimeout);
    clearInterval(this.inviteInterval);
  }
}

class MagnetFunnelPage extends BasePage {
  mount(container) {
    super.mount(container);
    container.innerHTML = `<section class="page"></section>`;
    this.session = new FunnelSession(this.app, container.querySelector(".page"), {
      onReturn: () => this.app.showPage("Dashboard"),
    });
    this.session.mount();
  }

  destroy() {
    this.session.destroy();
  }
}

class PowerMagnetPage extends BasePage {
  mount(container) {
    super.mount(container);
    container.innerHTML = `
      <section class="page power-shell">
        <div class="card power-header">
          <div>
            <p class="eyebrow">PowerMagnet</p>
            <h3 class="page-title">🧲 PowerMagnet - Master Art of Binanme</h3>
          </div>
          <span class="benefit-chip">${BENEFITS[0]}</span>
        </div>
        <div class="power-content"></div>
      </section>
    `;

    this.content = container.querySelector(".power-content");
    this.benefitDisplay = container.querySelector(".benefit-chip");
    this.benefitIndex = 0;
    this.powerLevel = 0;
    this.activeCleanup = null;
    this.benefitTimer = window.setInterval(() => this.rotateBenefit(), 2200);
    this.showWelcomeSplash(3000);
  }

  rotateBenefit() {
    this.benefitIndex = (this.benefitIndex + 1) % BENEFITS.length;
    this.benefitDisplay.textContent = BENEFITS[this.benefitIndex];
  }

  clearContent() {
    if (typeof this.activeCleanup === "function") {
      this.activeCleanup();
      this.activeCleanup = null;
    }
    this.content.innerHTML = "";
  }

  showWelcomeSplash(duration = 3000) {
    this.clearContent();
    this.content.innerHTML = `
      <div class="card splash-card">
        <div>
          <p class="eyebrow">Welcome</p>
          <h3 class="page-title">🧲 Welcome to PowerMagnet - Master Art of Binanme</h3>
          <p class="page-copy">Think in binary. Act in focus.</p>
          <p class="splash-dots mono-text"></p>
        </div>
      </div>
    `;

    const dots = this.content.querySelector(".splash-dots");
    let tick = 0;
    this.splashInterval = window.setInterval(() => {
      dots.textContent = ".".repeat(tick % 4);
      tick += 1;
    }, 400);

    this.splashTimeout = window.setTimeout(() => {
      clearInterval(this.splashInterval);
      this.showMainMenu();
    }, duration);

    this.activeCleanup = () => {
      clearInterval(this.splashInterval);
      clearTimeout(this.splashTimeout);
    };
  }

  showMainMenu() {
    this.clearContent();

    const menuItems = [
      {
        label: "🔢 Encode Thought",
        description: "Convert ordinary text into spaced 8-bit binary.",
        action: () => this.encodeScreen(),
      },
      {
        label: "🔍 Decode Signal",
        description: "Decode binary back into readable UTF-8 text.",
        action: () => this.decodeScreen(),
      },
      {
        label: "🎯 Binary Brain Challenge",
        description: "Guess the matching character from a timed binary prompt.",
        action: () => this.guessingGameAdvanced(),
      },
      {
        label: "💫 Magnet Funnel",
        description: "Run the onboarding funnel inside the PowerMagnet workspace.",
        action: () => this.showFunnelEmbedded(),
      },
      {
        label: "🧠 Neural Binary Training",
        description: "Practice converting random numbers into 8-bit binary.",
        action: () => this.learnBinarySession(),
      },
      {
        label: "📘 Binary ↔ Alphabet",
        description: "Map text to binary and browse common ASCII values.",
        action: () => this.binaryMapSession(),
      },
      {
        label: "💸 Support / Donate",
        description: "Review the donation details from the original app.",
        action: () => this.donationPage(),
      },
      {
        label: "👥 Who Should Use This",
        description: "Read short articles for students, programmers, and entrepreneurs.",
        action: () => this.whoShouldUse(),
      },
      {
        label: "💼 Hire / Apply",
        description: "Open the hire/apply contact card used in the desktop version.",
        action: () => this.hireApplyPage(),
      },
    ];

    const wrapper = createElement("div", { className: "page" });
    const card = createElement("div", { className: "card" });
    card.innerHTML = `
      <p class="eyebrow">Menu</p>
      <h3 class="page-title">PowerMagnet Menu</h3>
      <p class="page-copy">The original Tkinter app presents these tools as a 3x3 command grid.</p>
    `;

    const grid = createElement("div", { className: "menu-grid" });
    menuItems.forEach((item) => {
      const panel = createElement("article", { className: "menu-card" });
      const title = createElement("h4", { text: item.label });
      const copy = createElement("p", { text: item.description });
      const button = createElement("button", {
        className: "secondary-button",
        text: "Open",
        type: "button",
      });
      button.addEventListener("click", item.action);
      panel.append(title, copy, button);
      grid.appendChild(panel);
    });

    wrapper.append(card, this.createScoreOverviewCard(), grid);
    this.content.appendChild(wrapper);
  }

  createBackButtonRow(callbacks) {
    const row = createElement("div", { className: "button-row" });
    callbacks.forEach((item) => {
      const button = createElement("button", {
        className: item.className || "secondary-button",
        text: item.label,
        type: "button",
      });
      button.addEventListener("click", item.onClick);
      row.appendChild(button);
    });
    return row;
  }

  createScoreOverviewCard() {
    const scores = this.app.getCurrentUserScores();
    const wrapper = createElement("div", { className: "card" });
    const totalCorrect = Object.values(scores).reduce(
      (sum, stats) => sum + stats.correct,
      0
    );

    wrapper.innerHTML = `
      <p class="eyebrow">Saved Scores</p>
      <h3 class="page-title">Game Progress Tracker</h3>
      <p class="page-copy">Scores are linked to your login and reload automatically when you come back.</p>
      <div class="score-grid">
        ${Object.entries(scores)
          .map(
            ([key, stats]) => `
              <div class="status-chip">${GAME_SCORE_LABELS[key] || key}: ${stats.correct} correct</div>
              <div class="status-chip">${formatGameAccuracy(stats)} | Best streak ${stats.bestStreak}</div>
            `
          )
          .join("")}
      </div>
      <p class="muted">Total saved score: ${totalCorrect}</p>
    `;

    return wrapper;
  }

  encodeScreen() {
    this.clearContent();
    this.content.innerHTML = `
      <div class="page">
        <div class="card">
          <p class="eyebrow">Encode</p>
          <h3 class="page-title">Encode Thought ➜ Binary 🤖</h3>
          <div class="card">
            <input class="text-input mono-text js-source" type="text" aria-label="Text to encode">
            <textarea class="text-output mono-text js-output" readonly aria-label="Binary output"></textarea>
          </div>
        </div>
      </div>
    `;

    const source = this.content.querySelector(".js-source");
    const output = this.content.querySelector(".js-output");
    const row = this.createBackButtonRow([
      {
        label: "🚀 Transmit",
        onClick: () => {
          try {
            output.value = textToBinary(source.value);
          } catch (error) {
            this.app.modal.show({
              title: "Encode Error",
              body: `<p class="modal-copy">${error.message}</p>`,
            });
          }
        },
      },
      {
        label: "📋 Copy",
        onClick: () => {
          copyToClipboard(output.value.trim())
            .then(() => this.app.toast.show("Binary copied to clipboard."))
            .catch((error) =>
              this.app.modal.show({
                title: "Copy Error",
                body: `<p class="modal-copy">${error.message}</p>`,
              })
            );
        },
      },
      {
        label: "🔙 Back",
        className: "ghost-button",
        onClick: () => this.showMainMenu(),
      },
    ]);

    this.content.querySelector(".page").appendChild(row);
  }

  decodeScreen() {
    this.clearContent();
    this.content.innerHTML = `
      <div class="page">
        <div class="card">
          <p class="eyebrow">Decode</p>
          <h3 class="page-title">Decode Signal ➜ Text 🔎</h3>
          <div class="card">
            <input class="text-input mono-text js-source" type="text" aria-label="Binary to decode">
            <textarea class="text-output mono-text js-output" readonly aria-label="Decoded text output"></textarea>
          </div>
        </div>
      </div>
    `;

    const source = this.content.querySelector(".js-source");
    const output = this.content.querySelector(".js-output");
    const row = this.createBackButtonRow([
      {
        label: "🔓 Decode",
        onClick: () => {
          try {
            output.value = binaryToText(source.value);
          } catch (error) {
            this.app.modal.show({
              title: "Decode Error",
              body: `<p class="modal-copy">${error.message}</p>`,
            });
          }
        },
      },
      {
        label: "📋 Copy",
        onClick: () => {
          copyToClipboard(output.value.trim())
            .then(() => this.app.toast.show("Text copied to clipboard."))
            .catch((error) =>
              this.app.modal.show({
                title: "Copy Error",
                body: `<p class="modal-copy">${error.message}</p>`,
              })
            );
        },
      },
      {
        label: "🔙 Back",
        className: "ghost-button",
        onClick: () => this.showMainMenu(),
      },
    ]);

    this.content.querySelector(".page").appendChild(row);
  }

  binaryMapSession() {
    this.clearContent();
    this.content.innerHTML = `
      <div class="page">
        <div class="card">
          <p class="eyebrow">Reference</p>
          <h3 class="page-title">Binary ↔ Character Map 📘</h3>
        </div>
        <div class="split-layout">
          <div class="split-card">
            <label class="muted" for="map-text">Enter text to convert:</label>
            <input id="map-text" class="compact-input mono-text" type="text">
            <label class="muted" for="map-binary">Or paste binary (space separated):</label>
            <input id="map-binary" class="compact-input mono-text" type="text">
            <textarea class="text-output mono-text js-map-output" readonly></textarea>
          </div>
          <div class="split-card">
            <h4 class="section-title">Common ASCII Mappings</h4>
            <textarea class="text-output mono-text ascii-table js-ascii-table" readonly></textarea>
          </div>
        </div>
      </div>
    `;

    const textEntry = this.content.querySelector("#map-text");
    const binaryEntry = this.content.querySelector("#map-binary");
    const output = this.content.querySelector(".js-map-output");
    const asciiTable = this.content.querySelector(".js-ascii-table");
    asciiTable.value = Array.from({ length: 95 }, (_, offset) => {
      const code = offset + 32;
      const character = String.fromCharCode(code);
      return `${character} : ${textToBinary(character)}`;
    }).join("\n");

    const row = this.createBackButtonRow([
      {
        label: "Convert Text → Binary",
        onClick: () => {
          if (!textEntry.value) {
            this.app.modal.show({
              title: "Info",
              body: '<p class="modal-copy">Enter text.</p>',
            });
            return;
          }
          output.value = textEntry.value
            .toUpperCase()
            .split("")
            .map((character) => `${character} : ${textToBinary(character)}`)
            .join("\n");
        },
      },
      {
        label: "Convert Binary → Text",
        onClick: () => {
          try {
            output.value = `Decoded: ${binaryToText(binaryEntry.value.trim())}`;
          } catch (error) {
            this.app.modal.show({
              title: "Error",
              body: `<p class="modal-copy">${error.message}</p>`,
            });
          }
        },
      },
      {
        label: "📋 Copy Table",
        onClick: () => {
          copyToClipboard(asciiTable.value)
            .then(() => this.app.toast.show("Mappings copied to clipboard."))
            .catch((error) =>
              this.app.modal.show({
                title: "Copy Error",
                body: `<p class="modal-copy">${error.message}</p>`,
              })
            );
        },
      },
      {
        label: "🔙 Back",
        className: "ghost-button",
        onClick: () => this.showMainMenu(),
      },
    ]);

    this.content.querySelector(".page").appendChild(row);
  }

  learnBinarySession() {
    this.clearContent();
    this.content.innerHTML = `
      <div class="page">
        <div class="card">
          <p class="eyebrow">Training</p>
          <h3 class="page-title">Neural Binary Training 🧠</h3>
        </div>
        <div class="game-card">
          <div class="score-grid">
            <div class="status-chip js-total-score"></div>
            <div class="status-chip js-accuracy"></div>
            <div class="status-chip js-current-streak"></div>
            <div class="status-chip js-best-streak"></div>
          </div>
          <div class="status-chip js-current-number"></div>
          <input class="compact-input mono-text js-answer" type="text" aria-label="Binary training answer">
          <p class="feedback-text js-feedback"></p>
          <p class="status-chip js-hints-left"></p>
        </div>
      </div>
    `;

    let currentNum = randomInt(1, 255);
    const hintCount = { left: 3 };
    const currentLabel = this.content.querySelector(".js-current-number");
    const answerInput = this.content.querySelector(".js-answer");
    const feedback = this.content.querySelector(".js-feedback");
    const hintLabel = this.content.querySelector(".js-hints-left");
    const totalScoreLabel = this.content.querySelector(".js-total-score");
    const accuracyLabel = this.content.querySelector(".js-accuracy");
    const currentStreakLabel = this.content.querySelector(".js-current-streak");
    const bestStreakLabel = this.content.querySelector(".js-best-streak");

    const syncScoreLabels = () => {
      const stats = this.app.getCurrentUserScores().neuralBinaryTraining;
      totalScoreLabel.textContent = `Saved score: ${stats.correct}`;
      accuracyLabel.textContent = `Attempts: ${stats.attempts} | ${formatGameAccuracy(stats)}`;
      currentStreakLabel.textContent = `Current streak: ${stats.currentStreak}`;
      bestStreakLabel.textContent = `Best streak: ${stats.bestStreak}`;
    };

    const updateNumber = () => {
      currentLabel.textContent = `Convert to 8-bit binary: ${currentNum}`;
      hintLabel.textContent = `Hints left: ${hintCount.left}`;
    };

    const giveHint = () => {
      if (hintCount.left <= 0) {
        this.app.modal.show({
          title: "No Hints",
          body: '<p class="modal-copy">No hints left.</p>',
        });
        return;
      }

      hintCount.left -= 1;
      hintLabel.textContent = `Hints left: ${hintCount.left}`;

      const correct = currentNum.toString(2).padStart(8, "0");
      const variants = [correct];
      for (let round = 0; round < 2; round += 1) {
        const bits = correct.split("");
        const flipIndex = randomInt(0, 7);
        bits[flipIndex] = bits[flipIndex] === "0" ? "1" : "0";
        variants.push(bits.join(""));
      }
      shuffleInPlace(variants);

      const content = createElement("div", { className: "modal-option-grid" });
      content.appendChild(
        createElement("p", {
          className: "modal-copy",
          text: "Which of these is the correct binary?",
        })
      );

      variants.forEach((variant) => {
        const option = createElement("button", {
          className: "modal-option mono-text",
          text: variant,
          type: "button",
        });
        option.addEventListener("click", () => {
          this.app.modal.close();
          if (variant === correct) {
            feedback.textContent = "✅ Correct choice from hint! Try entering it.";
            feedback.className = "feedback-text js-feedback is-success";
          } else {
            feedback.textContent = "❌ That wasn't it. Keep trying.";
            feedback.className = "feedback-text js-feedback is-error";
          }
        });
        content.appendChild(option);
      });

      this.app.modal.show({
        title: "Hint - Choose",
        body: content,
        actions: [
          {
            label: "Reveal correct binary",
            className: "secondary-button",
            onClick: () => {
              this.app.modal.show({
                title: "Hint",
                body: `<p class="modal-copy">Correct binary: <span class="mono-text">${correct}</span></p>`,
              });
            },
          },
        ],
      });
    };

    const checkAndNext = () => {
      const user = answerInput.value.trim();
      const correct = currentNum.toString(2).padStart(8, "0");
      const isCorrect = user === correct;
      if (user === correct) {
        feedback.textContent = "✅ Correct - Neural sync achieved.";
        feedback.className = "feedback-text js-feedback is-success";
      } else {
        feedback.textContent = `❌ Incorrect. Correct: ${correct}`;
        feedback.className = "feedback-text js-feedback is-error";
      }
      this.app.recordGameResult("neuralBinaryTraining", isCorrect);
      syncScoreLabels();
      currentNum = randomInt(1, 255);
      updateNumber();
      answerInput.value = "";
    };

    syncScoreLabels();
    updateNumber();
    const row = this.createBackButtonRow([
      { label: "Check", onClick: checkAndNext },
      { label: "Hint", onClick: giveHint },
      {
        label: "Back",
        className: "ghost-button",
        onClick: () => this.showMainMenu(),
      },
    ]);

    this.content.querySelector(".page").appendChild(row);
  }

  guessingGameAdvanced() {
    this.clearContent();
    this.content.innerHTML = `
      <div class="page">
        <div class="card">
          <p class="eyebrow">Challenge</p>
          <h3 class="page-title">🎯 Binary Brain Challenge - Advanced</h3>
        </div>
        <div class="game-card">
          <div class="score-grid">
            <div class="status-chip js-session-score"></div>
            <div class="status-chip js-saved-score"></div>
            <div class="status-chip js-current-streak"></div>
            <div class="status-chip js-best-streak"></div>
          </div>
          <div class="challenge-binary js-binary"></div>
          <input class="compact-input mono-text js-guess" type="text" maxlength="3" aria-label="Challenge guess">
          <p class="status-chip js-hints"></p>
          <p class="binary-timer js-timer"></p>
          <p class="result-text js-result"></p>
        </div>
      </div>
    `;

    let challengeChar = randomInt(33, 126);
    let challengeBinary = challengeChar.toString(2).padStart(8, "0");
    let challengeTimeLeft = { t: 20 };
    let challengeRunning = { val: true };
    let challengeScore = { s: 0 };
    let challengeHints = { left: 3 };

    const binaryLabel = this.content.querySelector(".js-binary");
    const entry = this.content.querySelector(".js-guess");
    const hintLabel = this.content.querySelector(".js-hints");
    const timerLabel = this.content.querySelector(".js-timer");
    const resultLabel = this.content.querySelector(".js-result");
    const sessionScoreLabel = this.content.querySelector(".js-session-score");
    const savedScoreLabel = this.content.querySelector(".js-saved-score");
    const currentStreakLabel = this.content.querySelector(".js-current-streak");
    const bestStreakLabel = this.content.querySelector(".js-best-streak");
    let roundLocked = false;
    let roundFeedbackTimeout = null;

    const syncScoreLabels = () => {
      const stats = this.app.getCurrentUserScores().binaryBrainChallenge;
      sessionScoreLabel.textContent = `Session score: ${challengeScore.s}`;
      savedScoreLabel.textContent = `Saved score: ${stats.correct}/${stats.attempts}`;
      currentStreakLabel.textContent = `Current streak: ${stats.currentStreak}`;
      bestStreakLabel.textContent = `Best streak: ${stats.bestStreak}`;
    };

    const renderRound = () => {
      binaryLabel.textContent = challengeBinary;
      hintLabel.textContent = `Hints left: ${challengeHints.left}`;
      timerLabel.textContent = `${challengeTimeLeft.t
        .toString(2)
        .padStart(8, "0")} (binary seconds left)`;
      resultLabel.textContent = "";
      resultLabel.className = "result-text js-result";
      entry.value = "";
      syncScoreLabels();
    };

    const nextRound = () => {
      challengeChar = randomInt(33, 126);
      challengeBinary = challengeChar.toString(2).padStart(8, "0");
      challengeTimeLeft = { t: 20 };
      challengeHints = { left: 3 };
      roundLocked = false;
      renderRound();
    };

    const finishRound = (isCorrect, message, stateClass) => {
      if (roundLocked) {
        return;
      }

      roundLocked = true;
      if (isCorrect) {
        challengeScore.s += 1;
      }

      this.app.recordGameResult("binaryBrainChallenge", isCorrect);
      syncScoreLabels();
      resultLabel.textContent = message;
      resultLabel.className = `result-text js-result ${stateClass}`;

      clearTimeout(roundFeedbackTimeout);
      roundFeedbackTimeout = window.setTimeout(() => {
        nextRound();
      }, 1200);
    };

    const provideHint = () => {
      if (challengeHints.left <= 0) {
        this.app.modal.show({
          title: "No Hints",
          body: '<p class="modal-copy">No hints left for this round.</p>',
        });
        return;
      }

      challengeHints.left -= 1;
      hintLabel.textContent = `Hints left: ${challengeHints.left}`;

      const first4 = challengeBinary.slice(0, 4);
      const options = [challengeBinary];
      for (let round = 0; round < 2; round += 1) {
        const bits = challengeBinary.split("");
        const flipIndex = randomInt(0, 7);
        bits[flipIndex] = bits[flipIndex] === "0" ? "1" : "0";
        options.push(bits.join(""));
      }
      shuffleInPlace(options);

      const content = createElement("div", { className: "modal-option-grid" });
      content.appendChild(
        createElement("p", {
          className: "modal-copy",
          text: "Which binary matches the above character?",
        })
      );

      options.forEach((optionValue) => {
        const option = createElement("button", {
          className: "modal-option mono-text",
          text: optionValue,
          type: "button",
        });
        option.addEventListener("click", () => {
          this.app.modal.close();
          if (optionValue === challengeBinary) {
            resultLabel.textContent = "✅ Hint choice correct - use it to answer.";
            resultLabel.className = "result-text js-result is-success";
          } else {
            resultLabel.textContent = "❌ Not correct. Keep trying.";
            resultLabel.className = "result-text js-result is-error";
          }
        });
        content.appendChild(option);
      });

      this.app.modal.show({
        title: "Hint Choice",
        body: content,
        actions: [
          {
            label: "Reveal first 4 bits",
            className: "secondary-button",
            onClick: () => {
              this.app.modal.show({
                title: "Hint",
                body: `<p class="modal-copy">First 4 bits: <span class="mono-text">${first4}</span></p>`,
              });
            },
          },
        ],
      });
    };

    const submitGuess = () => {
      const guess = entry.value;
      if (!guess) {
        return;
      }

      if (guess.length !== 1) {
        this.app.modal.show({
          title: "Input",
          body: '<p class="modal-copy">Enter exactly one character.</p>',
        });
        return;
      }
      if (guess === String.fromCharCode(challengeChar)) {
        finishRound(true, "Correct!", "is-success");
      } else {
        finishRound(
          false,
          `Wrong. It was '${String.fromCharCode(challengeChar)}'.`,
          "is-error"
        );
      }
      return;

      if (guess === String.fromCharCode(challengeChar)) {
        resultLabel.textContent = "✅ Correct!";
        resultLabel.className = "result-text js-result is-success";
        challengeScore.s += 1;
      } else {
        resultLabel.textContent = `❌ Wrong. It was '${String.fromCharCode(
          challengeChar
        )}'.`;
        resultLabel.className = "result-text js-result is-error";
      }

      nextRound();
    };

    const tick = () => {
      if (!challengeRunning.val || roundLocked) {
        return;
      }
      if (challengeTimeLeft.t <= 0) {
        finishRound(
          false,
          `Time! It was '${String.fromCharCode(challengeChar)}'.`,
          "is-error"
        );
        return;
      }

      if (challengeTimeLeft.t <= 0) {
        resultLabel.textContent = `⏱ Time! It was '${String.fromCharCode(
          challengeChar
        )}'`;
        resultLabel.className = "result-text js-result is-error";
        nextRound();
        return;
      }

      challengeTimeLeft.t -= 1;
      timerLabel.textContent = `${challengeTimeLeft.t
        .toString(2)
        .padStart(8, "0")} (binary seconds left)`;
    };

    renderRound();
    const interval = window.setInterval(tick, 1000);
    this.activeCleanup = () => {
      challengeRunning.val = false;
      clearInterval(interval);
      clearTimeout(roundFeedbackTimeout);
    };

    entry.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        submitGuess();
      }
    });

    const row = this.createBackButtonRow([
      { label: "Submit", onClick: submitGuess },
      { label: "Hint", onClick: provideHint },
      {
        label: "Quit",
        className: "ghost-button",
        onClick: () => this.showMainMenu(),
      },
    ]);

    this.content.querySelector(".page").appendChild(row);
  }

  donationPage() {
    this.clearContent();
    this.content.innerHTML = `
      <div class="page">
        <div class="card">
          <p class="eyebrow">Support</p>
          <h3 class="page-title">Support PowerMagnetProgram 💸</h3>
          <div class="card">
            <p class="muted">Donate via Moniepoint (Nigeria)</p>
            <p><strong>Account:</strong> 7054015789 - <strong>Payee:</strong> PowerMagnetProgram</p>
            <label class="muted" for="crypto-wallet">Crypto Donation (optional):</label>
            <input id="crypto-wallet" class="compact-input" type="text" value="Paste wallet address (BTC/ETH/USDT...)">
          </div>
        </div>
      </div>
    `;

    const cryptoEntry = this.content.querySelector("#crypto-wallet");
    const row = this.createBackButtonRow([
      {
        label: "Donate / Support",
        onClick: () =>
          this.app.modal.show({
            title: "Thanks",
            body: `<p class="modal-copy">Thanks for considering support!\nMoniepoint: 7054015789\nCrypto: ${escapeHtml(
              cryptoEntry.value
            )}</p>`,
          }),
      },
      {
        label: "🔙 Back",
        className: "ghost-button",
        onClick: () => this.showMainMenu(),
      },
    ]);

    this.content.querySelector(".page").appendChild(row);
  }

  whoShouldUse() {
    this.clearContent();
    const page = createElement("div", { className: "page" });
    const intro = createElement("div", { className: "card" });
    intro.innerHTML = `
      <p class="eyebrow">Audience</p>
      <h3 class="page-title">Who Should Use PowerMagnet Binanme? 👥</h3>
      <p class="page-copy">The desktop app renders a list of mini articles with a Read button for each audience profile.</p>
    `;

    const list = createElement("div", { className: "article-list" });
    Object.values(ARTICLES).forEach((article) => {
      const card = createElement("article", { className: "article-card" });
      const textWrap = createElement("div");
      textWrap.append(
        createElement("h4", { text: article.title }),
        createElement("p", { text: article.body })
      );
      const button = createElement("button", {
        className: "secondary-button",
        text: "Read",
        type: "button",
      });
      button.addEventListener("click", () => this.showArticleWindow(article));
      card.append(textWrap, button);
      list.appendChild(card);
    });

    const row = this.createBackButtonRow([
      {
        label: "🔙 Back",
        className: "ghost-button",
        onClick: () => this.showMainMenu(),
      },
    ]);

    page.append(intro, list, row);
    this.content.appendChild(page);
  }

  showArticleWindow(article) {
    const body = createElement("div");
    body.append(
      createElement("h4", { text: article.title }),
      createElement("p", { className: "article-copy", text: article.body })
    );

    this.app.modal.show({
      title: article.title,
      body,
      actions: [{ label: "Close", className: "secondary-button" }],
    });
  }

  hireApplyPage() {
    this.clearContent();
    this.content.innerHTML = `
      <div class="page">
        <div class="card">
          <p class="eyebrow">Contact</p>
          <h3 class="page-title">Work with PowerMagnetProgram</h3>
          <div class="card">
            <p class="muted">Hire a Powerful Magnetic Programmer 💼</p>
          </div>
        </div>
      </div>
    `;

    const row = this.createBackButtonRow([
      {
        label: "Contact Us",
        onClick: () =>
          this.app.modal.show({
            title: "Contact",
            body:
              '<p class="modal-copy">Email admin@powermagnet (demo)</p>',
          }),
      },
      {
        label: "🔙 Back",
        className: "ghost-button",
        onClick: () => this.showMainMenu(),
      },
    ]);

    this.content.querySelector(".page").appendChild(row);
  }

  showFunnelEmbedded() {
    this.clearContent();
    const wrapper = createElement("div", { className: "page" });
    this.content.appendChild(wrapper);
    const session = new FunnelSession(this.app, wrapper, {
      onReturn: () => this.showMainMenu(),
    });
    session.mount();
    this.activeCleanup = () => session.destroy();
  }

  incPower(amount = 1) {
    this.powerLevel += amount;
  }

  destroy() {
    clearInterval(this.benefitTimer);
    this.clearContent();
  }
}

class BinaryVisualizerPage extends BasePage {
  mount(container) {
    super.mount(container);
    container.innerHTML = `
      <section class="page visualizer-shell">
        <div class="visualizer-card">
          <p class="eyebrow">Visualizer</p>
          <h3 class="page-title">Binary Visualizer</h3>
          <div class="visualizer-stage">
            <canvas class="visualizer-canvas" aria-label="Binary visualizer canvas"></canvas>
          </div>
        </div>
        <div class="card visualizer-controls">
          <input class="compact-input mono-text js-input" type="text" aria-label="Text to visualize">
          <button class="secondary-button js-encode" type="button">Encode Text</button>
          <button class="ghost-button js-clear" type="button">Clear</button>
        </div>
      </section>
    `;

    this.canvas = container.querySelector(".visualizer-canvas");
    this.context = this.canvas.getContext("2d");
    this.input = container.querySelector(".js-input");
    this.binary = "";
    this.resize = this.resize.bind(this);

    container.querySelector(".js-encode").addEventListener("click", () => {
      const text = this.input.value;
      if (!text) {
        return;
      }
      this.binary = textToBinary(text);
      this.draw();
    });

    container.querySelector(".js-clear").addEventListener("click", () => {
      this.binary = "";
      this.draw();
    });

    this.resize();
    window.addEventListener("resize", this.resize);
  }

  resize() {
    const bounds = this.canvas.parentElement.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    this.canvas.width = bounds.width * ratio;
    this.canvas.height = Math.max(220, bounds.height) * ratio;
    this.canvas.style.height = `${Math.max(220, bounds.height)}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.draw();
  }

  draw() {
    const ctx = this.context;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#040c16";
    ctx.fillRect(0, 0, width, height);

    if (!this.binary) {
      return;
    }

    ctx.fillStyle = "#15f4ee";
    ctx.font = 'bold 16px "Consolas", monospace';
    ctx.textBaseline = "top";

    const truncated = `${this.binary.slice(0, 200)}...`;
    wrapCanvasText(ctx, truncated, 24, 36, width - 48, 26);
  }

  destroy() {
    window.removeEventListener("resize", this.resize);
  }
}

class ChatPage extends BasePage {
  mount(container) {
    super.mount(container);
    container.innerHTML = `
      <section class="page">
        <div class="chat-card">
          <div>
            <p class="eyebrow">Offline Assistant</p>
            <h3 class="page-title">💬 Offline Chat</h3>
          </div>
          <input class="text-input js-prompt" type="text" aria-label="Offline chat prompt">
          <button class="secondary-button js-ask" type="button">Ask</button>
          <textarea class="text-output chat-output js-output" readonly aria-label="Offline chat output"></textarea>
        </div>
      </section>
    `;

    const entry = container.querySelector(".js-prompt");
    const output = container.querySelector(".js-output");
    container.querySelector(".js-ask").addEventListener("click", () => {
      const question = entry.value.trim();
      if (!question) {
        return;
      }
      const answer = localBrain(question);
      output.value = `Q: ${question}\n\nA: ${answer}`;
    });
  }
}

class CommunityChatPage extends BasePage {
  constructor(app) {
    super(app);
    this.activeView = "community";
    this.selectedUserId = null;
    this.handleStorage = this.handleStorage.bind(this);
  }

  mount(container) {
    super.mount(container);
    container.innerHTML = `
      <section class="page community-shell">
        <div class="card">
          <p class="eyebrow">Community Chat</p>
          <h3 class="page-title">Message Users, Join the Room, and Compare Scores</h3>
          <p class="page-copy">Use the whole-community room for general chat or switch to direct messages for private conversations.</p>
        </div>

        <div class="card">
          <div class="community-tab-row">
            <button class="community-tab js-view-tab is-active" type="button" data-view="community">
              <span>Community Room</span>
              <span class="community-unread-badge js-community-view-badge hidden"></span>
            </button>
            <button class="community-tab js-view-tab" type="button" data-view="direct">
              <span>Direct Messages</span>
              <span class="community-unread-badge js-direct-view-badge hidden"></span>
            </button>
          </div>
        </div>

        <div class="card community-scoreboard">
          <div class="community-toolbar">
            <div>
              <p class="eyebrow">Leaderboard</p>
              <h4 class="section-title">Player Scores</h4>
            </div>
            <button class="ghost-button js-refresh-community" type="button">Refresh</button>
          </div>
          <div class="community-score-grid js-scoreboard"></div>
        </div>

        <section class="chat-card community-room-card js-community-room-card">
          <div class="community-room-header">
            <div>
              <p class="eyebrow">Whole Community</p>
              <h3 class="page-title">Community Room</h3>
              <p class="community-user-copy js-community-meta">General room for all registered users.</p>
            </div>
          </div>
          <div class="community-feed js-community-feed"></div>
          <form class="community-composer js-community-form">
            <textarea class="text-output community-composer-input js-community-input" aria-label="Community room message" placeholder="Share an update with the whole community..."></textarea>
            <div class="community-toolbar">
              <p class="muted js-community-hint">Everyone on this browser can read posts in the community room.</p>
              <button class="primary-button" type="submit">Post to Room</button>
            </div>
          </form>
        </section>

        <div class="community-layout js-direct-layout hidden">
          <aside class="card community-sidebar">
            <div>
              <p class="eyebrow">Members</p>
              <h4 class="section-title">Choose a Player</h4>
              <p class="muted">Pick another registered user to open a direct conversation.</p>
            </div>
            <div class="community-user-list js-user-list"></div>
          </aside>

          <section class="chat-card community-thread-card">
            <div class="community-thread-header">
              <div>
                <p class="eyebrow">Conversation</p>
                <h3 class="page-title js-thread-title">Select a user</h3>
                <p class="community-user-copy js-thread-meta">Choose a player from the list to start chatting.</p>
              </div>
            </div>
            <div class="community-thread-body js-thread-messages"></div>
            <form class="community-composer js-message-form">
              <textarea class="text-output community-composer-input js-message-input" aria-label="Direct message" placeholder="Write a message to another user..."></textarea>
              <div class="community-toolbar">
                <p class="muted js-composer-hint">Messages are stored locally in this browser for registered users.</p>
                <button class="primary-button js-send-message" type="submit">Send Message</button>
              </div>
            </form>
          </section>
        </div>
      </section>
    `;

    this.scoreboardEl = container.querySelector(".js-scoreboard");
    this.viewTabs = Array.from(container.querySelectorAll(".js-view-tab"));
    this.communityViewBadge = container.querySelector(".js-community-view-badge");
    this.directViewBadge = container.querySelector(".js-direct-view-badge");
    this.communityRoomCard = container.querySelector(".js-community-room-card");
    this.directLayout = container.querySelector(".js-direct-layout");
    this.communityFeedEl = container.querySelector(".js-community-feed");
    this.communityMetaEl = container.querySelector(".js-community-meta");
    this.communityForm = container.querySelector(".js-community-form");
    this.communityInput = container.querySelector(".js-community-input");
    this.communityHintEl = container.querySelector(".js-community-hint");
    this.userListEl = container.querySelector(".js-user-list");
    this.threadTitleEl = container.querySelector(".js-thread-title");
    this.threadMetaEl = container.querySelector(".js-thread-meta");
    this.threadMessagesEl = container.querySelector(".js-thread-messages");
    this.messageForm = container.querySelector(".js-message-form");
    this.messageInput = container.querySelector(".js-message-input");
    this.composerHintEl = container.querySelector(".js-composer-hint");
    this.sendButton = container.querySelector(".js-send-message");

    container
      .querySelector(".js-refresh-community")
      .addEventListener("click", () => this.refreshData());

    this.viewTabs.forEach((button) => {
      button.addEventListener("click", () => {
        this.switchView(button.dataset.view);
      });
    });

    this.communityForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleCommunitySendMessage();
    });

    this.messageForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleSendMessage();
    });

    window.addEventListener("storage", this.handleStorage);
    this.refreshData();
  }

  handleStorage(event) {
    if (
      [
        STORAGE_KEYS.authUsers,
        STORAGE_KEYS.gameScores,
        STORAGE_KEYS.directMessages,
        STORAGE_KEYS.communityMessages,
        STORAGE_KEYS.messageReadState,
      ].includes(event.key)
    ) {
      this.refreshData();
    }
  }

  switchView(view) {
    this.activeView = view === "direct" ? "direct" : "community";
    this.refreshData();
  }

  refreshData() {
    this.users = this.app.getCommunityUsers();
    const currentUserId = this.app.currentUser?.id;
    this.otherUsers = this.users.filter((user) => user.id !== currentUserId);

    if (!this.otherUsers.some((user) => user.id === this.selectedUserId)) {
      this.selectedUserId = this.otherUsers[0]?.id || null;
    }

    let unreadSummary = this.app.getUnreadNotificationSummary();
    if (this.activeView === "community" && unreadSummary.communityTotal > 0) {
      this.app.markCommunityMessagesRead();
      unreadSummary = this.app.getUnreadNotificationSummary();
    }

    if (
      this.activeView === "direct" &&
      this.selectedUserId &&
      unreadSummary.directByUser[this.selectedUserId]
    ) {
      this.app.markConversationRead(this.selectedUserId);
      unreadSummary = this.app.getUnreadNotificationSummary();
    }

    this.unreadSummary = unreadSummary;
    this.renderViewTabs();
    this.renderActiveView();
    this.renderScoreboard();
    this.renderCommunityRoom();
    this.renderUserList();
    this.renderConversation();
  }

  renderViewTabs() {
    this.viewTabs.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === this.activeView);
    });

    const directTotal = this.unreadSummary?.directTotal || 0;
    const communityTotal = this.unreadSummary?.communityTotal || 0;

    this.directViewBadge.textContent = directTotal ? String(directTotal) : "";
    this.directViewBadge.classList.toggle("hidden", directTotal === 0);
    this.communityViewBadge.textContent = communityTotal
      ? String(communityTotal)
      : "";
    this.communityViewBadge.classList.toggle("hidden", communityTotal === 0);
  }

  renderActiveView() {
    this.communityRoomCard.classList.toggle(
      "hidden",
      this.activeView !== "community"
    );
    this.directLayout.classList.toggle("hidden", this.activeView !== "direct");
  }

  renderScoreboard() {
    if (this.users.length === 0) {
      this.scoreboardEl.innerHTML =
        '<div class="community-empty">No registered users yet.</div>';
      return;
    }

    const currentUserId = this.app.currentUser?.id;
    this.scoreboardEl.innerHTML = this.users
      .map((user) => {
        const accuracy = user.totalAttempts
          ? `${Math.round((user.totalCorrect / user.totalAttempts) * 100)}% overall accuracy`
          : "No rounds yet";

        return `
          <article class="community-score-user ${user.id === currentUserId ? "is-current" : ""}">
            <div class="community-toolbar">
              <div>
                <h4 class="score-item-title">${escapeHtml(user.name)}</h4>
                <p class="community-user-copy">${escapeHtml(user.email)}</p>
              </div>
              <span class="status-chip">${user.id === currentUserId ? "You" : "Player"}</span>
            </div>
            <p class="community-user-copy">
              Total score: ${user.totalCorrect}<br>
              Attempts: ${user.totalAttempts}<br>
              Best streak: ${user.bestStreak}<br>
              ${accuracy}
            </p>
          </article>
        `;
      })
      .join("");
  }

  renderCommunityRoom() {
    const communityMessages = this.app.getAllCommunityMessages();
    this.communityMetaEl.textContent = `${this.users.length} registered players | ${communityMessages.length} total room posts`;
    this.communityHintEl.textContent =
      this.activeView === "community"
        ? "You are viewing the live community room."
        : "Open the community room tab to clear room notifications.";

    if (communityMessages.length === 0) {
      this.communityFeedEl.innerHTML = `
        <div class="community-empty">
          No community posts yet. Start the first conversation for everyone.
        </div>
      `;
      return;
    }

    const userMap = new Map(this.users.map((user) => [user.id, user]));
    this.communityFeedEl.innerHTML = communityMessages
      .map((message) => {
        const author = userMap.get(message.fromUserId);
        const authorName = author?.name || "Unknown user";
        const authorScore = author?.totalCorrect ?? 0;
        return `
          <article class="community-feed-card">
            <div class="community-toolbar">
              <div>
                <h4 class="score-item-title">${escapeHtml(authorName)}</h4>
                <p class="community-user-copy">Score ${authorScore}</p>
              </div>
              <span class="status-chip">${formatTimestamp(message.createdAt)}</span>
            </div>
            <p class="community-feed-body">${escapeHtml(message.body).replace(
              /\n/g,
              "<br>"
            )}</p>
          </article>
        `;
      })
      .join("");

    this.communityFeedEl.scrollTop = this.communityFeedEl.scrollHeight;
  }

  renderUserList() {
    if (this.otherUsers.length === 0) {
      this.userListEl.innerHTML = `
        <div class="community-empty">
          Create and sign in to another account on this browser to start messaging.
        </div>
      `;
      return;
    }

      this.userListEl.innerHTML = this.otherUsers
      .map((user) => {
        const unread = this.unreadSummary?.directByUser[user.id] || 0;
        return `
          <button class="community-user-button ${user.id === this.selectedUserId ? "is-active" : ""}" type="button" data-user-id="${user.id}">
            <div class="community-toolbar">
              <strong>${escapeHtml(user.name)}</strong>
              <span class="community-unread-badge ${unread ? "" : "hidden"}">${unread || ""}</span>
            </div>
            <p class="community-user-copy">
              ${escapeHtml(user.email)}<br>
              Score ${user.totalCorrect} | Best streak ${user.bestStreak}
            </p>
          </button>
        `;
      })
      .join("");

    this.userListEl.querySelectorAll("[data-user-id]").forEach((button) => {
      button.addEventListener("click", () => {
        this.selectedUserId = button.dataset.userId;
        this.refreshData();
      });
    });
  }

  renderConversation() {
    const selectedUser = this.otherUsers.find(
      (user) => user.id === this.selectedUserId
    );

    if (!selectedUser) {
      this.threadTitleEl.textContent = "No active conversation";
      this.threadMetaEl.textContent =
        "Choose another registered user to send your first message.";
      this.threadMessagesEl.innerHTML = `
        <div class="community-empty">
          No other user is available for chat yet.
        </div>
      `;
      this.messageInput.value = "";
      this.messageInput.disabled = true;
      this.sendButton.disabled = true;
      this.composerHintEl.textContent =
        "Messages unlock once another account exists on this browser.";
      return;
    }

    const messages = this.app.getConversationMessages(selectedUser.id);
    this.threadTitleEl.textContent = selectedUser.name;
    this.threadMetaEl.textContent = `${selectedUser.email} | Score ${selectedUser.totalCorrect} | Attempts ${selectedUser.totalAttempts} | Best streak ${selectedUser.bestStreak}`;
    this.messageInput.disabled = false;
    this.sendButton.disabled = false;
    this.composerHintEl.textContent = `Chatting with ${selectedUser.name}. Their last login was ${formatTimestamp(
      selectedUser.lastLoginAt
    )}.`;

    if (messages.length === 0) {
      this.threadMessagesEl.innerHTML = `
        <div class="community-empty">
          Start the conversation. Your message history with ${escapeHtml(
            selectedUser.name
          )} will be saved locally.
        </div>
      `;
      return;
    }

    this.threadMessagesEl.innerHTML = messages
      .map((message) => {
        const isMine = message.fromUserId === this.app.currentUser?.id;
        const sender = isMine ? "You" : escapeHtml(selectedUser.name);
        return `
          <article class="community-message ${isMine ? "is-mine" : "is-theirs"}">
            <div class="community-message-bubble">
              <p>${escapeHtml(message.body).replace(/\n/g, "<br>")}</p>
              <div class="community-message-meta">${sender} | ${formatTimestamp(
                message.createdAt
              )}</div>
            </div>
          </article>
        `;
      })
      .join("");

    this.threadMessagesEl.scrollTop = this.threadMessagesEl.scrollHeight;
  }

  handleSendMessage() {
    if (!this.selectedUserId) {
      return;
    }

    try {
      this.app.sendMessageToUser(this.selectedUserId, this.messageInput.value);
      this.messageInput.value = "";
      this.refreshData();
      this.messageInput.focus();
      this.app.toast.show("Message sent.");
    } catch (error) {
      this.app.modal.show({
        title: "Message Error",
        body: `<p class="modal-copy">${escapeHtml(error.message)}</p>`,
      });
    }
  }

  handleCommunitySendMessage() {
    try {
      this.app.postCommunityMessage(this.communityInput.value);
      this.communityInput.value = "";
      this.refreshData();
      this.communityInput.focus();
      this.app.toast.show("Community post sent.");
    } catch (error) {
      this.app.modal.show({
        title: "Community Message Error",
        body: `<p class="modal-copy">${escapeHtml(error.message)}</p>`,
      });
    }
  }

  destroy() {
    window.removeEventListener("storage", this.handleStorage);
  }
}

class AppController {
  constructor() {
    this.handleStorageEvent = this.handleStorageEvent.bind(this);
    this.auth = new AuthManager();
    this.authRoot = document.querySelector("#auth-root");
    this.appShell = document.querySelector("#app-shell");
    this.contentRegion = document.querySelector("#content-region");
    this.navButtons = Array.from(document.querySelectorAll(".nav-button"));
    this.communityChatBadge = document.querySelector("#community-chat-badge");
    this.toast = new ToastManager(document.querySelector("#toast-root"));
    this.modal = new ModalManager(document.querySelector("#modal-root"));
    this.authTabs = Array.from(document.querySelectorAll(".auth-tab"));
    this.loginForm = document.querySelector("#login-form");
    this.registerForm = document.querySelector("#register-form");
    this.authFeedback = document.querySelector("#auth-feedback");
    this.logoutButton = document.querySelector("#logout-button");
    this.userNameLabel = document.querySelector("#sidebar-user-name");
    this.userEmailLabel = document.querySelector("#sidebar-user-email");
    this.sidebarNotificationCopy = document.querySelector(
      "#sidebar-notification-copy"
    );
    this.sidebarScoreboard = document.querySelector("#sidebar-scoreboard");
    this.sessionChip = document.querySelector("#header-session-chip");
    this.headerAlertChip = document.querySelector("#header-alert-chip");
    this.currentPage = null;
    this.currentUser = null;
    this.baseDocumentTitle = document.title;
    this.lastNotificationSummary = {
      total: 0,
      directTotal: 0,
      communityTotal: 0,
      directByUser: {},
    };

    this.pageFactories = {
      Dashboard: () => new DashboardPage(this),
      "Magnet Funnel": () => new MagnetFunnelPage(this),
      PowerMagnet: () => new PowerMagnetPage(this),
      "Binary Visualizer": () => new BinaryVisualizerPage(this),
      "Community Chat": () => new CommunityChatPage(this),
    };

    this.navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.showPage(button.dataset.page);
      });
    });

    this.authTabs.forEach((button) => {
      button.addEventListener("click", () => {
        this.switchAuthMode(button.dataset.authMode);
      });
    });

    this.loginForm.addEventListener("submit", (event) => {
      void this.handleLoginSubmit(event);
    });

    this.registerForm.addEventListener("submit", (event) => {
      void this.handleRegisterSubmit(event);
    });

    this.logoutButton.addEventListener("click", () => {
      this.handleLogout();
    });

    document
      .querySelector("#toggle-theme")
      .addEventListener("click", () => {});

    [this.loginForm, this.registerForm].forEach((form) => {
      const submitButton = form.querySelector(".auth-submit");
      if (submitButton) {
        submitButton.dataset.idleLabel = submitButton.textContent;
      }
    });

    window.addEventListener("storage", this.handleStorageEvent);
  }

  async init() {
    const session = this.auth.getSession();
    if (session) {
      this.finishAuthentication(session);
      return;
    }

    this.showAuthScreen("login");
  }

  handleStorageEvent(event) {
    if (
      ![
        STORAGE_KEYS.directMessages,
        STORAGE_KEYS.communityMessages,
        STORAGE_KEYS.messageReadState,
      ].includes(event.key)
    ) {
      return;
    }

    if (!this.currentUser) {
      return;
    }

    const nextSummary = this.getUnreadNotificationSummary();
    const previousTotal = this.lastNotificationSummary.total || 0;

    if (nextSummary.total > previousTotal) {
      if (event.key === STORAGE_KEYS.directMessages) {
        this.toast.show("New direct message received.");
      } else if (event.key === STORAGE_KEYS.communityMessages) {
        this.toast.show("New community message received.");
      }
    }

    this.refreshGlobalNotifications();
  }

  destroyCurrentPage() {
    if (!this.currentPage) {
      return;
    }

    this.currentPage.destroy();
    this.currentPage = null;
  }

  switchAuthMode(mode) {
    const isLogin = mode !== "register";

    this.authTabs.forEach((button) => {
      const isActive = button.dataset.authMode === (isLogin ? "login" : "register");
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    this.loginForm.classList.toggle("hidden", !isLogin);
    this.registerForm.classList.toggle("hidden", isLogin);
    this.setAuthFeedback("");

    const firstField = isLogin
      ? this.loginForm.querySelector("input")
      : this.registerForm.querySelector("input");
    window.setTimeout(() => firstField?.focus(), 0);
  }

  setAuthFeedback(message, state = "") {
    this.authFeedback.textContent = message || "";
    this.authFeedback.className = "auth-feedback";
    if (state) {
      this.authFeedback.classList.add(`is-${state}`);
    }
  }

  toggleFormBusy(form, isBusy, busyLabel) {
    const controls = Array.from(form.querySelectorAll("input, button"));
    controls.forEach((control) => {
      control.disabled = isBusy;
    });

    const submitButton = form.querySelector(".auth-submit");
    if (!submitButton) {
      return;
    }

    submitButton.textContent = isBusy
      ? busyLabel
      : submitButton.dataset.idleLabel || submitButton.textContent;
  }

  getFirstName(user) {
    if (!user || !user.name) {
      return "friend";
    }

    return user.name.trim().split(/\s+/)[0] || "friend";
  }

  getAllSavedGameScores() {
    return getStoredJson(STORAGE_KEYS.gameScores, {});
  }

  getScoreSummaryForUser(userId) {
    const allScores = this.getAllSavedGameScores();
    const scores = mergeGameScores(allScores[userId]);
    const totalCorrect = Object.values(scores).reduce(
      (sum, stats) => sum + stats.correct,
      0
    );
    const totalAttempts = Object.values(scores).reduce(
      (sum, stats) => sum + stats.attempts,
      0
    );
    const bestStreak = Math.max(
      0,
      ...Object.values(scores).map((stats) => stats.bestStreak)
    );

    return {
      scores,
      totalCorrect,
      totalAttempts,
      bestStreak,
    };
  }

  getCommunityUsers() {
    return this.auth
      .getUsers()
      .map((user) => {
        const scoreSummary = this.getScoreSummaryForUser(user.id);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          ...scoreSummary,
        };
      })
      .sort((left, right) => {
        if (right.totalCorrect !== left.totalCorrect) {
          return right.totalCorrect - left.totalCorrect;
        }
        return left.name.localeCompare(right.name);
      });
  }

  getAllCommunityMessages() {
    return getStoredJson(STORAGE_KEYS.communityMessages, []).sort(
      (left, right) =>
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
    );
  }

  saveAllCommunityMessages(messages) {
    setStoredJson(STORAGE_KEYS.communityMessages, messages);
  }

  postCommunityMessage(body) {
    if (!this.currentUser?.id) {
      throw new Error("Sign in to post to the community room.");
    }

    const trimmedBody = body.trim();
    if (!trimmedBody) {
      throw new Error("Type a community message before sending.");
    }

    const messages = this.getAllCommunityMessages();
    const nextMessage = {
      id: `community-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2, 8)}`,
      fromUserId: this.currentUser.id,
      body: trimmedBody,
      createdAt: new Date().toISOString(),
    };

    messages.push(nextMessage);
    this.saveAllCommunityMessages(messages);
    this.refreshGlobalNotifications();
    return nextMessage;
  }

  getAllReadStates() {
    return getStoredJson(STORAGE_KEYS.messageReadState, {});
  }

  getCurrentUserReadState() {
    if (!this.currentUser?.id) {
      return createDefaultReadState();
    }

    const allStates = this.getAllReadStates();
    return mergeReadState(allStates[this.currentUser.id]);
  }

  saveCurrentUserReadState(readState) {
    if (!this.currentUser?.id) {
      return;
    }

    const allStates = this.getAllReadStates();
    allStates[this.currentUser.id] = mergeReadState(readState);
    setStoredJson(STORAGE_KEYS.messageReadState, allStates);
  }

  getUnreadDirectCounts() {
    if (!this.currentUser?.id) {
      return {};
    }

    const readState = this.getCurrentUserReadState();
    return this.getAllMessages().reduce((counts, message) => {
      if (message.toUserId !== this.currentUser.id) {
        return counts;
      }

      const readAt = readState.directByUser[message.fromUserId];
      if (toTimestampNumber(message.createdAt) > toTimestampNumber(readAt)) {
        counts[message.fromUserId] = (counts[message.fromUserId] || 0) + 1;
      }
      return counts;
    }, {});
  }

  getUnreadCommunityCount() {
    if (!this.currentUser?.id) {
      return 0;
    }

    const readState = this.getCurrentUserReadState();
    return this.getAllCommunityMessages().filter((message) => {
      if (message.fromUserId === this.currentUser.id) {
        return false;
      }

      return (
        toTimestampNumber(message.createdAt) >
        toTimestampNumber(readState.communityReadAt)
      );
    }).length;
  }

  getUnreadNotificationSummary() {
    const directByUser = this.getUnreadDirectCounts();
    const directTotal = Object.values(directByUser).reduce(
      (sum, count) => sum + count,
      0
    );
    const communityTotal = this.getUnreadCommunityCount();

    return {
      directByUser,
      directTotal,
      communityTotal,
      total: directTotal + communityTotal,
    };
  }

  markConversationRead(otherUserId) {
    if (!this.currentUser?.id || !otherUserId) {
      return;
    }

    const unreadCount = this.getUnreadDirectCounts()[otherUserId] || 0;
    if (unreadCount === 0) {
      return;
    }

    const latestIncoming = this.getConversationMessages(otherUserId)
      .filter((message) => message.fromUserId === otherUserId)
      .at(-1);

    if (!latestIncoming) {
      return;
    }

    const readState = this.getCurrentUserReadState();
    readState.directByUser[otherUserId] = latestIncoming.createdAt;
    this.saveCurrentUserReadState(readState);
    this.refreshGlobalNotifications();
  }

  markCommunityMessagesRead() {
    if (!this.currentUser?.id) {
      return;
    }

    const latestIncoming = this.getAllCommunityMessages()
      .filter((message) => message.fromUserId !== this.currentUser.id)
      .at(-1);

    if (!latestIncoming) {
      return;
    }

    const currentReadState = this.getCurrentUserReadState();
    if (
      toTimestampNumber(latestIncoming.createdAt) <=
      toTimestampNumber(currentReadState.communityReadAt)
    ) {
      return;
    }

    currentReadState.communityReadAt = latestIncoming.createdAt;
    this.saveCurrentUserReadState(currentReadState);
    this.refreshGlobalNotifications();
  }

  getAllMessages() {
    return getStoredJson(STORAGE_KEYS.directMessages, []);
  }

  saveAllMessages(messages) {
    setStoredJson(STORAGE_KEYS.directMessages, messages);
  }

  getConversationMessages(otherUserId) {
    if (!this.currentUser?.id || !otherUserId) {
      return [];
    }

    return this.getAllMessages()
      .filter((message) => {
        const sentByCurrent =
          message.fromUserId === this.currentUser.id &&
          message.toUserId === otherUserId;
        const receivedByCurrent =
          message.fromUserId === otherUserId &&
          message.toUserId === this.currentUser.id;
        return sentByCurrent || receivedByCurrent;
      })
      .sort((left, right) => {
        return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
      });
  }

  sendMessageToUser(toUserId, body) {
    if (!this.currentUser?.id) {
      throw new Error("Sign in to send messages.");
    }

    const trimmedBody = body.trim();
    if (!trimmedBody) {
      throw new Error("Type a message before sending.");
    }

    if (toUserId === this.currentUser.id) {
      throw new Error("Choose another user to send a message.");
    }

    const recipient = this.auth
      .getUsers()
      .find((candidate) => candidate.id === toUserId);

    if (!recipient) {
      throw new Error("That user is no longer available.");
    }

    const messages = this.getAllMessages();
    const nextMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      fromUserId: this.currentUser.id,
      toUserId,
      body: trimmedBody,
      createdAt: new Date().toISOString(),
    };

    messages.push(nextMessage);
    this.saveAllMessages(messages);
    return nextMessage;
  }

  getCurrentUserScores() {
    if (!this.currentUser?.id) {
      return createDefaultGameScores();
    }

    const allScores = this.getAllSavedGameScores();
    return mergeGameScores(allScores[this.currentUser.id]);
  }

  saveCurrentUserScores(scores) {
    if (!this.currentUser?.id) {
      return;
    }

    const allScores = this.getAllSavedGameScores();
    allScores[this.currentUser.id] = mergeGameScores(scores);
    setStoredJson(STORAGE_KEYS.gameScores, allScores);
  }

  recordGameResult(gameKey, isCorrect) {
    const scores = this.getCurrentUserScores();
    const currentStats = scores[gameKey];
    if (!currentStats) {
      return createDefaultGameScores()[gameKey];
    }

    const updatedStats = {
      ...currentStats,
      attempts: currentStats.attempts + 1,
      correct: currentStats.correct + (isCorrect ? 1 : 0),
      currentStreak: isCorrect ? currentStats.currentStreak + 1 : 0,
      lastPlayedAt: new Date().toISOString(),
    };
    updatedStats.bestStreak = Math.max(
      currentStats.bestStreak,
      updatedStats.currentStreak
    );

    scores[gameKey] = updatedStats;
    this.saveCurrentUserScores(scores);
    this.renderSidebarScoreboard();
    return updatedStats;
  }

  renderSidebarScoreboard() {
    if (!this.currentUser) {
      this.sidebarScoreboard.innerHTML = "";
      this.sidebarScoreboard.classList.add("hidden");
      return;
    }

    const scores = this.getCurrentUserScores();
    const totalCorrect = Object.values(scores).reduce(
      (sum, stats) => sum + stats.correct,
      0
    );
    const totalAttempts = Object.values(scores).reduce(
      (sum, stats) => sum + stats.attempts,
      0
    );

    this.sidebarScoreboard.innerHTML = `
      <p class="eyebrow">Game Scores</p>
      <h3 class="score-card-title">Saved Progress</h3>
      <div class="score-total">
        <span class="muted">Total correct answers</span>
        <strong>${totalCorrect}</strong>
      </div>
      <p class="score-item-copy">${totalAttempts ? `${totalAttempts} total attempts across saved games.` : "Play a game to start building your score."}</p>
      <div class="score-list">
        ${Object.entries(scores)
          .map(
            ([key, stats]) => `
              <div class="score-item">
                <h4 class="score-item-title">${GAME_SCORE_LABELS[key] || key}</h4>
                <p class="score-item-copy">
                  Score: ${stats.correct}/${stats.attempts}<br>
                  Streak: ${stats.currentStreak} | Best: ${stats.bestStreak}<br>
                  ${formatGameAccuracy(stats)}
                </p>
              </div>
            `
          )
          .join("")}
      </div>
    `;
    this.sidebarScoreboard.classList.remove("hidden");
  }

  refreshGlobalNotifications() {
    if (!this.currentUser) {
      this.communityChatBadge.textContent = "";
      this.communityChatBadge.classList.add("hidden");
      this.sidebarNotificationCopy.textContent = "";
      this.sidebarNotificationCopy.classList.add("hidden");
      this.headerAlertChip.textContent = "";
      this.headerAlertChip.classList.add("hidden");
      document.title = this.baseDocumentTitle;
      this.lastNotificationSummary = {
        total: 0,
        directTotal: 0,
        communityTotal: 0,
        directByUser: {},
      };
      return;
    }

    const summary = this.getUnreadNotificationSummary();
    if (summary.total > 0) {
      this.communityChatBadge.textContent = String(summary.total);
      this.communityChatBadge.classList.remove("hidden");
      this.sidebarNotificationCopy.textContent = `${summary.total} unread chat notification${
        summary.total === 1 ? "" : "s"
      }.`;
      this.sidebarNotificationCopy.classList.remove("hidden");
      this.headerAlertChip.textContent = `${summary.directTotal} direct | ${summary.communityTotal} community unread`;
      this.headerAlertChip.classList.remove("hidden");
      document.title = `(${summary.total}) ${this.baseDocumentTitle}`;
    } else {
      this.communityChatBadge.textContent = "";
      this.communityChatBadge.classList.add("hidden");
      this.sidebarNotificationCopy.textContent = "No unread chat notifications.";
      this.sidebarNotificationCopy.classList.remove("hidden");
      this.headerAlertChip.textContent = "";
      this.headerAlertChip.classList.add("hidden");
      document.title = this.baseDocumentTitle;
    }

    this.lastNotificationSummary = summary;
  }

  updateUserDisplay(user) {
    if (!user) {
      this.userNameLabel.textContent = "Guest User";
      this.userEmailLabel.textContent = "Sign in to access the tools.";
      this.sessionChip.textContent = "";
      this.sessionChip.classList.add("hidden");
      this.renderSidebarScoreboard();
      this.refreshGlobalNotifications();
      return;
    }

    this.userNameLabel.textContent = user.name;
    this.userEmailLabel.textContent = user.email;
    this.sessionChip.textContent = `Signed in as ${this.getFirstName(user)}`;
    this.sessionChip.classList.remove("hidden");
    this.renderSidebarScoreboard();
    this.refreshGlobalNotifications();
  }

  showAuthScreen(mode = "login") {
    this.destroyCurrentPage();
    this.contentRegion.innerHTML = "";
    this.currentUser = null;
    this.authRoot.classList.remove("hidden");
    this.appShell.classList.add("hidden");
    this.logoutButton.classList.add("hidden");
    this.loginForm.reset();
    this.registerForm.reset();
    this.updateUserDisplay(null);
    this.switchAuthMode(mode);
  }

  finishAuthentication(user, options = {}) {
    this.currentUser = user;
    this.authRoot.classList.add("hidden");
    this.appShell.classList.remove("hidden");
    this.logoutButton.classList.remove("hidden");
    this.updateUserDisplay(user);
    this.loginForm.reset();
    this.registerForm.reset();
    this.setAuthFeedback("");
    this.showPage("Dashboard");

    if (options.toastMessage) {
      this.toast.show(options.toastMessage);
    }
  }

  async handleLoginSubmit(event) {
    event.preventDefault();
    this.setAuthFeedback("");
    this.toggleFormBusy(this.loginForm, true, "Signing In...");

    try {
      const user = await this.auth.login({
        email: document.querySelector("#login-email").value,
        password: document.querySelector("#login-password").value,
      });

      this.finishAuthentication(user, {
        toastMessage: `Welcome back, ${this.getFirstName(user)}.`,
      });
    } catch (error) {
      this.setAuthFeedback(error.message, "error");
    } finally {
      this.toggleFormBusy(this.loginForm, false, "Signing In...");
    }
  }

  async handleRegisterSubmit(event) {
    event.preventDefault();
    this.setAuthFeedback("");
    this.toggleFormBusy(this.registerForm, true, "Creating Account...");

    try {
      const user = await this.auth.register({
        name: document.querySelector("#register-name").value,
        email: document.querySelector("#register-email").value,
        password: document.querySelector("#register-password").value,
        confirmPassword: document.querySelector("#register-confirm-password").value,
      });

      this.finishAuthentication(user, {
        toastMessage: `Account created. Welcome, ${this.getFirstName(user)}.`,
      });
    } catch (error) {
      this.setAuthFeedback(error.message, "error");
    } finally {
      this.toggleFormBusy(this.registerForm, false, "Creating Account...");
    }
  }

  handleLogout() {
    if (!this.currentUser) {
      this.showAuthScreen("login");
      return;
    }

    const firstName = this.getFirstName(this.currentUser);
    this.auth.clearSession();
    this.showAuthScreen("login");
    this.toast.show(`Logged out. See you soon, ${firstName}.`);
  }

  showPage(name) {
    if (!this.currentUser) {
      this.showAuthScreen("login");
      return;
    }

    this.destroyCurrentPage();

    this.navButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.page === name);
    });

    this.contentRegion.innerHTML = "";
    const page = this.pageFactories[name]?.();
    if (!page) {
      return;
    }

    this.currentPage = page;
    page.mount(this.contentRegion);
  }
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let offsetY = y;

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    const width = context.measureText(testLine).width;
    if (width > maxWidth && line) {
      context.fillText(line, x, offsetY);
      line = word;
      offsetY += lineHeight;
    } else {
      line = testLine;
    }
  });

  if (line) {
    context.fillText(line, x, offsetY);
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleInPlace(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

document.addEventListener("DOMContentLoaded", () => {
  initResponseFiles();
  const app = new AppController();
  void app.init();
});
