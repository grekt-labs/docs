<script setup>
import { ref, nextTick, onMounted, onUnmounted, defineEmits } from 'vue'


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

const upgradeLines = [
  { type: 'command', text: '$ grekt upgrade @grekt/overseas' },
  { type: 'blank', text: '' },
  { type: 'spinner', text: 'Checking for updates...' },
  { type: 'blank', text: '' },
  { type: 'info', text: 'Upgrading 1 artifact(s):' },
  { type: 'blank', text: '' },
  { type: 'upgrade-item', text: '  @grekt/overseas: 1.2.0 → 1.3.0', from: '1.2.0', to: '1.3.0', name: '@grekt/overseas' },
  { type: 'blank', text: '' },
  { type: 'spinner', text: 'Downloading @grekt/overseas...' },
  { type: 'blank', text: '' },
  { type: 'success-section', text: 'Upgraded:' },
  { type: 'success', text: '@grekt/overseas: 1.2.0 → 1.3.0' },
  { type: 'blank', text: '' },
  { type: 'success-bold', text: 'Upgrade complete!' },
]

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

function removeAllSpinners() {
  lines.value = lines.value.filter(l => l.type !== 'spinner')
}

function scheduleTimeout(fn, delay) {
  const timeout = setTimeout(fn, delay)
  timeouts.push(timeout)
  return delay
}

const runCommand = () => {
  if (animating.value || finished.value) return

  lines.value = []
  animating.value = true

  timeouts.forEach(clearTimeout)
  timeouts = []

  let t = 0

  // Command
  scheduleTimeout(() => pushLine(upgradeLines[0]), t)
  t += 700

  // Blank
  scheduleTimeout(() => pushLine(upgradeLines[1]), t)
  t += 120

  // Spinner: Checking for updates
  scheduleTimeout(() => pushLine(upgradeLines[2]), t)
  t += 1200
  scheduleTimeout(() => removeSpinner(), t)
  t += 100

  // Blank
  scheduleTimeout(() => pushLine(upgradeLines[3]), t)
  t += 120

  // "Upgrading 1 artifact(s):"
  scheduleTimeout(() => pushLine(upgradeLines[4]), t)
  t += 300

  // Blank
  scheduleTimeout(() => pushLine(upgradeLines[5]), t)
  t += 120

  // Upgrade item
  scheduleTimeout(() => {
    pushLine(upgradeLines[6])
  }, t)
  t += 400

  // Blank
  scheduleTimeout(() => pushLine(upgradeLines[7]), t)
  t += 120

  // Spinner: downloading
  scheduleTimeout(() => pushLine(upgradeLines[8]), t)
  t += 1200

  // Remove spinner
  scheduleTimeout(() => removeSpinner(), t)
  t += 100

  // Blank
  scheduleTimeout(() => pushLine(upgradeLines[9]), t)
  t += 120

  // "Upgraded:" header
  scheduleTimeout(() => pushLine(upgradeLines[10]), t)
  t += 200

  // Success line
  scheduleTimeout(() => {
    pushLine(upgradeLines[11])
  }, t)
  t += 250

  // Blank
  scheduleTimeout(() => pushLine(upgradeLines[12]), t)
  t += 120

  // Final message
  scheduleTimeout(() => pushLine(upgradeLines[13]), t)
  t += 200

  t += 500
  scheduleTimeout(() => {
    animating.value = false
    finished.value = true
    scrollToBottom(terminalEl.value)
  }, t)
}

onUnmounted(() => {
  timeouts.forEach(clearTimeout)
})

defineExpose({ runCommand, animating, finished })
</script>

<template>
  <div class="cli-demo-update">
    <div class="demo-split">
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
            <template v-else-if="line.type === 'upgrade-item'">
              <span class="upgrade-item-text">{{ line.text }}</span>
            </template>
            <template v-else-if="line.type === 'success'">
              <span class="success-icon">&#10003;</span>
              <span class="success-text">{{ line.text }}</span>
            </template>
            <template v-else-if="line.type === 'success-section'">
              <span class="success-section-text">{{ line.text }}</span>
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
            <template v-else>
              <span>{{ line.text }}</span>
            </template>
          </div>

          <div v-if="finished" class="upgrade-explanation">
            Upgrades respect selections made with <strong>--choose</strong>. If the artifact structure changes, you will be asked again.
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cli-demo-update {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.demo-split {
  display: flex;
  flex-direction: column;
  min-height: 280px;
}

/* Terminal */
.demo-terminal {
  padding: 20px 24px;
  overflow-y: auto;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.terminal-content {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.78rem;
  line-height: 1.7;
  flex: 1;
  display: flex;
  flex-direction: column;
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

.upgrade-item-text {
  color: #e8a838;
}

.success-icon {
  color: #77CABD;
  margin-right: 8px;
  font-weight: 700;
}

.success-text {
  color: #e6edf3;
}

.success-section-text {
  color: #e6edf3;
  font-weight: 600;
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
  padding-top: 8px;
}

.run-command-btn {
  --border-radius: 6px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  padding: 8px 12px;
  background: rgba(15, 16, 22, 0.8);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: box-shadow 0.2s ease;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.78rem;
  overflow: hidden;
}

.run-command-btn:hover:not(:disabled) {
  box-shadow: 0 0 16px rgba(119, 202, 189, 0.4);
}

.run-command-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.run-command-btn .dots-border {
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

.run-command-btn .dots-border::before {
  content: "";
  position: absolute;
  inset: -100%;
  background: conic-gradient(from 0deg, transparent 0%, transparent 75%, rgba(119, 202, 189, 0.8) 80%, rgba(119, 202, 189, 0.3) 90%, transparent 100%);
  animation: rotate-border 2s linear infinite;
}

.run-command-btn:disabled .dots-border::before {
  animation: none;
}

.run-command-btn .prompt-sign {
  position: relative;
  z-index: 1;
}

.command-preview {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.run-play {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ED9839;
  color: #0f1016;
  position: relative;
  z-index: 1;
  transition: transform 0.2s ease;
}

.run-command-btn:hover:not(:disabled) .run-play {
  transform: scale(1.1);
}

.upgrade-explanation {
  margin-top: 16px;
  padding: 12px 14px;
  background: rgba(119, 202, 189, 0.06);
  border: 1px solid rgba(119, 202, 189, 0.15);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  line-height: 1.6;
  animation: line-fade-in 0.3s ease-out;
}

.upgrade-explanation strong {
  color: #77CABD;
  font-weight: 600;
}

@keyframes rotate-border {
  to { transform: rotate(360deg); }
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
  }

  .terminal-content {
    font-size: 0.7rem;
  }
}
</style>
