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

// FAQ
const faqItems = [
  {
    question: 'What is grekt?',
    answer: 'grekt is an AI artifact manager that helps you install, sync, and share AI configurations (agents, skills, commands) across tools like Claude Code, Cursor, and Windsurf.'
  },
  {
    question: 'How does grekt work?',
    answer: 'grekt downloads artifacts to your project, then syncs them to your AI tools by writing the appropriate configuration files. Each tool has its own format, and grekt handles the translation automatically.'
  },
  {
    question: 'Is grekt free?',
    answer: 'Yes, grekt is open source and free to use under the MIT license. The CLI and all core features are completely free.'
  },
  {
    question: 'Which AI tools are supported?',
    answer: 'Currently grekt supports Claude Code, Cursor, and Windsurf. More targets are being added based on community feedback.'
  },
  {
    question: 'Can I create my own artifacts?',
    answer: 'Yes! You can create artifacts for your own use or publish them to share with others. Check the documentation for the artifact format specification.'
  }
]

const openFaqIndex = ref(null)

const toggleFaq = (index) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}
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

        <!-- Used by -->
        <div class="used-by">
          <span class="used-by-label">Used by</span>
          <div class="used-by-logos">
            <a href="https://sesamehr.com" target="_blank" rel="noopener" class="used-by-logo" title="Sesame">
              <img src="/logos/Sesame.png" alt="Sesame" height="48" />
            </a>
            <a href="https://thehotelsnetwork.com" target="_blank" rel="noopener" class="used-by-logo" title="The Hotels Network">
              <img src="/logos/thn.png" alt="The Hotels Network" height="48" />
            </a>
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
      <h2 class="section-title">What could you do?</h2>
      <div class="use-case-grid">
        <div class="use-case-card">
          <div class="use-case-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.9 5.9 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>
          </div>
          <h3>Sync Everywhere</h3>
          <p>Push your agents, skills, and commands to Claude, Cursor, and more with one command.</p>
          <a href="/en-US/docs/guide/targets" class="card-link">See targets →</a>
        </div>
        <div class="use-case-card">
          <div class="use-case-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4 7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59 5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7z"/></svg>
          </div>
          <h3>Share with Teams</h3>
          <p>Publish artifacts to share AI configurations across your organization.</p>
          <a href="/en-US/api/publish" class="card-link">Learn to publish →</a>
        </div>
        <div class="use-case-card">
          <div class="use-case-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M12 16a3 3 0 0 1-3-3c0-1.12.61-2.1 1.5-2.61l9.71-5.62-5.53 9.58c-.5.98-1.51 1.65-2.68 1.65m0-13c1.81 0 3.5.5 4.97 1.32l-2.1 1.21C14 5.19 13 5 12 5a8 8 0 0 0-8 8c0 2.21.89 4.21 2.34 5.65h.01c.39.39.39 1.02 0 1.41-.39.39-1.03.39-1.42.01A9.969 9.969 0 0 1 2 13 10 10 0 0 1 12 3m10 10c0 2.76-1.12 5.26-2.93 7.07-.39.38-1.02.38-1.41-.01a.996.996 0 0 1 0-1.41A7.95 7.95 0 0 0 20 13c0-1-.19-2-.54-2.9L20.67 8C21.5 9.5 22 11.18 22 13z"/></svg>
          </div>
          <h3>Version Control</h3>
          <p>Track changes with lockfiles. Update, rollback, and manage dependencies easily.</p>
          <a href="/en-US/docs/guide/getting-started" class="card-link">Get started →</a>
        </div>
        <div class="use-case-card use-case-card--coming-soon">
          <span class="badge-coming-soon">Coming Soon</span>
          <div class="use-case-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z"/></svg>
          </div>
          <h3>Discover & Share</h3>
          <p>Explore community-created artifacts or publish your own for others to use.</p>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider"></div>

    <!-- FEATURES -->
    <section class="features">
      <div class="feature-list">
        <!-- Feature Row 1 -->
        <div class="feature-row">
          <div class="feature-left">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M14 10H2v2h12v-2m0-4H2v2h12V6M2 16h8v-2H2v2m19.5-4.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z"/></svg>
            </div>
            <h3>Pick What You Need</h3>
          </div>
          <ul class="feature-right">
            <li>Install only the components you want</li>
            <li>Keep your AI context lean and focused</li>
            <li>No unnecessary bloat in your project</li>
          </ul>
        </div>

        <!-- Feature Row 2 -->
        <div class="feature-row">
          <div class="feature-left">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            </div>
            <h3>Install from Anywhere</h3>
          </div>
          <ul class="feature-right">
            <li>Public registry, GitHub, or GitLab</li>
            <li>Self-hosted instances supported</li>
            <li>Pin specific versions or branches</li>
          </ul>
        </div>

        <!-- Feature Row 3 -->
        <div class="feature-row">
          <div class="feature-left">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4m0 4.9a3 3 0 0 1 3 3c0 1.31-.83 2.42-2 2.83V17h-2v-5.27c-1.17-.41-2-1.52-2-2.83a3 3 0 0 1 3-3z"/></svg>
            </div>
            <h3>Built-in Integrity</h3>
          </div>
          <ul class="feature-right">
            <li>Know instantly when files change</li>
            <li>Drift detection catches modifications</li>
            <li>Reproducible installs across your team</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider"></div>

    <!-- FAQ -->
    <section class="faq">
      <h2 class="section-title">Frequently Asked Questions</h2>
      <div class="faq-list">
        <div
          v-for="(item, index) in faqItems"
          :key="index"
          class="faq-item"
          :class="{ 'faq-item--open': openFaqIndex === index }"
        >
          <button class="faq-question" @click="toggleFaq(index)">
            <span>{{ item.question }}</span>
            <svg class="faq-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
          <div class="faq-answer">
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-grid">
          <!-- Brand column -->
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="logo-text">grekt</span>
            </div>
            <p class="footer-tagline">AI artifact manager for the modern developer.</p>
          </div>

          <!-- Resources -->
          <div class="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="/en-US/docs/guide/introduction">Introduction</a></li>
              <li><a href="/en-US/docs/guide/getting-started">Quick Start</a></li>
              <li><a href="/en-US/api/">CLI Reference</a></li>
              <li><a href="/en-US/docs/guide/authentication">Authentication</a></li>
            </ul>
          </div>

          <!-- Community -->
          <div class="footer-column">
            <h4>Community</h4>
            <ul>
              <li><a href="https://github.com/grekt-labs" target="_blank">GitHub</a></li>
              <li><a href="https://github.com/grekt-labs/grekt/discussions" target="_blank">Discussions</a></li>
              <li><a href="https://github.com/grekt-labs/grekt/issues" target="_blank">Issues</a></li>
            </ul>
          </div>

          <!-- Legal -->
          <div class="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="https://github.com/grekt-labs/grekt/blob/main/LICENSE" target="_blank">License (MIT)</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="copyright">Released under the MIT License.</p>
          <p class="copyright">Copyright © {{ new Date().getFullYear() }} grekt contributors.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cal+Sans&display=swap');

.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

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
  --footer-bg: #f5f5f7;
  --logo-filter: none;

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
  --footer-bg: #0d0d0e;
  --logo-filter: brightness(0) invert(1);
}

/* HERO */
.hero {
  background: linear-gradient(180deg, var(--hero-bg-start) 0%, var(--hero-bg-start) 60%, var(--hero-bg-end) 100%);
  padding: 120px 20px 0;
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
  font-family: 'Cal Sans', system-ui, sans-serif;
  font-size: 3.5rem;
  font-weight: 600;
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

/* Used by section */
.used-by {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.used-by-label {
  font-size: 0.85rem;
  color: var(--hero-tagline-color);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.used-by-logos {
  display: flex;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
}

.used-by-logo {
  opacity: 0.6;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
}

.used-by-logo:hover {
  opacity: 1;
}

.used-by-logo img {
  height: auto;
  max-height: 48px;
  filter: var(--logo-filter);
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
  font-family: 'Cal Sans', system-ui, sans-serif;
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 3rem;
  border-top: none !important;
  padding-top: 0 !important;
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
  font-family: 'Cal Sans', system-ui, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
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

.use-case-card--coming-soon {
  position: relative;
}

.card-link {
  display: inline-block;
  margin-top: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--grekt-primary-500);
  text-decoration: none;
  transition: color 0.2s ease;
}

.card-link:hover {
  color: var(--grekt-primary-300);
}

.badge-coming-soon {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--grekt-tertiary-500);
  color: #0d1117;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 10px;
  border-radius: 20px;
}

/* FEATURES */
.features {
  background: var(--section-bg);
  padding: 60px 20px 80px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.feature-list {
  max-width: 900px;
  margin: 0 auto;
}

.feature-row {
  display: flex;
  align-items: flex-start;
  padding: 40px 0;
  border-top: 1px solid var(--divider-color);
  gap: 60px;
}

.feature-row:first-child {
  border-top: none;
}

.feature-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 280px;
  flex-shrink: 0;
}

.feature-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--card-text);
  flex-shrink: 0;
}

.feature-left h3 {
  font-family: 'Cal Sans', system-ui, sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--card-title);
}

.feature-right {
  list-style: disc;
  padding-left: 20px;
  margin: 0;
  flex: 1;
}

.feature-right li {
  font-size: 0.95rem;
  color: var(--card-text);
  line-height: 1.7;
  margin-bottom: 8px;
}

.feature-right li:last-child {
  margin-bottom: 0;
}

.feature-right code {
  background: var(--card-code-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85rem;
  color: var(--grekt-primary-500);
}

/* FOOTER */
.site-footer {
  background: var(--footer-bg);
  border-top: 1px solid var(--divider-color);
  padding: 60px 20px 40px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}

.footer-brand {
  max-width: 280px;
}

.footer-logo {
  margin-bottom: 16px;
}

.logo-text {
  font-family: 'Cal Sans', system-ui, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--grekt-primary-500);
}

.footer-tagline {
  font-size: 0.9rem;
  color: var(--card-text);
  line-height: 1.6;
  margin: 0;
}

.footer-column h4 {
  font-family: 'Cal Sans', system-ui, sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--card-title);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 10px;
}

.footer-column a {
  font-size: 0.9rem;
  color: var(--card-text);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-column a:hover {
  color: var(--grekt-primary-500);
}

.footer-bottom {
  padding-top: 32px;
  border-top: 1px solid var(--divider-color);
  text-align: center;
}

.copyright {
  font-size: 0.85rem;
  color: var(--card-text);
  margin: 0;
  line-height: 1.8;
}

/* FAQ */
.faq {
  background: var(--section-bg-alt);
  padding: 80px 20px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.faq > * {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.faq-item {
  border-bottom: 1px solid var(--divider-color);
}

.faq-item:first-child {
  border-top: 1px solid var(--divider-color);
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--card-title);
  transition: color 0.2s ease;
}

.faq-question:hover {
  color: var(--grekt-primary-500);
}

.faq-icon {
  flex-shrink: 0;
  color: var(--card-text);
  transition: transform 0.3s ease;
}

.faq-item--open .faq-icon {
  transform: rotate(45deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.faq-item--open .faq-answer {
  max-height: 200px;
}

.faq-answer p {
  margin: 0;
  padding: 0 0 24px 0;
  font-size: 0.95rem;
  color: var(--card-text);
  line-height: 1.7;
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

  .feature-row {
    flex-direction: column;
    gap: 24px;
    padding: 32px 0;
  }

  .feature-left {
    min-width: auto;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-brand {
    max-width: 100%;
    text-align: center;
  }

  .footer-column {
    text-align: center;
  }

  .footer-column h4 {
    margin-bottom: 12px;
  }
}
</style>
