<script setup>
import { ref, nextTick, onUnmounted } from 'vue'


const lines = ref([])
const animating = ref(false)
const finished = ref(false)
const terminalEl = ref(null)

function scrollToBottom(el) {
  if (!el) return
  nextTick(() => {
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
    })
  })
}

let timeouts = []

// Pre-menu lines (download + version)
const preMenuLines = [
  { type: 'blank', text: '' },
  { type: 'spinner', text: 'Downloading @grekt/overseas...' },
  { type: 'blank', text: '' },
  { type: 'info', text: '@grekt/overseas@1.2.0' },
  { type: 'blank', text: '' },
  { type: 'prompt', text: '? Select components to install:' },
]

// Interactive menu items (reactive, animated)
const menuItems = ref([
  { id: 'skills-section', type: 'section', text: ' \u2500\u2500 skills \u2500\u2500' },
  { id: 'pirate-commits', type: 'choose-item', checked: true, cursor: false, kind: 'skill', name: 'pirate-commits', desc: 'Commit messages with pirate flair and...' },
  { id: 'pirate-greetings', type: 'choose-item', checked: true, cursor: false, kind: 'skill', name: 'pirate-greetings', desc: 'Greet the user like a pirate captain...' },
  { id: 'sea-metaphors', type: 'choose-item', checked: true, cursor: false, kind: 'skill', name: 'sea-metaphors', desc: 'Use nautical terms for code concepts...' },
  { id: 'hooks-section', type: 'section', text: ' \u2500\u2500 hooks \u2500\u2500' },
  { id: 'overseas-session-init', type: 'choose-item', checked: true, cursor: false, kind: 'hook', name: 'overseas-session-init', desc: 'Injects overseas skill context on...' },
])
const menuVisible = ref(false)

// Post-menu lines (result)
const postMenuLines = [
  { type: 'blank', text: '' },
  { type: 'success', text: 'Installed @grekt/overseas@1.2.0' },
  { type: 'info', text: '  skills: pirate-commits, pirate-greetings' },
  { type: 'info', text: '  hooks: overseas-session-init' },
]

function moveCursor(targetId) {
  menuItems.value = menuItems.value.map(item => ({
    ...item,
    cursor: item.id === targetId,
  }))
}

function toggleItem(targetId) {
  menuItems.value = menuItems.value.map(item =>
    item.id === targetId ? { ...item, checked: !item.checked } : item
  )
}

const configVisible = ref(false)

const beforeConfig = [
  { num: 1, text: 'targets:', type: 'key' },
  { num: 2, text: '  - claude', type: 'value' },
  { num: 3, text: '  - codex', type: 'value' },
  { num: 4, text: 'artifacts: {}', type: 'key' },
  { num: 5, text: 'customTargets: {}', type: 'key' },
  { num: 6, text: '', type: 'blank' },
  { num: 7, text: '', type: 'blank' },
  { num: 8, text: '', type: 'blank' },
  { num: 9, text: '', type: 'blank' },
  { num: 10, text: '', type: 'blank' },
  { num: 11, text: '', type: 'blank' },
  { num: 12, text: '', type: 'blank' },
  { num: 13, text: '', type: 'blank' },
]

const afterConfig = [
  { num: 1, text: 'targets:', type: 'key' },
  { num: 2, text: '  - claude', type: 'value' },
  { num: 3, text: '  - codex', type: 'value' },
  { num: 4, text: 'artifacts:', type: 'key' },
  { num: 5, text: '  "@grekt/overseas":', type: 'key' },
  { num: 6, text: '    version: "1.2.0"', type: 'value' },
  { num: 7, text: '    skills:', type: 'key' },
  { num: 8, text: '      - pirate-commits', type: 'value' },
  { num: 9, text: '      - pirate-greetings', type: 'value' },
  { num: 10, text: '      # sea-metaphors skipped', type: 'comment' },
  { num: 11, text: '    hooks:', type: 'key' },
  { num: 12, text: '      - overseas-session-init', type: 'value' },
  { num: 13, text: 'customTargets: {}', type: 'key' },
]

const configLines = ref(beforeConfig)

function pushLine(line) {
  lines.value.push(line)
  scrollToBottom(terminalEl.value)
}

function removeSpinner() {
  const idx = lines.value.findIndex(l => l.type === 'spinner')
  if (idx !== -1) {
    lines.value.splice(idx, 1)
  }
}

function scheduleTimeout(fn, delay) {
  const timeout = setTimeout(fn, delay)
  timeouts.push(timeout)
  return delay
}

const runCommand = () => {
  if (animating.value) return

  animating.value = true
  configVisible.value = false
  menuVisible.value = false

  timeouts.forEach(clearTimeout)
  timeouts = []

  pushLine({ type: 'command', text: '$ grekt add @grekt/overseas --choose' })

  let t = 700

  // Show pre-menu lines (download spinner, version, prompt)
  preMenuLines.forEach((line) => {
    if (line.type === 'spinner') {
      scheduleTimeout(() => pushLine(line), t)
      t += 1000
      scheduleTimeout(() => removeSpinner(), t)
      t += 100
    } else {
      scheduleTimeout(() => pushLine(line), t)
      t += line.type === 'prompt' ? 400 : 120
    }
  })

  // Show menu inline (insert a placeholder line, menu renders via menuVisible)
  scheduleTimeout(() => {
    moveCursor('pirate-commits')
    pushLine({ type: 'menu-placeholder' })
    menuVisible.value = true
  }, t)
  t += 600

  // Animate: cursor moves down to sea-metaphors
  scheduleTimeout(() => moveCursor('pirate-greetings'), t)
  t += 400
  scheduleTimeout(() => moveCursor('sea-metaphors'), t)
  t += 400

  // Uncheck sea-metaphors
  scheduleTimeout(() => toggleItem('sea-metaphors'), t)
  t += 800

  // Show results (keep menu visible)
  scheduleTimeout(() => {
    postMenuLines.forEach((line, i) => {
      scheduleTimeout(() => pushLine(line), i * 200)
    })
  }, t)
  t += postMenuLines.length * 200

  t += 600
  scheduleTimeout(() => {
    configLines.value = afterConfig
    configVisible.value = true
  }, t)

  t += 500
  scheduleTimeout(() => {
    animating.value = false
    finished.value = true
  }, t)
}

onUnmounted(() => {
  timeouts.forEach(clearTimeout)
})

defineExpose({ runCommand, animating, finished })
</script>

<template>
  <div class="cli-demo-choose">
    <div class="demo-split">
      <!-- Left: Terminal output -->
      <div ref="terminalEl" class="demo-terminal">
        <div class="terminal-content">
          <div
            v-for="(line, index) in lines"
            :key="index"
            :class="`terminal-line terminal-line--${line.type}`"
          >
            <template v-if="line.type === 'command'">
              <span class="prompt-sign">$</span>
              <span class="command-text">{{ line.text.slice(2) }}</span>
            </template>
            <template v-else-if="line.type === 'success'">
              <span class="success-icon">&#10003;</span>
              <span class="success-text">{{ line.text }}</span>
            </template>
            <template v-else-if="line.type === 'success-bold'">
              <span class="success-icon">&#10003;</span>
              <span class="success-bold-text">{{ line.text }}</span>
            </template>
            <template v-else-if="line.type === 'spinner'">
              <span class="spinner-icon">&#9696;</span>
              <span class="spinner-text">{{ line.text }}</span>
            </template>
            <template v-else-if="line.type === 'info'">
              <span class="info-text">{{ line.text }}</span>
            </template>
            <template v-else-if="line.type === 'prompt'">
              <span class="prompt-text">{{ line.text }}</span>
            </template>
            <template v-else-if="line.type === 'menu-placeholder'">
              <div v-if="menuVisible" class="choose-menu">
                <div
                  v-for="item in menuItems"
                  :key="item.id"
                  :class="`terminal-line terminal-line--${item.type}`"
                >
                  <template v-if="item.type === 'section'">
                    <span class="section-divider">{{ item.text }}</span>
                  </template>
                  <template v-else-if="item.type === 'choose-item'">
                    <span class="choose-item" :class="{ 'choose-item--checked': item.checked, 'choose-item--unchecked': !item.checked }">
                      <span v-if="item.cursor" class="choose-cursor">&#10095;</span>
                      <span v-else class="choose-cursor-space">&nbsp;</span>
                      <span class="choose-circle">{{ item.checked ? '\u25C9' : '\u25CB' }}</span>
                      <span class="choose-kind">{{ item.kind }}:</span>
                      <span class="choose-name">{{ item.name }}</span>
                      <span class="choose-desc">{{ item.desc }}</span>
                    </span>
                  </template>
                </div>
              </div>
            </template>
            <template v-else>
              <span>{{ line.text }}</span>
            </template>
          </div>

        </div>
      </div>

      <!-- Bottom: Config preview -->
      <div class="demo-config">
        <div class="config-editor-header">
          <span class="config-filename">grekt.yaml</span>
          <span v-if="configVisible" class="config-updated">Updated</span>
        </div>
        <div class="config-editor-content">
          <div
            v-for="line in configLines"
            :key="line.num + '-' + line.text"
            class="config-line"
            :class="{
              'config-line--new': configVisible && line.num >= 4 && line.num <= 12,
            }"
          >
            <span class="config-line-num">{{ line.num }}</span>
            <span
              class="config-line-text"
              :class="{
                'config-line-text--comment': line.type === 'comment',
                'config-line-text--key': line.type === 'key',
                'config-line-text--value': line.type === 'value',
              }"
            >{{ line.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cli-demo-choose {
  width: 100%;
}

.demo-split {
  display: flex;
  flex-direction: column;
}

/* Terminal */
.demo-terminal {
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  overflow-y: auto;
  scroll-behavior: smooth;
  overflow-y: scroll;
  background: rgba(0, 0, 0, 0.5);
  min-height: 220px;
  max-height: 190px;
}

.terminal-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.78rem;
  line-height: 1.7;
}

.terminal-line {
  animation: line-fade-in 0.2s ease-out;
}

.terminal-line--blank {
  height: 0.9em;
}

.prompt-sign {
  color: #77CABD;
  margin-right: 8px;
  font-weight: 600;
}

.command-text {
  color: #e6edf3;
  font-weight: 500;
}

.prompt-text {
  color: #b0b8c4;
  font-weight: 500;
}

.section-divider {
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.72rem;
  padding: 2px 0;
}

.choose-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 1px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.choose-item--checked {
  color: #77CABD;
}

.choose-item--unchecked {
  color: rgba(255, 255, 255, 0.3);
}

.choose-cursor {
  color: #77CABD;
  font-size: 0.6em;
  width: 10px;
  flex-shrink: 0;
}

.choose-cursor-space {
  width: 10px;
  flex-shrink: 0;
}

.choose-circle {
  font-size: 0.85em;
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.choose-menu {
  animation: line-fade-in 0.2s ease-out;
}

.choose-kind {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.75em;
  flex-shrink: 0;
}

.choose-item--checked .choose-kind {
  color: rgba(119, 202, 189, 0.6);
}

.choose-name {
  font-weight: 500;
  flex-shrink: 0;
}

.choose-desc {
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.85em;
  overflow: hidden;
  text-overflow: ellipsis;
}

.choose-item--checked .choose-desc {
  color: rgba(119, 202, 189, 0.35);
}

.success-icon {
  color: #77CABD;
  margin-right: 8px;
  font-weight: 700;
}

.success-text {
  color: #e6edf3;
}

.success-bold-text {
  color: #e6edf3;
  font-weight: 700;
}

.spinner-icon {
  color: #77CABD;
  margin-right: 8px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

.spinner-text {
  color: rgba(255, 255, 255, 0.5);
}

.info-text {
  color: rgba(255, 255, 255, 0.5);
}

/* Config panel */
.demo-config {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.config-editor-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.config-filename {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.5);
}

.config-updated {
  margin-left: auto;
  font-size: 0.62rem;
  color: #77CABD;
  animation: line-fade-in 0.2s ease-out;
}

.config-editor-content {
  padding: 8px 0;
}

.config-line {
  display: flex;
  align-items: flex-start;
  padding: 0 16px;
  line-height: 1.65;
  min-height: 1.65em;
  transition: background 0.3s ease;
}

.config-line--new {
  background: rgba(119, 202, 189, 0.06);
  animation: line-fade-in 0.3s ease-out;
}

.config-line-num {
  color: rgba(255, 255, 255, 0.15);
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.7rem;
  width: 20px;
  text-align: right;
  margin-right: 16px;
  flex-shrink: 0;
  user-select: none;
}

.config-line-text {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  white-space: pre;
}

.config-line-text--comment {
  color: rgba(255, 255, 255, 0.3);
}

.config-line-text--key {
  color: #e8a838;
}

.config-line-text--value {
  color: rgba(255, 255, 255, 0.7);
}

@keyframes line-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .demo-terminal {
    padding: 16px 20px;
    max-height: 280px;
  }

  .terminal-content {
    font-size: 0.7rem;
  }

  .config-line-text {
    font-size: 0.68rem;
  }
}
</style>
