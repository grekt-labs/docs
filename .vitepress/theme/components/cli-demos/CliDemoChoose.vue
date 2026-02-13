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

const chooseLines = [
  { type: 'blank', text: '' },
  { type: 'spinner', text: 'Downloading @obra/superpowers...' },
  { type: 'blank', text: '' },
  { type: 'info', text: '@obra/superpowers@1.0.0' },
  { type: 'blank', text: '' },
  { type: 'prompt', text: 'Select skills to install:' },
  { type: 'blank', text: '' },
  { type: 'option', text: '  [x] systematic-debugging', checked: true },
  { type: 'option', text: '  [x] test-driven-development', checked: true },
  { type: 'option', text: '  [ ] brainstorming', checked: false },
  { type: 'option', text: '  [ ] writing-plans', checked: false },
  { type: 'option', text: '  [x] subagent-driven-development', checked: true },
  { type: 'blank', text: '' },
  { type: 'prompt', text: 'Select agents to install:' },
  { type: 'blank', text: '' },
  { type: 'option', text: '  [x] code-reviewer', checked: true },
  { type: 'option', text: '  [ ] documentation-writer', checked: false },
  { type: 'blank', text: '' },
  { type: 'success', text: 'Installed @obra/superpowers@1.0.0' },
  { type: 'info', text: '  skills: systematic-debugging, test-driven-development,' },
  { type: 'info', text: '          subagent-driven-development' },
  { type: 'info', text: '  agents: code-reviewer' },
  { type: 'blank', text: '' },
  { type: 'success', text: 'Created .claude/skills/superpowers_systematic-debugging.md' },
  { type: 'success', text: 'Created .claude/skills/superpowers_test-driven-development.md' },
  { type: 'success', text: 'Created .claude/skills/superpowers_subagent-driven-development.md' },
  { type: 'success', text: 'Created .claude/agents/superpowers_code-reviewer.md' },
]

const configPreview = ref('')
const configVisible = ref(false)

const configContent = `# grekt.yaml
artifacts:
  @obra/superpowers:
    version: "1.0.0"
    skills:
      - systematic-debugging
      - test-driven-development
      - subagent-driven-development
    agents:
      - code-reviewer`

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

  timeouts.forEach(clearTimeout)
  timeouts = []

  pushLine({ type: 'command', text: '$ grekt add @obra/superpowers --choose' })

  let t = 700

  chooseLines.forEach((line) => {
    if (line.type === 'spinner') {
      scheduleTimeout(() => pushLine(line), t)
      t += 1000
      scheduleTimeout(() => removeSpinner(), t)
      t += 100
    } else {
      scheduleTimeout(() => pushLine(line), t)

      if (line.type === 'prompt') {
        t += 400
      } else if (line.type === 'option') {
        t += 220
      } else if (line.type === 'success') {
        t += 200
      } else {
        t += 120
      }
    }
  })

  t += 600
  scheduleTimeout(() => {
    configPreview.value = configContent
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
            <template v-else-if="line.type === 'option'">
              <span :class="line.checked ? 'option-checked' : 'option-unchecked'">{{ line.text }}</span>
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
            <template v-else>
              <span>{{ line.text }}</span>
            </template>
          </div>

          <div v-if="!finished" class="terminal-prompt-input" :class="{ 'terminal-prompt-input--disabled': animating }">
            <button class="run-command-btn" :disabled="animating" @click="runCommand">
              <span class="prompt-sign">$</span>
              <span class="command-preview">grekt add @obra/superpowers --choose</span>
              <span class="run-hint">click to run</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Config preview -->
      <div class="demo-config">
        <div class="config-header">grekt.yaml</div>
        <div class="config-content" :class="{ 'config-content--visible': configVisible }">
          <pre class="config-code">{{ configPreview }}</pre>
        </div>
        <div v-if="!configVisible" class="config-placeholder">
          <span class="config-placeholder-text">Your selection is saved in the config</span>
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
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 0;
  height: 500px;
  max-height: 500px;
}

/* Terminal */
.demo-terminal {
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  overflow-y: auto;
  scroll-behavior: smooth;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
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

.option-checked {
  color: #77CABD;
}

.option-unchecked {
  color: rgba(255, 255, 255, 0.3);
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

.terminal-prompt-input {
  margin-top: auto;
  padding-top: 8px;
}

.run-command-btn {
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  padding: 8px 12px;
  background: rgba(119, 202, 189, 0.06);
  border: 1px solid rgba(119, 202, 189, 0.2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.78rem;
  animation: prompt-pulse 2s ease-in-out infinite;
}

.run-command-btn:hover:not(:disabled) {
  background: rgba(119, 202, 189, 0.12);
  border-color: rgba(119, 202, 189, 0.4);
  animation: none;
}

.run-command-btn:disabled {
  opacity: 0.3;
  cursor: default;
  animation: none;
}

.command-preview {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.run-hint {
  margin-left: auto;
  color: rgba(119, 202, 189, 0.5);
  font-size: 0.65rem;
  font-style: italic;
}

.terminal-prompt-input--disabled .run-hint {
  display: none;
}

/* Config panel */
.demo-config {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.config-header {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 12px;
  font-weight: 600;
}

.config-content {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.config-content--visible {
  opacity: 1;
  transform: translateY(0);
}

.config-code {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.75rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  white-space: pre;
}

.config-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.config-placeholder-text {
  color: rgba(255, 255, 255, 0.15);
  font-size: 0.75rem;
  font-style: italic;
}

@keyframes line-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes prompt-pulse {
  0%, 100% { border-color: rgba(119, 202, 189, 0.15); }
  50% { border-color: rgba(119, 202, 189, 0.35); }
}

@media (max-width: 768px) {
  .demo-split {
    grid-template-columns: 1fr;
    height: auto;
    max-height: none;
  }

  .demo-terminal {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding: 16px 20px;
    order: 1;
    max-height: 300px;
  }

  .demo-config {
    padding: 16px 20px;
    order: 2;
    max-height: 200px;
  }

  .terminal-content {
    font-size: 0.7rem;
  }

  .config-code {
    font-size: 0.65rem;
  }
}
</style>
