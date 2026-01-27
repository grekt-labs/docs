<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const installMethods = [
  { id: 'curl', label: 'curl', command: 'curl -fsSL https://grekt.com/install.sh | sh' },
  { id: 'brew', label: 'brew', command: 'brew tap grekt-labs/grekt && brew install grekt' },
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
    answer: 'grekt is an AI artifact manager that helps you install, sync, and share AI configurations (agents, skills, commands) across tools like Claude Code, Cursor, OpenCode, and more.'
  },
  {
    question: 'How does grekt work?',
    answer: 'grekt downloads artifacts to your project and integrates with your AI tools. You can optionally sync them to specific tools like Claude Code or Cursor, or just use them directly from the .grekt folder.'
  },
  {
    question: 'Is grekt free?',
    answer: 'Yes! The CLI is open source and free to use. The public registry for sharing artifacts will also be free when it launches.'
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
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <div class="floating-icon icon-cursor" title="Cursor">
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path fill="currentColor" d="M13.64 21.97C13.14 22.21 12.54 22 12.31 21.5L10.13 16.76L7.62 18.78C7.45 18.92 7.24 19 7.02 19C6.55 19 6.16 18.61 6.16 18.14V5.86C6.16 5.39 6.55 5 7.02 5C7.24 5 7.45 5.08 7.62 5.22L18.09 13.81C18.46 14.11 18.52 14.65 18.22 15.02C18.06 15.21 17.83 15.33 17.58 15.35L13.83 15.68L16.01 20.42C16.24 20.92 16.03 21.52 15.53 21.75L13.64 21.97Z"/>
            </svg>
          </div>
          <div class="floating-icon icon-opencode" title="OpenCode">
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
          </div>
          <div class="floating-icon icon-windsurf" title="Windsurf">
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </div>
          <div class="floating-icon icon-copilot" title="GitHub Copilot">
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
            </svg>
          </div>
          <!-- Central grekt icon -->
          <div class="floating-icon icon-grekt" title="grekt">
            <img src="/logos/grekt-isologo.svg" alt="grekt" width="40" height="40" />
          </div>
        </div>
      </div>

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
      </div>

    </section>

    <!-- TRUSTED BY - Separate section -->
    <section class="trusted-by">
      <div class="trusted-by-content">
        <span class="trusted-by-label">Trusted by</span>
        <div class="trusted-by-logos">
          <a href="https://sesamehr.com" target="_blank" rel="noopener" class="trusted-by-logo" title="Sesame">
            <img src="/logos/Sesame.png" alt="Sesame" />
          </a>
          <!-- <a href="https://thehotelsnetwork.com" target="_blank" rel="noopener" class="trusted-by-logo" title="The Hotels Network">
            <img src="/logos/thn.png" alt="The Hotels Network" />
          </a> -->
        </div>
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
          <h3>Sync Everywhere</h3>
          <p>Push your agents, skills, and commands to Claude, Cursor, OpenCode, and more with one command.</p>
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
          <p>Explore community created artifacts or publish your own for others to use.</p>
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
            <li>Self hosted instances supported</li>
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
            <li>Detect when files change</li>
            <li>Drift detection catches modifications</li>
            <li>Reproducible installs across your team</li>
          </ul>
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
            <div class="comparison-label">What it is</div>
            <div class="comparison-value comparison-value--grekt">AI artifact governance</div>
            <div class="comparison-value comparison-value--other">Skills catalog</div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">Core structure</div>
            <div class="comparison-value comparison-value--grekt">Versioned artifact + schema</div>
            <div class="comparison-value comparison-value--other">Text file</div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">Philosophy</div>
            <div class="comparison-value comparison-value--grekt">Reusability & governance</div>
            <div class="comparison-value comparison-value--other">Reusability</div>
          </div>
        </div>

        <div class="comparison-group">
          <div class="comparison-group-title">Context management</div>
          <div class="comparison-row">
            <div class="comparison-label">Token budget</div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span>Considered</div>
            <div class="comparison-value comparison-value--other"><span class="check-no"></span></div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">Context bloat</div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span>Minimized</div>
            <div class="comparison-value comparison-value--other"><span class="check-no"></span></div>
          </div>
        </div>

        <div class="comparison-group">
          <div class="comparison-group-title">Reliability</div>
          <div class="comparison-row">
            <div class="comparison-label">Versioning</div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span>Lockfile + SHA</div>
            <div class="comparison-value comparison-value--other"><span class="check-partial"></span>Manual updates</div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">Drift detection</div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span></div>
            <div class="comparison-value comparison-value--other"><span class="check-no"></span></div>
          </div>
          <div class="comparison-row">
            <div class="comparison-label">Consistency</div>
            <div class="comparison-value comparison-value--grekt"><span class="check-yes"></span>Per-project lockfile</div>
            <div class="comparison-value comparison-value--other"><span class="check-no"></span>Global, remember to sync</div>
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
              <li><a href="/en-US/docs/guide/licensing">Licensing</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="copyright">CLI: Apache 2.0 · Engine: BSL 1.1</p>
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
  background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
  animation: float-1 6s ease-in-out infinite;
}

.icon-cursor {
  top: 72%;
  left: 8%;
  background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
  animation: float-2 5s ease-in-out infinite 0.5s;
}

.icon-opencode {
  top: 60%;
  left: 18%;
  background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
  animation: float-3 7s ease-in-out infinite 1s;
}

.icon-windsurf {
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

/* Trusted By Section */
.trusted-by {
  background: var(--section-bg);
  border-top: 1px solid var(--divider-color);
  padding: 40px 20px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.trusted-by-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
}

.trusted-by-label {
  font-size: 0.75rem;
  color: var(--card-text);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 500;
  opacity: 0.7;
  white-space: nowrap;
}

.trusted-by-logos {
  display: flex;
  align-items: center;
  gap: 48px;
  flex-wrap: wrap;
  justify-content: center;
}

.trusted-by-logo {
  opacity: 0.6;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
}

.trusted-by-logo:hover {
  opacity: 1;
}

.trusted-by-logo img {
  height: 36px;
  width: auto;
  filter: var(--logo-filter);
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
  flex-direction: row;
  align-items: stretch;
  gap: 0;
}

/* Install select dropdown */
.install-select {
  appearance: none;
  -webkit-appearance: none;
  background: #161b22 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24'%3E%3Cpath fill='%2377CABD' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 12px center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-right: none;
  border-radius: 8px 0 0 8px;
  padding: 12px 42px 12px 16px;
  color: var(--grekt-primary-500);
  font-size: 0.85rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.install-select:hover {
  background-color: #1c2128;
}

.install-select:focus {
  outline: none;
  border-color: var(--grekt-primary-500);
}

.install-select option {
  background: #161b22;
  color: #e6edf3;
  padding: 8px;
}

/* Install box */
.install-box {
  display: flex;
  align-items: center;
  background: #0d1117;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 8px 8px 0;
  padding: 12px 16px;
  gap: 12px;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  flex: 1;
}

.install-box--full {
  border-radius: 8px;
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
  padding: 40px 20px 80px;
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

/* COMPARISON */
.comparison {
  background: var(--section-bg);
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
  color: var(--grekt-primary-500);
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
  color: var(--grekt-primary-500);
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
  font-weight: 500;
  color: var(--card-title);
  font-size: 0.9rem;
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
  .icon-opencode { left: 14%; top: 62%; }
  .icon-windsurf { right: 2%; top: 54%; }
  .icon-copilot { right: 10%; top: 70%; }
}

@media (max-width: 768px) {
  .hero {
    padding: 80px 20px 80px;
  }

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
    flex-direction: column;
  }

  .install-select {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px 8px 0 0;
    border-bottom: none;
    background-position: right 12px center;
  }

  .install-box {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    border-radius: 0 0 8px 8px;
  }

  .install-command {
    font-size: 0.8rem;
  }

  /* Hide complex visual elements on mobile */
  .lines-container,
  .floating-icons {
    display: none;
  }

  .trusted-by-content {
    flex-direction: column;
    gap: 24px;
  }

  .trusted-by-logos {
    gap: 32px;
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

  .comparison-label {
    font-size: 0.8rem;
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
</style>
