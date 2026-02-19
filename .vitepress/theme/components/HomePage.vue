<script setup>
import { ref, nextTick, onMounted, onUnmounted, computed } from 'vue'
import TerminalChrome from './cli-demos/TerminalChrome.vue'
import { defineAsyncComponent } from 'vue'

const CliDemoChoose = defineAsyncComponent(() => import('./cli-demos/CliDemoChoose.vue'))
const CliDemoSync = defineAsyncComponent(() => import('./cli-demos/CliDemoSync.vue'))
const CliDemoUpdate = defineAsyncComponent(() => import('./cli-demos/CliDemoUpdate.vue'))
const CliDemoCheck = defineAsyncComponent(() => import('./cli-demos/CliDemoCheck.vue'))
const CliDemoScan = defineAsyncComponent(() => import('./cli-demos/CliDemoScan.vue'))
const CliDemoInit = defineAsyncComponent(() => import('./cli-demos/CliDemoInit.vue'))

const installMethods = [
  { id: 'curl', label: 'curl', command: 'curl -fsSL https://cli.grekt.com/install.sh | sh' },
  { id: 'brew', label: 'brew', command: 'brew tap grekt-labs/grekt && brew install grekt' },
]

const chooseRef = ref(null)
const chooseDemoEl = ref(null)
const syncRef = ref(null)
const syncDemoEl = ref(null)
const updateRef = ref(null)
const updateDemoEl = ref(null)
const checkRef = ref(null)
const checkDemoEl = ref(null)
const scanRef = ref(null)
const scanDemoEl = ref(null)
const initRef = ref(null)

const scrollToDemo = (el) => {
  if (window.innerWidth <= 768 && el) {
    nextTick(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }
}
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
  'All agents, always in sync.',
  'Reproducible across teams.',
  'Versioned like code.',
  'Drift-proof.',
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

const onScroll = () => {
  const scrollThreshold = document.documentElement.scrollHeight * 0.05
  document.documentElement.classList.toggle('has-scrolled', window.scrollY > scrollThreshold)
}

onMounted(() => {
  timeout = setTimeout(type, 500)
  window.addEventListener('scroll', onScroll, { passive: true })

  // FAQ structured data for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(faqSchema)
  document.head.appendChild(script)
})

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
  window.removeEventListener('scroll', onScroll)
  document.documentElement.classList.remove('has-scrolled')
})

// FAQ
const faqItems = [
  {
    question: 'What is grekt?',
    answer: 'grekt is the open artifact manager for AI tools. It helps you install, sync, share, and check for security or drifts. It works with agents, skills, hooks, and other AI configurations across any tool available like Claude Code, Cursor, OpenCode, and more.'
  },
  {
    question: 'How does grekt work?',
    answer: 'Add artifacts with a single command, grekt handles downloading and organizing them in your project. Optionally sync to specific tools or use lazy mode to load artifacts on demand from the .grekt folder, keeping your context lean. A lockfile tracks versions and integrity so installs are deterministic.'
  },
  {
    question: 'Is grekt free?',
    answer: 'Yes! The CLI is source available and free to use. The public registry is free for public artifacts, and self-hosted registries are on your own, so free too.'
  },
  {
    question: 'Which AI tools are supported?',
    answer: 'Claude Code, Cursor, OpenCode, and any tool that reads markdown files. You can also define custom targets for any AI tool you use.'
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
      <!-- Convergent Lines Background -->
      <div class="lines-container">
        <svg class="convergent-lines" viewBox="0 0 2000 480" preserveAspectRatio="xMidYMid slice">
          <!-- Lines converging to grekt icon -->
          <path class="line line-1" d="M-500,-60 Q-200,110 1000,440" />
          <path class="line line-2" d="M-150,50 Q180,190 1000,440" />
          <path class="line line-3" d="M-80,140 Q250,270 1000,440" />
          <path class="line line-4" d="M-30,250 Q350,340 1000,440" />
          <path class="line line-5" d="M50,360 Q450,400 1000,440" />
          <path class="line line-6" d="M2500,-60 Q2200,110 1000,440" />
          <path class="line line-7" d="M2150,50 Q1820,190 1000,440" />
          <path class="line line-8" d="M2080,140 Q1750,270 1000,440" />
          <path class="line line-9" d="M2030,250 Q1650,340 1000,440" />
          <path class="line line-10" d="M1950,360 Q1550,400 1000,440" />
          <!-- Extra lines from top - wider curves -->
          <path class="line line-11" d="M300,-110 Q150,190 1000,440" />
          <path class="line line-12" d="M1700,-110 Q1850,190 1000,440" />
          <!-- Lines pointing down to edges -->
          <path class="line line-13" d="M1000,440 Q600,450 -200,510" />
          <path class="line line-14" d="M1000,440 Q1400,450 2200,510" />
        </svg>

        <!-- AI Tool Icons floating on lines -->
        <div class="floating-icons">
          <div class="floating-icon icon-claude" title="Claude">
            <img src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/claude.png" alt="Claude" width="28" height="28" />
          </div>
          <div class="floating-icon icon-cursor" title="Cursor">
            <img src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/cursor.png" alt="Cursor" width="28" height="28" />
          </div>
          <div class="floating-icon icon-cline" title="Cline">
            <img src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/cline.png" alt="Cline" width="28" height="28" />
          </div>
          <div class="floating-icon icon-openai" title="OpenAI">
            <img src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/openai.png" alt="OpenAI" width="28" height="28" />
          </div>
          <div class="floating-icon icon-copilot" title="GitHub Copilot">
            <img src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/githubcopilot.png" alt="GitHub Copilot" width="28" height="28" />
          </div>
          <!-- Central grekt icon -->
          <div class="floating-icon icon-grekt" title="grekt">
            <img src="/logos/grekt-isologo.svg" alt="grekt" width="40" height="40" />
          </div>
        </div>
      </div>

      <div class="hero-content">
        <h1>
          <span class="static-text">The open artifact manager for AI tools.</span><br>
          <span class="typing-text">{{ currentPhrase }}<span class="cursor">|</span></span>
        </h1>
        <p class="tagline">
          Install, sync, and share AI configurations with version control, drift detection, and more.
        </p>
        <div class="hero-buttons">
          <div class="install-wrapper">
            <select class="install-select" v-model="activeInstall">
              <option v-for="method in installMethods" :key="method.id" :value="method.id">
                {{ method.label }}
              </option>
            </select>
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
          <div class="hero-cta-row">
            <a href="/en-US/docs/guide/getting-started" class="primary">Get started</a>
            <a href="https://explore.grekt.com" class="secondary discover-btn">Explore artifacts</a>
          </div>
        </div>
      </div>

    </section>

    <!-- TRUSTED BY -->
    <section class="trusted-by">
      <span class="trusted-by-label">Trusted by</span>
      <div class="trusted-by-logos">
        <a href="https://sesamehr.com" target="_blank" rel="noopener" class="trusted-by-logo" title="Sesame">
          <img src="/logos/Sesame.png" alt="Sesame" />
        </a>
        <a href="https://metrivibe.com" target="_blank" rel="noopener" class="trusted-by-logo trusted-by-logo--metrivibe" title="Metrivibe">
          <img src="/logos/metrivibe-logov2.png" alt="Metrivibe" />
        </a>
        <!-- <a href="https://thehotelsnetwork.com" target="_blank" rel="noopener" class="trusted-by-logo" title="The Hotels Network">
          <img src="/logos/thn.png" alt="The Hotels Network" />
        </a> -->
      </div>
    </section>

    <!-- USE CASES -->
    <section class="use-cases">
      <h2 class="section-title">What could you do?</h2>
      <div class="use-case-grid">
        <div class="use-case-card">
          <div class="use-case-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.9 5.9 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>
          </div>
          <h3>Sync to any AI</h3>
          <p>Push your agents, skills, etc... to Claude, OpenCode, Cursor and more with one command.</p>
          <a href="/en-US/docs/guide/targets" class="card-link">See targets →</a>
        </div>
        <div class="use-case-card">
          <div class="use-case-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4 7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59 5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7z"/></svg>
          </div>
          <h3>Share within projects</h3>
          <p>Publish artifacts to share AI configurations across teams or your own projects.</p>
          <a href="/en-US/api/publish" class="card-link">Learn to publish →</a>
        </div>
        <div class="use-case-card">
          <div class="use-case-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M12 16a3 3 0 0 1-3-3c0-1.12.61-2.1 1.5-2.61l9.71-5.62-5.53 9.58c-.5.98-1.51 1.65-2.68 1.65m0-13c1.81 0 3.5.5 4.97 1.32l-2.1 1.21C14 5.19 13 5 12 5a8 8 0 0 0-8 8c0 2.21.89 4.21 2.34 5.65h.01c.39.39.39 1.02 0 1.41-.39.39-1.03.39-1.42.01A9.969 9.969 0 0 1 2 13 10 10 0 0 1 12 3m10 10c0 2.76-1.12 5.26-2.93 7.07-.39.38-1.02.38-1.41-.01a.996.996 0 0 1 0-1.41A7.95 7.95 0 0 0 20 13c0-1-.19-2-.54-2.9L20.67 8C21.5 9.5 22 11.18 22 13z"/></svg>
          </div>
          <h3>Version control</h3>
          <p>Track changes with lockfiles. Update, rollback, and manage dependencies easily.</p>
          <a href="/en-US/docs/guide/getting-started" class="card-link">Get started →</a>
        </div>
        <div class="use-case-card">
          <div class="use-case-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          </div>
          <h3>Install from anywhere</h3>
          <p>GitHub, GitLab, or public registry. <strong>Self hosted</strong> instances supported.</p>
          <a href="/en-US/docs/guide/sources/overview" class="card-link">See sources →</a>
        </div>
        <div class="use-case-card use-case-card--coming-soon">
          <a href="https://explore.grekt.com" target="_blank" rel="noopener" class="badge-coming-soon">Public Registry</a>
          <div class="use-case-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z"/></svg>
          </div>
          <h3>Discover & Share</h3>
          <p>Explore community created artifacts or publish your own for others to use.</p>
        </div>
      </div>
    </section>

    <!-- SELF-HOSTED / TEAMS -->
    <section class="self-hosted">
      <h2 class="section-title">Built for teams. Runs on your infra. <span class="self-hosted-free">Free.</span></h2>
      <p class="self-hosted-subtitle">Use the public registry for open artifacts, or run your own private instance for internal configurations.</p>
      <div class="self-hosted-grid">
        <div class="self-hosted-card">
          <div class="self-hosted-card-icon">
            <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          </div>
          <h3>Public registry</h3>
          <p>Discover and share open artifacts with the community. Free forever for public configurations.</p>
          <a href="https://explore.grekt.com" class="self-hosted-link">Explore artifacts →</a>
        </div>
        <div class="self-hosted-card self-hosted-card--highlight">
          <div class="self-hosted-card-icon">
            <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
          </div>
          <h3>Self-hosted registry</h3>
          <p>Run your own private instance. Same CLI, same workflow. Your artifacts, your infrastructure, zero external dependencies.</p>
          <a href="/en-US/docs/guide/sources/overview" class="self-hosted-link">Learn more →</a>
        </div>
        <div class="self-hosted-card self-hosted-card--offline">
          <div class="self-hosted-card-icon self-hosted-card-icon--offline">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>
          </div>
          <h3>Offline mode</h3>
          <p>No registry needed. Add artifacts from local paths or GitHub/GitLab repos. Great for solo setups. No versioning, no lockfile determinism.</p>
          <a href="/en-US/docs/guide/offline-mode" class="self-hosted-link">Learn more →</a>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider"></div>

    <!-- INTERACTIVE INIT DEMO -->
    <section class="feature-section feature-section--init-demo" :class="initRef?.activeTab === 'with' ? 'init-demo--synced' : 'init-demo--warn'">
      <h2 class="init-demo-title">Stop copying prompts. <span class="init-demo-highlight">Start managing</span> AI context.</h2>
      <div class="init-demo-wrapper">
        <CliDemoInit ref="initRef" />
      </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider"></div>

    <!-- FEATURE: PICK & SKIP -->
    <section class="feature-section">
      <div class="feature-row">
        <div class="feature-text">
          <h2 class="feature-title">Pick only what you need</h2>
          <p class="feature-description">Every artifact could ship with skills, agents, hooks, and more. <strong>You choose what stays and what gets skipped.</strong> No bloat, no surprises.</p>
          <div class="feature-run-wrapper" :class="{ 'feature-run-wrapper--hidden': chooseRef?.finished }">
            <label class="feature-run-label">Try it</label>
            <button
              class="feature-run-btn"
              :disabled="chooseRef?.animating"
              @click="chooseRef?.runCommand(); scrollToDemo(chooseDemoEl)"
            >
              <span class="dots-border"></span>
              <span class="feature-run-cmd">See how your selection is reflected</span>
              <span class="feature-run-play"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.629a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/></svg></span>
            </button>
          </div>
        </div>
        <div ref="chooseDemoEl" class="feature-demo">
          <TerminalChrome>
            <CliDemoChoose ref="chooseRef" />
          </TerminalChrome>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider"></div>

    <!-- FEATURE: CORE MODE -->
    <section class="feature-section feature-section--alt">
      <div class="feature-row feature-row--reversed">
        <div class="feature-text">
          <h2 class="feature-title">Lock it into context</h2>
          <p class="feature-description">grekt keeps your context clean by default. When you need it, artifacts go straight into each AI tool's context folder, <strong>committed to your repo and shared with your entire team</strong>.</p>
          <div class="feature-run-wrapper" :class="{ 'feature-run-wrapper--hidden': syncRef?.finished }">
            <label class="feature-run-label">Try it</label>
            <button
              class="feature-run-btn"
              :disabled="syncRef?.animating"
              @click="syncRef?.runCommand(); scrollToDemo(syncDemoEl)"
            >
              <span class="dots-border"></span>
              <span class="feature-run-cmd">Add artifacts directly to your AI contexts</span>
              <span class="feature-run-play"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.629a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/></svg></span>
            </button>
          </div>
        </div>
        <div ref="syncDemoEl" class="feature-demo">
          <TerminalChrome>
            <CliDemoSync ref="syncRef" />
          </TerminalChrome>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider"></div>

    <!-- FEATURE: UPDATE -->
    <section class="feature-section">
      <div class="feature-row">
        <div class="feature-text">
          <h2 class="feature-title">Upgrade without surprises</h2>
          <p class="feature-description">One command to upgrade artifacts to the latest version. Your previous selections are preserved, and if the artifact structure changes, grekt will ask you again.</p>
          <div class="feature-run-wrapper" :class="{ 'feature-run-wrapper--hidden': updateRef?.finished }">
            <label class="feature-run-label">Try it</label>
            <button
              class="feature-run-btn"
              :disabled="updateRef?.animating"
              @click="updateRef?.runCommand(); scrollToDemo(updateDemoEl)"
            >
              <span class="dots-border"></span>
              <span class="feature-run-cmd">Upgrade an artifact to the latest version</span>
              <span class="feature-run-play"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.629a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/></svg></span>
            </button>
          </div>
        </div>
        <div ref="updateDemoEl" class="feature-demo">
          <TerminalChrome>
            <CliDemoUpdate ref="updateRef" />
          </TerminalChrome>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider"></div>

    <!-- FEATURE: DETECT DIFFS -->
    <section class="feature-section feature-section--alt">
      <div class="feature-row feature-row--reversed">
        <div class="feature-text">
          <h2 class="feature-title">Detect drift instantly</h2>
          <p class="feature-description">Someone edited a managed file? grekt knows. Run <strong>grekt check</strong> to detect local modifications and decide whether to restore or keep them.</p>
          <div class="feature-run-wrapper" :class="{ 'feature-run-wrapper--hidden': checkRef?.finished }">
            <label class="feature-run-label">Try it</label>
            <button
              class="feature-run-btn"
              :disabled="checkRef?.edited"
              @click="checkRef?.editFile(); scrollToDemo(checkDemoEl)"
            >
              <span class="dots-border"></span>
              <span class="feature-run-cmd">Edit a managed file</span>
              <span class="feature-run-play"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.629a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/></svg></span>
            </button>
          </div>
        </div>
        <div ref="checkDemoEl" class="feature-demo">
          <TerminalChrome>
            <CliDemoCheck ref="checkRef" />
          </TerminalChrome>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider"></div>

    <!-- FEATURE: SECURITY SCAN -->
    <section class="feature-section">
      <div class="feature-row">
        <div class="feature-text">
          <h2 class="feature-title">Scan artifacts before you install</h2>
          <p class="feature-description">Run <strong>grekt scan</strong> anytime to check your installed artifacts for prompt injection, data exfiltration, and other threats. Artifacts published to the <a href="https://explore.grekt.com" target="_blank" rel="noopener">grekt registry</a> are always scanned automatically.</p>
          <div class="feature-run-wrapper" :class="{ 'feature-run-wrapper--hidden': scanRef?.finished }">
            <label class="feature-run-label">Try it</label>
            <button
              class="feature-run-btn"
              :disabled="scanRef?.animating"
              @click="scanRef?.runCommand(); scrollToDemo(scanDemoEl)"
            >
              <span class="dots-border"></span>
              <span class="feature-run-cmd">Start a security scan</span>
              <span class="feature-run-play"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.629a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/></svg></span>
            </button>
          </div>
        </div>
        <div ref="scanDemoEl" class="feature-demo">
          <TerminalChrome>
            <CliDemoScan ref="scanRef" />
          </TerminalChrome>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider"></div>

    <!-- COMPARISON -->
    <section class="comparison">
      <h2 class="section-title">What's different about grekt?</h2>
      <div class="comparison-wrapper">
        <div class="comparison-header">
          <div class="comparison-col-label"></div>
          <div class="comparison-col-grekt">grekt</div>
          <div class="comparison-col-other">skills.sh</div>
        </div>

        <div class="comparison-group">
          <div class="comparison-group-title">Approach</div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">What it is</span>
              <span class="label-desc">Core purpose and focus</span>
            </div>
            <div class="comparison-value comparison-value--grekt">Full artifact manager</div>
            <div class="comparison-value comparison-value--other">Markdown file copier</div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Core structure</span>
              <span class="label-desc">How artifacts are defined</span>
            </div>
            <div class="comparison-value comparison-value--grekt">Versioned artifact + schema</div>
            <div class="comparison-value comparison-value--other">Markdown file</div>
          </div>
        </div>

        <div class="comparison-group">
          <div class="comparison-group-title">Context management</div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Context bloat</span>
              <span class="label-desc">Keep tool directories clean</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span>Minimized</div>
            <div class="comparison-value comparison-value--other"><span class="check-no"></span></div>
          </div>
        </div>

        <div class="comparison-group">
          <div class="comparison-group-title">Reliability</div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Versioning</span>
              <span class="label-desc">Reproducible installs across team</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span>Lockfile + SHA</div>
            <div class="comparison-value comparison-value--other"><span class="check-partial"></span>Manual updates</div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Security scanning</span>
              <span class="label-desc">Automated checks before install</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span></div>
            <div class="comparison-value comparison-value--other"><span class="check-yes"></span></div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Drift detection</span>
              <span class="label-desc">Someone edited a managed file?</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span></div>
            <div class="comparison-value comparison-value--other"><span class="check-no"></span></div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Consistency</span>
              <span class="label-desc">Same config, every project, every machine</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span>Per-project lockfile</div>
            <div class="comparison-value comparison-value--other"><span class="check-no"></span>Global, remember to sync</div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Self-hosted</span>
              <span class="label-desc">Run your own private registry</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span></div>
            <div class="comparison-value comparison-value--other"><span class="check-no"></span></div>
          </div>
        </div>

      </div>
      <p class="comparison-note">
        Already using skills.sh?<br>
        You can wrap those skills as grekt artifacts to add versioning, policies, and guarantees.
      </p>
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
            <p class="footer-tagline">The open artifact manager for AI tools.</p>
          </div>

          <!-- Resources -->
          <div class="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="/en-US/docs/guide/introduction">Introduction</a></li>
              <li><a href="/en-US/docs/guide/getting-started">Quick start</a></li>
              <li><a href="/en-US/api/">CLI Reference</a></li>
              <li><a href="/en-US/docs/guide/sources/authentication">Authentication</a></li>
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
              <li><a href="/en-US/docs/guide/licensing">Licensing</a></li>
              <li><a href="/en-US/docs/guide/privacy">Privacy Policy</a></li>
              <li><a href="/en-US/docs/guide/terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="copyright">Released under the <a href="/en-US/docs/guide/licensing">BSL 1.1 License</a></p>
          <p class="copyright">Copyright © {{ new Date().getFullYear() }} grekt-labs</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>

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
  --logo-filter: brightness(0);

  /* Text accent - light mode uses darker shade */
  --grekt-text-accent: var(--grekt-primary-700);

  max-width: 100%;
  overflow-x: hidden;
}

/* Dark mode overrides - near black theme */
.dark .home-container {
  /* Hero - dark mode */
  --hero-bg-start: #0a0a0a;
  --hero-bg-end: #0a0a0a;

  /* Cards - dark mode */
  --card-bg: #141414;
  --card-border: rgba(255, 255, 255, 0.06);
  --card-border-hover: rgba(255, 255, 255, 0.12);
  --card-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  --card-icon-bg: rgba(255, 255, 255, 0.04);
  --card-title: #ffffff;
  --card-text: rgba(255, 255, 255, 0.6);
  --card-code-bg: rgba(255, 255, 255, 0.08);

  /* Divider & section backgrounds - dark mode */
  --divider-color: rgba(255, 255, 255, 0.08);
  --section-bg: #0f0f0f;
  --section-bg-alt: #0a0a0a;
  --footer-bg: #050505;
  --logo-filter: brightness(0) invert(1);

  /* Text accent - dark mode uses lighter shade */
  --grekt-text-accent: var(--grekt-primary-500);
}

/* HERO */
.hero {
  background: linear-gradient(180deg, var(--hero-bg-start) 0%, var(--hero-bg-start) 60%, var(--hero-bg-end) 100%);
  padding: 100px 20px 120px;
  text-align: center;
  position: relative;
  overflow: hidden;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

/* Convergent Lines */
.lines-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.convergent-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.line {
  fill: none;
  stroke: var(--grekt-primary-500);
  stroke-width: 1.5;
  opacity: 0.25;
  stroke-linecap: round;
}

.line-1, .line-6 { animation: line-pulse 4s ease-in-out infinite; }
.line-2, .line-7 { animation: line-pulse 4s ease-in-out infinite 0.3s; }
.line-3, .line-8 { animation: line-pulse 4s ease-in-out infinite 0.6s; }
.line-4, .line-9 { animation: line-pulse 4s ease-in-out infinite 0.9s; }
.line-5, .line-10 { animation: line-pulse 4s ease-in-out infinite 1.2s; }
.line-11, .line-12 { animation: line-pulse 4s ease-in-out infinite 1.5s; }
.line-13, .line-14 { animation: line-pulse 4s ease-in-out infinite 1.8s; }

@keyframes line-pulse {
  0%, 100% { opacity: 0.15; stroke-width: 1; }
  50% { opacity: 0.35; stroke-width: 2; }
}

/* Floating Icons */
.floating-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-icon {
  position: absolute;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.floating-icon:hover {
  transform: scale(1.1) translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.floating-icon svg {
  color: white;
}

/* Icon positions - random floating over lines */
.icon-claude {
  top: 48%;
  left: 3%;
  background: linear-gradient(135deg, #D97757 0%, #E8927A 100%);
  animation: float-1 6s ease-in-out infinite;
}

.icon-cursor {
  top: 72%;
  left: 8%;
  background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
  animation: float-2 5s ease-in-out infinite 0.5s;
}

.icon-cline {
  top: 60%;
  left: 18%;
  background: linear-gradient(135deg, #323B43 0%, #4A5568 100%);
  animation: float-3 7s ease-in-out infinite 1s;
}

.icon-openai {
  top: 52%;
  right: 4%;
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  animation: float-2 6s ease-in-out infinite 0.3s;
}

.icon-copilot {
  top: 68%;
  right: 14%;
  background: linear-gradient(135deg, #6366F1 0%, #818CF8 100%);
  animation: float-1 5.5s ease-in-out infinite 0.8s;
}

.icon-grekt {
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, var(--grekt-primary-700) 0%, var(--grekt-primary-500) 100%);
  border-radius: 20px;
  animation: float-center 4s ease-in-out infinite;
  z-index: 10;
  padding: 12px;
}

.icon-grekt img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.icon-grekt:hover {
  transform: translateX(-50%) scale(1.1);
}

@keyframes float-1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(3deg); }
}

@keyframes float-2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-3deg); }
}

@keyframes float-3 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}

@keyframes float-center {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-8px); }
}

/* Trusted By */
.trusted-by {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 20px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.trusted-by-label {
  font-size: 0.65rem;
  color: var(--card-text);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 500;
  opacity: 0.35;
}

.trusted-by-logos {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px 36px;
  max-width: 1200px;
}

.trusted-by-logo {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.trusted-by-logo img {
  height: 48px;
  width: auto;
  filter: grayscale(100%) var(--logo-filter);
  opacity: 0.35;
  transition: all 0.3s ease;
}

.trusted-by-logo--metrivibe img {
  height: 40px;
}

.trusted-by-logo:hover img {
  filter: grayscale(0%) var(--logo-filter);
  opacity: 0.8;
}

.hero-content {
  max-width: 960px;
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
  background: linear-gradient(135deg, var(--grekt-primary-700) 0%, var(--grekt-primary-500) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline;
}

.cursor {
  display: inline-block;
  background: linear-gradient(135deg, var(--grekt-primary-700) 0%, var(--grekt-primary-500) 100%);
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
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.hero-cta-row {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.hero-buttons a {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
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
  border-color: var(--grekt-text-accent);
  transform: translateY(-2px);
}

.github-icon {
  width: 20px;
  height: 20px;
}

/* Install wrapper */
.install-wrapper {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0;
}

/* Install select dropdown */
.install-select {
  appearance: none;
  -webkit-appearance: none;
  background: #f0f0f3 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24'%3E%3Cpath fill='%231a1a2e' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 12px center;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-right: none;
  border-radius: 8px 0 0 8px;
  padding: 10px 38px 10px 14px;
  color: #1a1a2e;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.install-select:hover {
  background-color: #e8e8ec;
}

.install-select:focus {
  outline: none;
  border-color: var(--grekt-text-accent);
}

.install-select option {
  background: #f0f0f3;
  color: #1a1a2e;
  padding: 8px;
}

.dark .install-select {
  background: #161b22 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 12px center;
  border-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.dark .install-select:hover {
  background-color: #1c2128;
}

.dark .install-select option {
  background: #161b22;
  color: #e6edf3;
}

/* Install box */
.install-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0 8px 8px 0;
  padding: 10px 14px;
  gap: 10px;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  flex: 1;
}

.dark .install-box {
  background: #0d1117;
  border-color: rgba(255, 255, 255, 0.1);
}

.install-box--full {
  border-radius: 8px;
}

.install-prompt {
  color: var(--grekt-text-accent);
  font-weight: 600;
  user-select: none;
}

.install-command {
  color: #1a1a2e;
  font-size: 0.9rem;
  background: none;
  white-space: nowrap;
}

.dark .install-command {
  color: #e6edf3;
}

.copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  color: var(--grekt-text-accent);
  background: rgba(0, 0, 0, 0.06);
}

.dark .copy-btn {
  color: rgba(255, 255, 255, 0.5);
}

.dark .copy-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.copy-btn.copied {
  color: var(--grekt-highlight-500);
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
  padding: 0 20px 80px;
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

.section-subtitle {
  text-align: center;
  color: rgba(255, 255, 255, 0.45);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: -1.5rem auto 2.5rem;
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
  display: flex;
  flex-direction: column;
}

.use-case-card:hover {
  border-color: var(--card-border-hover);
  transform: translateY(-4px);
  box-shadow: var(--card-shadow);
}

.use-case-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--grekt-primary-500) 0%, var(--grekt-primary-300) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.use-case-icon svg {
  width: 24px;
  height: 24px;
  color: #0d1117;
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
  flex-grow: 1;
}

.use-case-card--coming-soon {
  position: relative;
  grid-column: 1 / -1;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  padding: 24px 32px;
}

.use-case-card--coming-soon .use-case-icon {
  margin-bottom: 0;
}

.use-case-card--coming-soon h3 {
  margin-bottom: 1px;
}

.use-case-card--coming-soon p {
  flex-grow: 0;
}

.card-link {
  display: inline-block;
  margin-top: auto;
  padding-top: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--grekt-text-accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

.card-link:hover {
  color: var(--grekt-primary-300);
}

.badge-coming-soon {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  background: var(--grekt-tertiary-500);
  color: #0d1117;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 10px;
  border-radius: 20px;
  text-decoration: none;
  cursor: pointer;
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
  color: var(--grekt-text-accent);
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
  color: var(--grekt-text-accent);
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
  color: var(--grekt-text-accent);
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

/* FEATURE SECTIONS */
.feature-section {
  background: var(--section-bg);
  padding: 80px 20px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.feature-section--alt {
  background: var(--section-bg-alt);
}

.feature-row {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.4fr 0.6fr;
  gap: 60px;
  align-items: center;
}

.feature-row--reversed {
  grid-template-columns: 0.6fr 0.4fr;
}

.feature-row--reversed .feature-text {
  order: 2;
}

.feature-row--reversed .feature-demo {
  order: 1;
}

.feature-title {
  font-family: 'Cal Sans', system-ui, sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--heading-color);
  margin: 0 0 16px 0;
  line-height: 1.3;
  border-top: none !important;
  padding-top: 0 !important;
}

.feature-title::after {
  content: '';
  display: block;
  width: 12%;
  height: 2px;
  background: var(--grekt-highlight-500);
}

.feature-description {
  font-size: 1rem;
  color: var(--card-text);
  line-height: 1.7;
  margin: 0;
}

.feature-description strong {
  color: var(--grekt-primary);
  font-weight: 600;
}

.feature-demo {
  width: 100%;
}

.feature-run-wrapper {
  margin-top: 24px;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.feature-run-wrapper--hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.feature-run-group {
  display: flex;
  gap: 10px;
}

.feature-run-label {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 600;
  margin-bottom: 8px;
}

.feature-run-btn {
  --border-radius: 6px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  padding: 10px 14px;
  background: rgba(15, 16, 22, 0.8);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: box-shadow 0.2s ease;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.8rem;
  overflow: hidden;
}

.feature-run-btn:hover:not(:disabled) {
  box-shadow: 0 0 16px rgba(119, 202, 189, 0.4);
}

.feature-run-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.feature-run-btn .dots-border {
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: var(--border-radius);
  background: rgba(119, 202, 189, 0.15);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: 0;
  overflow: hidden;
}

.feature-run-btn .dots-border::before {
  content: "";
  position: absolute;
  inset: -100%;
  background: conic-gradient(from 0deg, transparent 0%, transparent 75%, rgba(119, 202, 189, 0.8) 80%, rgba(119, 202, 189, 0.3) 90%, transparent 100%);
  animation: rotate-border 2s linear infinite;
}

.feature-run-btn:disabled .dots-border::before {
  animation: none;
}

.feature-run-sign {
  color: #77CABD;
  margin-right: 8px;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.feature-run-cmd {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.feature-run-play {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--grekt-tertiary-500);
  color: #0f1016;
  position: relative;
  z-index: 1;
  transition: transform 0.2s ease;
}

.feature-run-btn:hover:not(:disabled) .feature-run-play {
  transform: scale(1.1);
}

@keyframes rotate-border {
  to { transform: rotate(360deg); }
}

html:not(.dark) .feature-run-btn {
  background: #f0f0f0;
}

html:not(.dark) .feature-run-btn:hover:not(:disabled) {
  box-shadow: 0 0 16px rgba(50, 130, 115, 0.25);
}

html:not(.dark) .feature-run-btn .dots-border {
  background: rgba(50, 130, 115, 0.2);
}

html:not(.dark) .feature-run-btn .dots-border::before {
  background: conic-gradient(from 0deg, transparent 0%, transparent 75%, rgba(50, 130, 115, 0.8) 80%, rgba(50, 130, 115, 0.3) 90%, transparent 100%);
}

html:not(.dark) .feature-run-sign {
  color: #2a7568;
}

html:not(.dark) .feature-run-cmd {
  color: rgba(0, 0, 0, 0.7);
}

html:not(.dark) .feature-run-play {
  color: #fff;
}

@media (max-width: 900px) {
  .feature-row,
  .feature-row--reversed {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .feature-row--reversed .feature-text,
  .feature-row--reversed .feature-demo {
    order: unset;
  }

  .feature-title {
    font-size: 1.4rem;
  }

  .feature-description {
    font-size: 0.9rem;
  }

  .feature-demo {
    max-width: 90vw;
  }

  .feature-run-group {
    flex-direction: column;
  }

  .feature-section {
    padding: 40px 20px;
  }

  .feature-run-wrapper--hidden {
    opacity: 0.3;
    visibility: visible;
    pointer-events: none;
  }
}

/* COMPARISON */
.comparison {
  background: var(--section-bg-alt);
  padding: 80px 20px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.comparison .section-title {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.comparison-wrapper {
  max-width: 800px;
  margin: 0 auto;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.dark .comparison-wrapper {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.comparison-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 0 0 20px 0;
  border-bottom: 2px solid var(--divider-color);
  margin-bottom: 8px;
}

.comparison-col-label {
  font-weight: 600;
  color: var(--card-text);
}

.comparison-col-grekt {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--grekt-text-accent);
  text-align: center;
}

.comparison-col-other {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--card-text);
  text-align: center;
  opacity: 0.6;
}

.comparison-group {
  margin-bottom: 0;
}

.comparison-group:last-child .comparison-row:last-child {
  border-bottom: none;
}

.comparison-group-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--grekt-text-accent);
  padding: 24px 0 12px 0;
}

.comparison-group:first-child .comparison-group-title {
  padding-top: 8px;
}

.comparison-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 14px 16px;
  margin: 0 -16px;
  border-bottom: 1px solid var(--divider-color);
  align-items: center;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.comparison-row:hover {
  background: var(--card-icon-bg);
}

.comparison-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.label-title {
  font-weight: 500;
  color: var(--card-title);
  font-size: 0.9rem;
}

.label-desc {
  font-size: 0.8rem;
  color: var(--card-text);
  opacity: 0.6;
}

.comparison-value {
  text-align: center;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.comparison-value--grekt {
  color: var(--card-title);
}

.comparison-value--other {
  color: var(--card-text);
  opacity: 0.6;
}

.check-yes {
  width: 18px;
  height: 18px;
  background: var(--grekt-primary-500);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.check-yes::after {
  content: "✓";
  color: #0d1117;
  font-size: 11px;
  font-weight: 700;
}

.check-partial {
  width: 18px;
  height: 18px;
  background: var(--grekt-tertiary-500);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.check-partial::after {
  content: "~";
  color: #0d1117;
  font-size: 12px;
  font-weight: 700;
}

.check-no {
  width: 18px;
  height: 18px;
  background: var(--card-icon-bg);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.check-no::after {
  content: "✗";
  color: var(--card-text);
  font-size: 10px;
  opacity: 0.4;
}

.comparison-note {
  max-width: 800px;
  margin: 24px auto 0;
  text-align: center;
  font-size: 0.9rem;
  color: var(--card-text);
  opacity: 0.8;
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
  color: var(--grekt-text-accent);
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
@media (max-width: 1024px) {
  .floating-icon {
    width: 44px;
    height: 44px;
  }

  .floating-icon svg {
    width: 22px;
    height: 22px;
  }

  .icon-grekt {
    width: 56px;
    height: 56px;
  }

  .icon-claude { left: 2%; top: 50%; }
  .icon-cursor { left: 6%; top: 74%; }
  .icon-cline { left: 14%; top: 62%; }
  .icon-openai { right: 2%; top: 54%; }
  .icon-copilot { right: 10%; top: 70%; }
}

@media (max-width: 768px) {
  .hero {
    padding: 80px 20px 80px;
  }

  .hero h1 {
    font-size: 2.5rem;
    min-height: 185px;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .hero .tagline {
    font-size: 1.1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .hero-cta-row {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .hero-cta-row a {
    width: calc(100% - 32px);
    max-width: 400px;
    justify-content: center;
  }

  .install-wrapper {
    width: calc(100% - 32px);
    max-width: 400px;
    flex-direction: column;
  }

  .install-select {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 8px 8px 0 0;
    border-bottom: none;
    background-position: right 12px center;
  }

  .dark .install-select {
    border-right-color: rgba(255, 255, 255, 0.1);
  }

  .install-box {
    width: 100%;
    max-width: 100%;
    border-radius: 0 0 8px 8px;
  }

  .install-command {
    font-size: 0.8rem;
    overflow-x: auto;
    flex: 1;
    min-width: 0;
  }

  /* Hide complex visual elements on mobile */
  .lines-container,
  .floating-icons {
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

  .comparison-header,
  .comparison-row {
    grid-template-columns: 1.2fr 1fr 1fr;
    gap: 8px;
  }

  .label-title {
    font-size: 0.8rem;
  }

  .label-desc {
    display: none;
  }

  .comparison-value {
    font-size: 0.75rem;
  }

  .comparison-col-grekt,
  .comparison-col-other {
    font-size: 0.9rem;
  }

  .check-yes,
  .check-partial,
  .check-no {
    width: 16px;
    height: 16px;
  }

  .check-yes::after,
  .check-no::after {
    font-size: 9px;
  }

  .check-partial::after {
    font-size: 10px;
  }

  .comparison-wrapper {
    padding: 20px;
    border-radius: 12px;
  }

  .comparison-row {
    padding: 12px 12px;
    margin: 0 -12px;
  }

  .use-case-card--coming-soon {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    padding: 32px;
    order: -1;
  }

  .use-case-card--coming-soon .use-case-icon {
    margin-bottom: 20px;
  }

  .use-case-card--coming-soon h3 {
    margin-bottom: 12px;
  }

  .badge-coming-soon {
    position: absolute;
    top: 16px;
    right: 16px;
    transform: none;
  }
}

/* INIT DEMO */
.feature-section--init {
  padding-top: 80px;
  padding-bottom: 0;
}

.feature-section--init-demo {
  padding-top: 60px;
  padding-bottom: 60px;
  transition: background-color 0.5s ease;
}

.init-demo--warn {
  background-color: rgba(232, 168, 56, 0.04);
}

.init-demo--synced {
  background-color: rgba(119, 202, 189, 0.04);
}

html:not(.dark) .init-demo--warn {
  background-color: rgba(200, 140, 30, 0.06);
}

html:not(.dark) .init-demo--synced {
  background-color: rgba(50, 130, 115, 0.06);
}

.init-demo-header {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.init-demo-title {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--grekt-text-accent);
  border-top: none !important;
  padding-top: 0 !important;
  margin-bottom: 1rem;
}

.init-demo-subtitle {
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--card-text);
  max-width: 520px;
  margin: 0 auto;
  opacity: 0.8;
}

.init-demo-title {
  font-family: 'Cal Sans', system-ui, sans-serif;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--heading-color);
  margin-top: 0;
  margin-bottom: 32px;
  line-height: 1.3;
}

.init-demo-highlight {
  color: var(--grekt-primary-500);
}

@media (max-width: 768px) {
  .init-demo-title {
    font-size: 1.3rem;
    margin-bottom: 24px;
  }
}

.init-demo-wrapper {
  max-width: 1300px;
  margin: 0 auto;
}

/* SELF-HOSTED / TEAMS */
.self-hosted {
  background: var(--section-bg-alt);
  padding: 80px 20px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.self-hosted > * {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.self-hosted-free {
  color: var(--grekt-primary-500);
}

.self-hosted-subtitle {
  text-align: center;
  font-size: 1rem;
  color: var(--card-text);
  line-height: 1.6;
  margin: -1.5rem auto 3rem;
  max-width: 560px;
}

.self-hosted-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.self-hosted-card {
  padding: 32px;
  border-radius: 16px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.self-hosted-card:hover {
  border-color: var(--card-border-hover);
  transform: translateY(-4px);
  box-shadow: var(--card-shadow);
}

.self-hosted-card--highlight {
  border-color: var(--grekt-primary-500);
  position: relative;
}

.self-hosted-card--highlight::before {
  content: 'For teams';
  position: absolute;
  top: -10px;
  right: 20px;
  background: var(--grekt-primary-500);
  color: #0d1117;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 3px 10px;
  border-radius: 20px;
}

.self-hosted-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--grekt-primary-500) 0%, var(--grekt-primary-300) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.self-hosted-card-icon svg {
  color: #0d1117;
}

.self-hosted-card h3 {
  font-family: 'Cal Sans', system-ui, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--card-title);
}

.self-hosted-card p {
  font-size: 0.9rem;
  color: var(--card-text);
  line-height: 1.6;
  margin: 0;
  flex-grow: 1;
}

.self-hosted-link {
  display: inline-block;
  margin-top: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--grekt-text-accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

.self-hosted-link:hover {
  color: var(--grekt-primary-300);
}

.self-hosted-card-icon--offline {
  background: linear-gradient(135deg, var(--grekt-tertiary-500) 0%, var(--grekt-tertiary-300) 100%);
}

@media (max-width: 900px) {
  .self-hosted-grid {
    grid-template-columns: 1fr 1fr;
  }

  .self-hosted-card--offline {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .self-hosted-grid {
    grid-template-columns: 1fr;
  }

  .self-hosted-card--offline {
    grid-column: auto;
  }
}
</style>
