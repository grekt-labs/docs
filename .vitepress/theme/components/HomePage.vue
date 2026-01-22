<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const installMethods = [
  { id: 'curl', label: 'curl', command: 'curl -fsSL grekt.com | sh' },
  { id: 'brew', label: 'brew', command: 'brew install grekt' },
  { id: 'npm', label: 'npm', command: 'npm install -g grekt' },
  { id: 'pnpm', label: 'pnpm', command: 'pnpm add -g grekt' },
  { id: 'bun', label: 'bun', command: 'bun add -g grekt' },
]

const activeInstall = ref('curl')
const installCommand = computed(() =>
  installMethods.find(m => m.id === activeInstall.value)?.command || ''
)
const copied = ref(false)

const copyCommand = async () => {
  try {
    await navigator.clipboard.writeText(installCommand.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const phrases = [
  'synced to any AI assistant.',
  'shared across teams.',
  'versioned and tracked.',
  'without copy-paste hell.',
  'well managed.',
]

const currentPhrase = ref('')
const isDeleting = ref(false)
const phraseIndex = ref(0)
const charIndex = ref(0)

let timeout = null

const type = () => {
  const current = phrases[phraseIndex.value]

  if (!isDeleting.value) {
    currentPhrase.value = current.substring(0, charIndex.value + 1)
    charIndex.value++

    if (charIndex.value === current.length) {
      isDeleting.value = true
      timeout = setTimeout(type, 2000)
      return
    }
  } else {
    currentPhrase.value = current.substring(0, charIndex.value - 1)
    charIndex.value--

    if (charIndex.value === 0) {
      isDeleting.value = false
      phraseIndex.value = (phraseIndex.value + 1) % phrases.length
    }
  }

  timeout = setTimeout(type, isDeleting.value ? 30 : 80)
}

onMounted(() => {
  timeout = setTimeout(type, 500)
})

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<template>
  <div class="home-container">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-content">
        <h1>
          <span class="static-text">Your AI tools finally</span><br>
          <span class="typing-text">{{ currentPhrase }}<span class="cursor">|</span></span>
        </h1>
        <p class="tagline">
          Install, sync, and share AI configurations across Claude, Cursor, and other coding assistants. <strong class="typing-text">Version controlled. Lockfile backed. Zero friction.</strong>
        </p>
        <div class="hero-buttons">
          <div class="install-wrapper">
            <div class="install-tabs">
              <button
                v-for="method in installMethods"
                :key="method.id"
                class="install-tab"
                :class="{ active: activeInstall === method.id }"
                @click="activeInstall = method.id"
              >
                {{ method.label }}
              </button>
            </div>
            <div class="install-box">
              <span class="install-prompt">$</span>
              <code class="install-command">{{ installCommand }}</code>
              <button class="copy-btn" @click="copyCommand" :class="{ copied }">
                <svg v-if="!copied" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M21 7L9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative elements -->
      <div class="deco deco-1"></div>
      <div class="deco deco-2"></div>
      <div class="deco deco-3"></div>
    </section>

    <!-- USE CASES -->
    <section class="use-cases">
      <h2 class="section-title">What can it do?</h2>
      <div class="use-case-grid">
        <div class="use-case-card">
          <div class="use-case-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.9 5.9 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>
          </div>
          <h3>Sync Everywhere</h3>
          <p>Push your agents, skills, and commands to Claude, Cursor, and more with one command.</p>
        </div>
        <div class="use-case-card">
          <div class="use-case-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4 7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59 5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7z"/></svg>
          </div>
          <h3>Share with Teams</h3>
          <p>Publish artifacts to share AI configurations across your organization.</p>
        </div>
        <div class="use-case-card">
          <div class="use-case-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M12 16a3 3 0 0 1-3-3c0-1.12.61-2.1 1.5-2.61l9.71-5.62-5.53 9.58c-.5.98-1.51 1.65-2.68 1.65m0-13c1.81 0 3.5.5 4.97 1.32l-2.1 1.21C14 5.19 13 5 12 5a8 8 0 0 0-8 8c0 2.21.89 4.21 2.34 5.65h.01c.39.39.39 1.02 0 1.41-.39.39-1.03.39-1.42.01A9.969 9.969 0 0 1 2 13 10 10 0 0 1 12 3m10 10c0 2.76-1.12 5.26-2.93 7.07-.39.38-1.02.38-1.41-.01a.996.996 0 0 1 0-1.41A7.95 7.95 0 0 0 20 13c0-1-.19-2-.54-2.9L20.67 8C21.5 9.5 22 11.18 22 13z"/></svg>
          </div>
          <h3>Version Control</h3>
          <p>Track changes with lockfiles. Update, rollback, and manage dependencies like npm.</p>
        </div>
        <div class="use-case-card">
          <div class="use-case-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z"/></svg>
          </div>
          <h3>Install from Registry</h3>
          <p><code>grekt add artifact</code> — discover and install community-created artifacts.</p>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider"></div>

    <!-- FEATURES -->
    <section class="features">
      <h2 class="section-title">How it works</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.9 5.9 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>
          </div>
          <h3>Target Adapters</h3>
          <p>Each AI tool has its own config format. grekt handles the translation automatically.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6m4 18H6V4h7v5h5v11m-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17.5h11l-4.54-5.21z"/></svg>
          </div>
          <h3>Lockfiles</h3>
          <p><code>grekt.lock</code> tracks exact versions for reproducible setups across machines.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4m0 4.9a3 3 0 0 1 3 3c0 1.31-.83 2.42-2 2.83V17h-2v-5.27c-1.17-.41-2-1.52-2-2.83a3 3 0 0 1 3-3z"/></svg>
          </div>
          <h3>Non-destructive Sync</h3>
          <p>Preview changes before applying. Your manual configurations stay safe.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z"/></svg>
          </div>
          <h3>Artifact Types</h3>
          <p>Agents, skills, commands — organize your AI toolbox in <code>.grekt/</code>.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  /* grekt Brand Colors - Scale */
  --grekt-primary-100: #e5f5f2;
  --grekt-primary-200: #c0e8e1;
  --grekt-primary-300: #9bdbd0;
  --grekt-primary-500: #77CABD;
  --grekt-primary-700: #5a9a8f;
  --grekt-primary-900: #3d6a62;

  --grekt-secondary-100: #e0ebfc;
  --grekt-secondary-200: #b3cff8;
  --grekt-secondary-300: #80b0f3;
  --grekt-secondary-500: #3981ED;
  --grekt-secondary-700: #2a61b2;
  --grekt-secondary-900: #1a3d70;

  --grekt-tertiary-100: #fde9d8;
  --grekt-tertiary-200: #facba3;
  --grekt-tertiary-300: #f5ab6a;
  --grekt-tertiary-500: #ED9839;
  --grekt-tertiary-700: #b2722a;
  --grekt-tertiary-900: #70481a;

  --grekt-highlight-100: #d8fcee;
  --grekt-highlight-200: #a3f8d8;
  --grekt-highlight-300: #6af3c0;
  --grekt-highlight-500: #39EDAA;
  --grekt-highlight-700: #2ab280;
  --grekt-highlight-900: #1a7050;

  /* Hero theme - light mode defaults */
  --hero-bg-start: #f8fafc;
  --hero-bg-end: var(--vp-c-bg);
  --hero-text-color: #1a1a2e;
  --hero-tagline-color: rgba(26, 26, 46, 0.7);
  --hero-btn-secondary-bg: rgba(0, 0, 0, 0.05);
  --hero-btn-secondary-border: rgba(0, 0, 0, 0.1);
  --hero-btn-secondary-color: #1a1a2e;
  --hero-deco-opacity: 0.3;

  /* Card theme - light mode defaults */
  --card-bg: #ffffff;
  --card-border: rgba(0, 0, 0, 0.08);
  --card-border-hover: rgba(0, 0, 0, 0.15);
  --card-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  --card-icon-bg: rgba(0, 0, 0, 0.04);
  --card-title: #1a1a2e;
  --card-text: rgba(26, 26, 46, 0.65);
  --card-code-bg: rgba(0, 0, 0, 0.06);

  /* Divider & section backgrounds - light mode */
  --divider-color: rgba(0, 0, 0, 0.08);
  --section-bg: #f5f5f7;
  --section-bg-alt: #ffffff;

  max-width: 100%;
  overflow-x: hidden;
}

/* Dark mode overrides */
.dark .home-container {
  /* Hero - dark mode */
  --hero-bg-start: #1c1c1e;
  --hero-bg-end: #1c1c1e;

  /* Cards - dark mode */
  --card-bg: #2c2c2e;
  --card-border: rgba(255, 255, 255, 0.08);
  --card-border-hover: rgba(255, 255, 255, 0.15);
  --card-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  --card-icon-bg: rgba(255, 255, 255, 0.05);
  --card-title: #ffffff;
  --card-text: rgba(255, 255, 255, 0.6);
  --card-code-bg: rgba(255, 255, 255, 0.1);

  /* Divider & section backgrounds - dark mode */
  --divider-color: rgba(255, 255, 255, 0.1);
  --section-bg: #161618;
  --section-bg-alt: #1c1c1e;
}

/* HERO */
.hero {
  background: linear-gradient(180deg, var(--hero-bg-start) 0%, var(--hero-bg-start) 60%, var(--hero-bg-end) 100%);
  padding: 120px 20px 140px;
  text-align: center;
  position: relative;
  overflow: hidden;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1.5rem;
  min-height: 8.5rem;
}

.static-text {
  color: var(--hero-text-color);
}

.typing-text {
  background: linear-gradient(135deg, var(--grekt-primary-500) 0%, var(--grekt-primary-300) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline;
}

.cursor {
  display: inline-block;
  background: linear-gradient(135deg, var(--grekt-primary-500) 0%, var(--grekt-primary-300) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: blink 1s step-end infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero .tagline {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--hero-tagline-color);
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.hero-buttons a {
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.hero-buttons a.primary {
  background: var(--grekt-primary-500);
  color: #0d1117;
  border: 2px solid var(--grekt-primary-500);
}

.hero-buttons a.primary:hover {
  background: var(--grekt-primary-300);
  border-color: var(--grekt-primary-300);
  transform: translateY(-2px);
}

.hero-buttons a.secondary {
  color: var(--hero-btn-secondary-color);
  background: var(--hero-btn-secondary-bg);
  border: 2px solid var(--hero-btn-secondary-border);
}

.hero-buttons a.secondary:hover {
  background: var(--hero-btn-secondary-bg);
  border-color: var(--grekt-primary-500);
  transform: translateY(-2px);
}

.github-icon {
  width: 20px;
  height: 20px;
}

/* Install wrapper */
.install-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.install-tabs {
  display: flex;
  gap: 0;
  background: #161b22;
  border-radius: 8px 8px 0 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: none;
  padding: 4px 4px 0 4px;
}

.install-tab {
  padding: 8px 16px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  transition: all 0.2s ease;
  font-family: inherit;
}

.install-tab:hover {
  color: rgba(255, 255, 255, 0.8);
}

.install-tab.active {
  background: #0d1117;
  color: var(--grekt-primary-500);
}

/* Install box */
.install-box {
  display: flex;
  align-items: center;
  background: #0d1117;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 8px 8px;
  padding: 12px 16px;
  gap: 12px;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
}

.install-prompt {
  color: var(--grekt-primary-500);
  font-weight: 600;
  user-select: none;
}

.install-command {
  color: #e6edf3;
  font-size: 0.9rem;
  background: none;
  white-space: nowrap;
}

.copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  color: var(--grekt-primary-500);
  background: rgba(255, 255, 255, 0.1);
}

.copy-btn.copied {
  color: var(--grekt-highlight-500);
}

/* Decorative elements */
.deco {
  position: absolute;
  border-radius: 8px;
  opacity: var(--hero-deco-opacity);
}

.deco-1 {
  width: 60px;
  height: 60px;
  background: var(--grekt-primary-500);
  top: 15%;
  left: 10%;
  transform: rotate(15deg);
}

.deco-2 {
  width: 40px;
  height: 40px;
  background: var(--grekt-primary-300);
  top: 25%;
  right: 15%;
  transform: rotate(-10deg);
}

.deco-3 {
  width: 80px;
  height: 80px;
  border: 3px solid var(--grekt-primary-500);
  background: transparent;
  bottom: 15%;
  left: 8%;
  transform: rotate(25deg);
}

/* Section Divider */
.section-divider {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  height: 1px;
  background: var(--divider-color);
}

/* USE CASES */
.use-cases {
  background: var(--section-bg-alt);
  padding: 80px 20px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.use-cases > * {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 3rem;
}

.use-case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.use-case-card {
  padding: 32px;
  border-radius: 16px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  transition: all 0.3s ease;
  text-align: left;
}

.use-case-card:hover {
  border-color: var(--card-border-hover);
  transform: translateY(-4px);
  box-shadow: var(--card-shadow);
}

.use-case-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: var(--card-icon-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: var(--grekt-primary-500);
}

.use-case-icon svg {
  width: 28px;
  height: 28px;
}

.use-case-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 12px;
  margin-top: 0;
  color: var(--card-title);
}

.use-case-card p {
  font-size: 0.9rem;
  color: var(--card-text);
  line-height: 1.6;
  margin: 0;
}

/* FEATURES */
.features {
  background: var(--section-bg);
  padding: 80px 20px 100px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.features > * {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.feature-card {
  padding: 32px;
  border-radius: 16px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: var(--card-border-hover);
  transform: translateY(-4px);
  box-shadow: var(--card-shadow);
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: var(--card-icon-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: var(--grekt-primary-500);
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--card-title);
}

.feature-card p {
  font-size: 0.9rem;
  color: var(--card-text);
  line-height: 1.6;
  margin: 0;
}

.feature-card code {
  background: var(--card-code-bg);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  color: var(--grekt-primary-500);
}

/* Responsive */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }

  .hero .tagline {
    font-size: 1.1rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .install-wrapper {
    width: 100%;
  }

  .install-tabs {
    flex-wrap: wrap;
    justify-content: center;
  }

  .install-tab {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .install-box {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }

  .install-command {
    font-size: 0.8rem;
  }

  .deco {
    display: none;
  }
}
</style>
