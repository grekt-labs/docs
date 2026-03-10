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
  { id: 'npm', label: 'npm', command: 'npm i -g @grekt/cli' },
  { id: 'curl', label: 'curl', command: 'curl -fsSL https://cli.grekt.com/install.sh | sh' },
  { id: 'brew', label: 'brew', command: 'brew tap grekt-labs/grekt && brew install grekt' },
  { id: 'pnpm', label: 'pnpm', command: 'pnpm add -g @grekt/cli' },
  { id: 'yarn', label: 'yarn', command: 'yarn global add @grekt/cli' },
  { id: 'bun', label: 'bun', command: 'bun add -g @grekt/cli' },
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
const activeInstall = ref('npm')
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

const onScroll = () => {
  const scrollThreshold = document.documentElement.scrollHeight * 0.05
  document.documentElement.classList.toggle('has-scrolled', window.scrollY > scrollThreshold)
}

const previousTheme = ref(null)

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })

  previousTheme.value = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  document.documentElement.classList.add('dark')

  const themeToggle = document.querySelector('.VPSwitchAppearance')
  if (themeToggle) themeToggle.style.display = 'none'
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.documentElement.classList.remove('has-scrolled')

  if (previousTheme.value === 'light') {
    document.documentElement.classList.remove('dark')
  }

  const themeToggle = document.querySelector('.VPSwitchAppearance')
  if (themeToggle) themeToggle.style.display = ''
})

// FAQ
const faqItems = [
  {
    question: 'What is grekt?',
    answer: 'grekt is an open source MCP and AI tool manager. It audits, versions, and secures MCPs, agents, skills, hooks, and commands across Claude Code, Cursor, OpenCode, and more. Everything runs locally on your machine with no cloud dependency.'
  },
  {
    question: 'How does grekt work?',
    answer: 'Install AI artifacts with a single CLI command. grekt downloads, organizes, and locks them with SHA-verified lockfiles for deterministic, reproducible installs. Sync versioned artifacts to specific AI tools or use lazy mode to load them on demand.'
  },
  {
    question: 'Is grekt free?',
    answer: 'The CLI is source available and free. The public registry is free for open artifacts. Self-hosted registries run on your own infrastructure at no cost.'
  },
  {
    question: 'Which AI tools are supported?',
    answer: 'Claude Code, Cursor, OpenCode, and any tool that reads markdown files. Custom targets let you integrate any AI coding assistant into the grekt workflow.'
  },
  {
    question: 'Can I create my own artifacts?',
    answer: 'Artifacts follow a versioned schema with support for agents, skills, hooks, and commands. Create them locally or publish to a registry for team-wide use.'
  },
  {
    question: 'How do I manage MCP servers across projects?',
    answer: 'grekt tracks every MCP server in your projects with version pinning and SHA integrity checks. Run grekt check to detect drift, grekt scan to audit for prompt injection, and grekt sync to distribute configurations across your AI tools.'
  },
  {
    question: 'How do I version AI prompts and rules?',
    answer: 'grekt uses lockfile-based version management for all AI artifacts including prompts, rules, skills, and agent configurations. Pin specific versions, update with rollback support, and share exact configurations across your team.'
  },
  {
    question: 'Can I scan MCPs for security issues?',
    answer: 'Run grekt scan to check any artifact for prompt injection, data exfiltration, and other security risks. Artifacts published to the grekt registry are scanned automatically before listing.'
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
        <span class="hero-overline">Open source MCP & AI artifact manager</span>
        <span class="brand-claim">Know your <span class="brand-highlight">AI stack</span>.</span>
        <h1 class="hero-h1">
          Audit, manage, and version your MCPs, agents, skills, and AI tools across Claude Code, Cursor, and more.
        </h1>
        <div class="hero-buttons">
          <div class="hero-actions-row">
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
            <a href="/en-US/docs/guide/getting-started" class="primary">Get started</a>
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
        <a href="https://tecalliance.net" target="_blank" rel="noopener" class="trusted-by-logo trusted-by-logo--tecalliance" title="TecAlliance">
          <img src="/logos/TecAlliance-Logo-Web.svg" alt="TecAlliance" />
        </a>
        <a href="https://hiades.es" target="_blank" rel="noopener" class="trusted-by-logo" title="Hiades">
          <img src="/logos/logo-hiades-apple.png" alt="Hiades" />
        </a>
        <!-- <a href="https://thehotelsnetwork.com" target="_blank" rel="noopener" class="trusted-by-logo" title="The Hotels Network">
          <img src="/logos/thn.svg" alt="The Hotels Network" />
        </a> -->
      </div>
    </section>

    <!-- PROBLEM STATEMENT -->
    <section class="problem-statement">
      <h2 class="problem-headline">You are running AI tools you have <span class="problem-highlight">never checked</span>.</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">84%</div>
          <div class="stat-label">of developers use AI tools</div>
          <div class="stat-desc">MCPs, agents, skills, hooks are everywhere in modern development workflows.</div>
          <a href="https://survey.stackoverflow.co/2025/ai/" target="_blank" rel="noopener" class="stat-source">Stack Overflow 2025</a>
        </div>
        <div class="stat-card stat-card--warn">
          <div class="stat-number">29%</div>
          <div class="stat-label">trust what they're running</div>
          <div class="stat-desc">Down from 40% last year. The gap between adoption and trust is growing.</div>
          <a href="https://survey.stackoverflow.co/2025/ai/" target="_blank" rel="noopener" class="stat-source">Stack Overflow 2025</a>
        </div>
        <div class="stat-card stat-card--fail">
          <div class="stat-number">20%</div>
          <div class="stat-label">of skills in registries are malicious</div>
          <div class="stat-desc">800+ malicious skills found in ClawHub in a single month.</div>
          <a href="https://thehackernews.com/2026/02/researchers-find-341-malicious-clawhub.html" target="_blank" rel="noopener" class="stat-source">The Hacker News 2026</a>
        </div>
      </div>
    </section>

    <!-- THREE PILLARS -->
    <section class="pillars">
      <div class="pillars-grid-bg"></div>
      <h2 class="pillars-heading">Know <span class="brand-highlight">what's running</span>. Know <span class="brand-highlight">it's safe</span>. Know your stack.</h2>
      <div class="pillars-grid">
        <div class="pillar-card">
          <span class="pillar-number">01</span>
          <h3 class="pillar-title">See your stack</h3>
          <p class="pillar-desc">Full inventory of every AI tool in your projects. MCPs, agents, skills, hooks, commands -- everything visible from the CLI.</p>
        </div>
        <div class="pillar-card">
          <span class="pillar-number">02</span>
          <h3 class="pillar-title">Check your stack</h3>
          <p class="pillar-desc">Every artifact audited for version locks, integrity, and drift. PASS, FAIL, or WARN -- no ambiguity.</p>
        </div>
        <div class="pillar-card">
          <span class="pillar-number">03</span>
          <h3 class="pillar-title">Own your stack</h3>
          <p class="pillar-desc">Lock versions. Pin hashes. Your tools, your machine, your rules. Local-first, no cloud dependency.</p>
        </div>
      </div>
    </section>

    <!-- EVAL GRADES -->
    <section class="eval-section">
      <div class="eval-content">
        <div class="eval-text">
          <span class="eval-label">grekt eval</span>
          <h2 class="eval-headline">Not all tools deserve an <span class="eval-grade-highlight">A</span>.</h2>
          <p class="eval-sub">Evaluate your AI artifacts before they reach production. Skills, agents, and commands get a grade based on structure, safety, and behavior.</p>
          <a href="/en-US/docs/guide/eval" class="eval-link">Learn about evals →</a>
        </div>
        <div class="eval-cards-area">
          <div class="eval-card eval-card--1">
            <span class="eval-card-name">auth-agent</span>
            <span class="eval-card-grade eval-card-grade--a">A</span>
          </div>
          <div class="eval-card eval-card--2">
            <span class="eval-card-name">code-review</span>
            <span class="eval-card-grade eval-card-grade--b">B+</span>
          </div>
          <div class="eval-card eval-card--3">
            <span class="eval-card-name">mcp-github</span>
            <span class="eval-card-grade eval-card-grade--d">D</span>
          </div>
          <div class="eval-card eval-card--4">
            <span class="eval-card-name">deploy-cmd</span>
            <span class="eval-card-grade eval-card-grade--f">F</span>
          </div>
          <div class="eval-card eval-card--5">
            <span class="eval-card-name">refactor-skill</span>
            <span class="eval-card-grade eval-card-grade--a">A-</span>
          </div>
          <div class="eval-card eval-card--6">
            <span class="eval-card-name">db-migrate</span>
            <span class="eval-card-grade eval-card-grade--c">C</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SELF-HOSTED / TEAMS -->
    <section class="self-hosted">
      <h2 class="pillars-heading">Your artifacts. Your infrastructure. <span class="brand-highlight">Free</span>.</h2>
      <div class="pillars-grid">
        <div class="pillar-card">
          <span class="pillar-number">Public</span>
          <h3 class="pillar-title">Public registry</h3>
          <p class="pillar-desc">Discover and install open artifacts. Free forever.</p>
          <a href="https://explore.grekt.com" class="self-hosted-link">Explore artifacts →</a>
        </div>
        <div class="pillar-card pillar-card--featured">
          <span class="dots-border"></span>
          <span class="pillar-number">Private <span class="pillar-badge">For teams</span></span>
          <h3 class="pillar-title">Self-hosted registry</h3>
          <p class="pillar-desc">Same CLI, same workflow. Your artifacts stay on your infrastructure. Zero external dependencies.</p>
          <a href="/en-US/docs/guide/sources/overview" class="self-hosted-link">Learn more →</a>
        </div>
        <div class="pillar-card">
          <span class="pillar-number">Offline</span>
          <h3 class="pillar-title">Offline mode</h3>
          <p class="pillar-desc">No registry needed. Add artifacts from local paths or Git repos. No versioning, no lockfile determinism.</p>
          <a href="/en-US/docs/guide/offline-mode" class="self-hosted-link">Learn more →</a>
        </div>
      </div>
    </section>

    <!-- INTERACTIVE INIT DEMO -->
    <section class="feature-section feature-section--init-demo" :class="initRef?.activeTab === 'with' ? 'init-demo--synced' : 'init-demo--warn'">
      <h2 class="init-demo-title">Unmanaged context drifts. Versioned context <span class="init-demo-highlight">stays aligned</span>.</h2>
      <p class="init-demo-subtitle">Install and verify once. <strong class="init-demo-emphasis">The whole team</strong> gets the exact same version-locked artifacts.</p>
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
          <h2 class="feature-title">Pick the agents, skills, and hooks you need. Skip the rest.</h2>
          <p class="feature-description">Artifacts ship with skills, agents, hooks, commands. <strong>You decide what stays.</strong></p>
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
          <h2 class="feature-title">Sync AI configurations to Claude Code, Cursor, and OpenCode</h2>
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
          <h2 class="feature-title">Version-locked updates with rollback</h2>
          <p class="feature-description">One command. Previous selections preserved. Structure changes get flagged. No drift.</p>
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
          <h2 class="feature-title">Configuration drift detection. Built in.</h2>
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
          <h2 class="feature-title">Security scanning for prompt injection and data exfiltration</h2>
          <p class="feature-description">Run <strong>grekt scan</strong> to audit artifacts for prompt injection and data exfiltration. <a href="https://explore.grekt.com" target="_blank" rel="noopener">Registry</a> artifacts are scanned automatically.</p>
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
      <h2 class="section-title">Registries <span class="brand-highlight">list</span> tools. grekt <span class="brand-highlight">audits</span> them.</h2>
      <div class="comparison-wrapper">
        <div class="comparison-header">
          <span class="comparison-col-label">Capability</span>
          <span class="comparison-col-grekt">grekt</span>
          <span class="comparison-col-other">Alternatives</span>
        </div>

        <div class="comparison-group">
          <div class="comparison-group-title">Security & Trust</div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Deterministic installs</span>
              <span class="label-desc">Same versions, same hashes, same result on every machine</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span></div>
            <div class="comparison-value comparison-value--other"><span class="check-partial"></span> Partial</div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">SHA-verified lockfiles</span>
              <span class="label-desc">Tamper-proof, integrity-checked artifacts</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span></div>
            <div class="comparison-value comparison-value--other"><span class="check-no"></span></div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Security scanning</span>
              <span class="label-desc">Audit MCPs, skills, hooks for risks</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span></div>
            <div class="comparison-value comparison-value--other"><span class="check-partial"></span> Some</div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Drift detection</span>
              <span class="label-desc">Know when configs change under you</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span></div>
            <div class="comparison-value comparison-value--other"><span class="check-no"></span></div>
          </div>
        </div>

        <div class="comparison-group">
          <div class="comparison-group-title">Workflow</div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Runs locally</span>
              <span class="label-desc">No cloud dependency, no data exposure</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span></div>
            <div class="comparison-value comparison-value--other"><span class="check-partial"></span> Some</div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Multi-tool sync</span>
              <span class="label-desc">Claude, Cursor, OpenCode in one config</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span></div>
            <div class="comparison-value comparison-value--other"><span class="check-partial"></span> Some</div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Selective install</span>
              <span class="label-desc">Pick what you need, skip the rest</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span></div>
            <div class="comparison-value comparison-value--other"><span class="check-no"></span></div>
          </div>
        </div>

        <div class="comparison-group">
          <div class="comparison-group-title">Infrastructure</div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Version management</span>
              <span class="label-desc">Pin, update, rollback artifacts</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span></div>
            <div class="comparison-value comparison-value--other"><span class="check-partial"></span> Partial</div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">
              <span class="label-title">Self-hosted registry</span>
              <span class="label-desc">Run your own private registry</span>
            </div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span></div>
            <div class="comparison-value comparison-value--other"><span class="check-no"></span></div>
          </div>
        </div>
      </div>
      <p class="comparison-note">grekt is not a registry and not a cloud platform. It is infrastructure that runs on your machine.</p>
    </section>

    <!-- CTA -->
    <section class="cta-footer">
      <div class="cta-footer-content">
        <h2 class="cta-headline">Know your <span class="brand-highlight">stack</span>.</h2>
        <p class="cta-sub">The answer to "what is running?" should never be "I don't know."</p>
        <div class="cta-actions">
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
        </div>
        <div class="cta-links">
          <a href="/en-US/docs/guide/getting-started">Documentation →</a>
          <a href="https://github.com/grekt-labs">GitHub →</a>
        </div>
      </div>
    </section>

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
            <p class="footer-tagline">Know your AI stack.</p>
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
              <li><a href="https://blog.grekt.com/" target="_blank">Blog</a></li>
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
  font-size: 0.7rem;
  color: var(--card-text);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
  opacity: 0.5;
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

.trusted-by-logo--tecalliance img {
  height: 38px;
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

.hero-overline {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--grekt-primary-500);
  display: block;
  margin-bottom: 1rem;
}

.brand-claim {
  font-family: 'Cal Sans', system-ui, sans-serif;
  font-size: 5rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--hero-text-color);
  display: block;
  margin-bottom: 0.6rem;
}

.brand-highlight {
  background: linear-gradient(135deg, var(--grekt-primary-700) 0%, var(--grekt-primary-500) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-h1 {
  font-size: 1.25rem;
  line-height: 1.6;
  font-weight: 400;
  color: var(--hero-tagline-color);
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
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

.hero-actions-row {
  display: flex;
  align-items: center;
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
  background: #f0f0f3 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath fill='%231a1a2e' stroke='%231a1a2e' stroke-width='1' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 12px center;
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
  background: #161b22 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' stroke='%23ffffff' stroke-width='1' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 12px center;
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

/* PROBLEM STATEMENT */
.problem-statement {
  padding: 0 20px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  max-width: 100vw;
  margin-bottom: 2rem;
}

.problem-headline {
  font-family: 'Cal Sans', system-ui, sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: var(--hero-text-color);
  line-height: 1.2;
  margin-bottom: 48px;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3rem;
  border: 0;
  text-align: center;
}

.problem-highlight {
  color: var(--grekt-primary-500);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  max-width: 1100px;
  margin: 0 auto;
}

.stat-card {
  background: var(--section-bg-alt);
  padding: 32px 24px;
  border-top: 3px solid var(--grekt-primary-500);
}

.stat-card--warn {
  border-top-color: #eab308;
}

.stat-card--fail {
  border-top-color: #ef4444;
}

.stat-number {
  font-family: 'Cal Sans', system-ui, sans-serif;
  font-weight: 800;
  font-size: 3rem;
  line-height: 1;
  margin-bottom: 12px;
  color: var(--grekt-primary-500);
}

.stat-card--warn .stat-number {
  color: #eab308;
}

.stat-card--fail .stat-number {
  color: #ef4444;
}

.stat-label {
  font-weight: 600;
  font-size: 1rem;
  color: var(--hero-text-color);
  margin-bottom: 8px;
}

.stat-desc {
  font-size: 0.875rem;
  color: var(--hero-tagline-color);
  line-height: 1.6;
  margin-bottom: 12px;
}

.stat-source {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: var(--grekt-primary-500);
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.stat-source:hover {
  opacity: 1;
}

/* THREE PILLARS */
.pillars {
  padding: 80px 20px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  max-width: 100vw;
  text-align: center;

  position: relative;
  overflow: hidden;
}

.pillars-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(16,171,141,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16,171,141,0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.pillars-overline {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--grekt-primary-500);
  display: block;
  margin-bottom: 12px;
}

.pillars-heading, .pillars-grid {
  position: relative;
  z-index: 1;
}

.pillars-heading {
  font-family: 'Cal Sans', system-ui, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--hero-text-color);
  line-height: 1.2;
  margin-bottom: 48px;
  margin-top: -30px;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  border: none;
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 1100px;
  margin: 0 auto;
}

.pillar-card {
  border: 1px solid var(--divider-color);
  background: var(--section-bg-alt);
  padding: 32px 24px;
  text-align: left;
}

.pillar-number {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--grekt-primary-500);
  opacity: 0.5;
  display: block;
  margin-bottom: 12px;
}

.pillar-title {
  font-family: 'Cal Sans', system-ui, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--hero-text-color);
  margin: 0 0 12px;
}

.pillar-desc {
  font-size: 0.875rem;
  color: var(--hero-tagline-color);
  line-height: 1.65;
  margin: 0;
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
  content: "\2713";
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
  content: "\2717";
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

/* CTA FOOTER */
.cta-footer {
  padding: 96px 20px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  text-align: center;
  border-top: 1px solid var(--divider-color);
}

.cta-footer-content {
  max-width: 640px;
  margin: 0 auto;
}

.cta-headline {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--card-title);
  margin-bottom: 16px;
  line-height: 1.2;
  border: 0;
}

.cta-sub {
  font-size: 1.1rem;
  color: var(--card-text);
  opacity: 0.8;
  margin-bottom: 40px;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.cta-links {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}

.cta-links a {
  color: var(--card-text);
  text-decoration: none;
  font-size: 0.9rem;
  opacity: 0.7;
  transition: opacity 0.2s ease, color 0.2s ease;
}

.cta-links a:hover {
  opacity: 1;
  color: var(--grekt-text-accent);
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

  .brand-claim {
    font-size: 2.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .hero-h1 {
    font-size: 1.1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .hero-actions-row {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .hero-actions-row a {
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

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .problem-headline {
    font-size: 1.5rem;
    padding: 0 1rem;
  }

  .stat-number {
    font-size: 2.5rem;
  }

  .pillars-grid {
    grid-template-columns: 1fr;
  }

  .pillars-heading {
    font-size: 1.5rem;
    padding: 0 1rem;
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
  background: linear-gradient(
    to bottom,
    var(--vp-c-bg) 0%,
    var(--section-bg) 25%
  );
  -webkit-backface-visibility: hidden;
}

.init-demo--warn {
  background: linear-gradient(
    to bottom,
    var(--vp-c-bg) 0%,
    rgba(232, 168, 56, 0.04) 25%
  );
}

.init-demo--synced {
  background: linear-gradient(
    to bottom,
    var(--vp-c-bg) 0%,
    rgba(119, 202, 189, 0.04) 25%
  );
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

.init-demo-emphasis {
  color: var(--vp-c-text-1);
}

.init-demo-subtitle {
  text-align: center;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  max-width: 600px;
  margin: -16px auto 32px;
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

/* EVAL GRADES */
.eval-section {
  padding: 96px 20px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  overflow: hidden;
}

.eval-content {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.eval-label {
  display: block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--grekt-text-accent);
  margin-bottom: 16px;
}

.eval-headline {
  font-size: 2rem;
  font-weight: 700;
  color: var(--card-title);
  line-height: 1.3;
  margin-bottom: 16px;
  border: 0;
}

.eval-grade-highlight {
  display: inline-block;
  background: linear-gradient(135deg, var(--grekt-primary-500), #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.2rem;
}

.eval-sub {
  font-size: 1rem;
  color: var(--card-text);
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 24px;
}

.eval-link {
  color: var(--grekt-text-accent);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: opacity 0.2s ease;
}

.eval-link:hover {
  opacity: 0.8;
}

.eval-cards-area {
  position: relative;
  height: 380px;
  width: 100%;
}

.eval-card {
  position: absolute;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 220px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.eval-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.eval-card-name {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  color: var(--card-text);
  white-space: nowrap;
}

.eval-card-grade {
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1;
}

.eval-card-grade--a {
  color: #10ab8d;
}

.eval-card-grade--b {
  color: #34d399;
}

.eval-card-grade--c {
  color: #e8a838;
}

.eval-card-grade--d {
  color: #f97316;
}

.eval-card-grade--f {
  color: #ef4444;
}

.eval-card--1 {
  top: 10px;
  left: 20px;
  transform: rotate(-3deg);
  z-index: 3;
}

.eval-card--2 {
  top: 80px;
  right: 10px;
  transform: rotate(2.5deg);
  z-index: 4;
}

.eval-card--3 {
  top: 160px;
  left: 60px;
  transform: rotate(-5deg);
  z-index: 2;
}

.eval-card--4 {
  top: 240px;
  right: 40px;
  transform: rotate(4deg);
  z-index: 5;
}

.eval-card--5 {
  top: 40px;
  left: 200px;
  transform: rotate(1.5deg);
  z-index: 1;
}

.eval-card--6 {
  top: 290px;
  left: 10px;
  transform: rotate(-2deg);
  z-index: 6;
}

@media (max-width: 768px) {
  .eval-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .eval-headline {
    font-size: 1.5rem;
  }

  .eval-cards-area {
    height: 320px;
  }

  .eval-card {
    width: 180px;
    padding: 14px 18px;
  }

  .eval-card-grade {
    font-size: 1.4rem;
  }

  .eval-card--1 { top: 0; left: 10px; }
  .eval-card--2 { top: 60px; right: 0; left: auto; }
  .eval-card--3 { top: 130px; left: 30px; }
  .eval-card--4 { top: 200px; right: 10px; left: auto; }
  .eval-card--5 { top: 20px; left: 140px; }
  .eval-card--6 { top: 250px; left: 0; }
}

/* SELF-HOSTED / TEAMS */
.self-hosted {
  padding: 96px 20px;
  width: 100vw;
  padding-bottom: 12rem;
  margin-left: calc(-50vw + 50%);
}

.self-hosted .pillars-heading {
  max-width: 1100px;
}

.self-hosted .pillars-grid {
  max-width: 1100px;
}

.pillar-card--featured {
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(16, 171, 141, 0.08) 0%,
    rgba(16, 171, 141, 0.02) 100%
  );
  border-color: transparent;
}

.pillar-card--featured > .dots-border {
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: rgba(119, 202, 189, 0.15);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: 0;
  overflow: hidden;
}

.pillar-card--featured > .dots-border::before {
  content: "";
  position: absolute;
  inset: -100%;
  background: conic-gradient(from 0deg, transparent 0%, transparent 75%, rgba(119, 202, 189, 0.8) 80%, rgba(119, 202, 189, 0.3) 90%, transparent 100%);
  animation: rotate-border 3s linear infinite;
}

html:not(.dark) .pillar-card--featured > .dots-border {
  background: rgba(50, 130, 115, 0.2);
}

html:not(.dark) .pillar-card--featured > .dots-border::before {
  background: conic-gradient(from 0deg, transparent 0%, transparent 75%, rgba(50, 130, 115, 0.8) 80%, rgba(50, 130, 115, 0.3) 90%, transparent 100%);
}

.pillar-badge {
  display: inline-block;
  background: var(--grekt-primary-500);
  color: #0d1117;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 8px;
  border-radius: 20px;
  margin-left: 8px;
  vertical-align: middle;
}

.self-hosted-link {
  display: inline-block;
  margin-top: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--grekt-text-accent);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.self-hosted-link:hover {
  opacity: 0.8;
}
</style>
