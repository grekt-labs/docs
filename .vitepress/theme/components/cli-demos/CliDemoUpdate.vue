<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

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
  { type: 'command', text: '$ grekt upgrade' },
  { type: 'blank', text: '' },
  { type: 'spinner', text: 'Checking for updates...' },
  { type: 'blank', text: '' },
  { type: 'info', text: 'Upgrading 2 artifact(s):' },
  { type: 'blank', text: '' },
  { type: 'upgrade-item', text: '  @obra/superpowers: 1.0.0 → 1.2.0', from: '1.0.0', to: '1.2.0', name: '@obra/superpowers' },
  { type: 'upgrade-item', text: '  @grekt/code-reviewer: 2.1.0 → 2.3.0', from: '2.1.0', to: '2.3.0', name: '@grekt/code-reviewer' },
  { type: 'blank', text: '' },
  { type: 'spinner', text: 'Downloading @obra/superpowers...' },
  { type: 'spinner', text: 'Downloading @grekt/code-reviewer...' },
  { type: 'blank', text: '' },
  { type: 'success-section', text: 'Upgraded:' },
  { type: 'success', text: '@obra/superpowers: 1.0.0 → 1.2.0' },
  { type: 'success', text: '@grekt/code-reviewer: 2.1.0 → 2.3.0' },
  { type: 'blank', text: '' },
  { type: 'success', text: 'Created .claude/skills/superpowers_writing-plans.md' },
  { type: 'info', text: '  (new skill added in 1.2.0)' },
  { type: 'success', text: 'Updated .claude/skills/superpowers_systematic-debugging.md' },
  { type: 'success', text: 'Updated .claude/agents/code-reviewer_review.md' },
  { type: 'success', text: 'Updated AGENTS.md' },
  { type: 'blank', text: '' },
  { type: 'success-bold', text: 'Sync complete!' },
]

const artifacts = ref([])

const artifactList = [
  {
    name: '@obra/superpowers',
    from: '1.0.0',
    to: '1.2.0',
    status: 'pending',
    changes: ['+1 new skill', '~1 updated skill'],
  },
  {
    name: '@grekt/code-reviewer',
    from: '2.1.0',
    to: '2.3.0',
    status: 'pending',
    changes: ['~1 updated agent'],
  },
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
  artifacts.value = []
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

  // "Upgrading 2 artifact(s):"
  scheduleTimeout(() => pushLine(upgradeLines[4]), t)
  t += 300

  // Blank
  scheduleTimeout(() => pushLine(upgradeLines[5]), t)
  t += 120

  // Upgrade items + show cards
  scheduleTimeout(() => {
    pushLine(upgradeLines[6])
    artifacts.value = [{ ...artifactList[0] }]
  }, t)
  t += 300

  scheduleTimeout(() => {
    pushLine(upgradeLines[7])
    artifacts.value = [{ ...artifactList[0] }, { ...artifactList[1] }]
  }, t)
  t += 400

  // Blank
  scheduleTimeout(() => pushLine(upgradeLines[8]), t)
  t += 120

  // Spinners: downloading
  scheduleTimeout(() => pushLine(upgradeLines[9]), t)
  t += 200
  scheduleTimeout(() => pushLine(upgradeLines[10]), t)
  t += 1000

  // Remove spinners
  scheduleTimeout(() => removeAllSpinners(), t)
  t += 100

  // Blank
  scheduleTimeout(() => pushLine(upgradeLines[11]), t)
  t += 120

  // "Upgraded:" header
  scheduleTimeout(() => pushLine(upgradeLines[12]), t)
  t += 200

  // Success lines + update card status
  scheduleTimeout(() => {
    pushLine(upgradeLines[13])
    artifacts.value = artifacts.value.map((a, i) =>
      i === 0 ? { ...a, status: 'done' } : a
    )
  }, t)
  t += 250

  scheduleTimeout(() => {
    pushLine(upgradeLines[14])
    artifacts.value = artifacts.value.map((a, i) =>
      i === 1 ? { ...a, status: 'done' } : a
    )
  }, t)
  t += 400

  // Blank
  scheduleTimeout(() => pushLine(upgradeLines[15]), t)
  t += 120

  // Sync output
  for (let i = 16; i < upgradeLines.length; i++) {
    const line = upgradeLines[i]
    scheduleTimeout(() => pushLine(line), t)
    t += line.type === 'success-bold' ? 200 : 200
  }

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
  <div class="cli-demo-update">
    <div class="demo-split">
      <!-- Left: Artifact cards -->
      <div class="demo-artifacts">
        <div class="artifacts-header">Artifacts</div>
        <div v-if="artifacts.length === 0" class="artifacts-empty">
          <span class="artifacts-empty-text">Checking registry...</span>
        </div>
        <div
          v-for="(artifact, index) in artifacts"
          :key="artifact.name"
          class="artifact-card"
          :class="{ 'artifact-card--done': artifact.status === 'done' }"
        >
          <div class="artifact-name">{{ artifact.name }}</div>
          <div class="artifact-version">
            <span class="version-from">{{ artifact.from }}</span>
            <span class="version-arrow">→</span>
            <span class="version-to">{{ artifact.to }}</span>
          </div>
          <div class="artifact-changes">
            <div
              v-for="change in artifact.changes"
              :key="change"
              class="artifact-change"
              :class="{
                'artifact-change--add': change.startsWith('+'),
                'artifact-change--update': change.startsWith('~'),
              }"
            >
              {{ change }}
            </div>
          </div>
          <div class="artifact-status">
            <span v-if="artifact.status === 'done'" class="status-done">&#10003; upgraded</span>
            <span v-else class="status-pending">pending</span>
          </div>
        </div>
      </div>

      <!-- Right: Terminal output -->
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

          <div v-if="!finished" class="terminal-prompt-input" :class="{ 'terminal-prompt-input--disabled': animating }">
            <button class="run-command-btn" :disabled="animating" @click="runCommand">
              <span class="prompt-sign">$</span>
              <span class="command-preview">grekt upgrade</span>
              <span class="run-hint">click to run</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cli-demo-update {
  width: 100%;
}

.demo-split {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 0;
  height: 500px;
  max-height: 500px;
}

/* Artifact cards */
.demo-artifacts {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.artifacts-header {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 600;
}

.artifacts-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.artifacts-empty-text {
  color: rgba(255, 255, 255, 0.15);
  font-size: 0.75rem;
  font-style: italic;
}

.artifact-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 14px 16px;
  animation: card-fade-in 0.3s ease-out;
  transition: border-color 0.3s ease;
}

.artifact-card--done {
  border-color: rgba(119, 202, 189, 0.25);
}

.artifact-name {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.78rem;
  font-weight: 600;
  color: #e6edf3;
  margin-bottom: 6px;
}

.artifact-version {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.version-from {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
}

.version-arrow {
  color: #77CABD;
  font-size: 0.75rem;
}

.version-to {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.7rem;
  color: #77CABD;
  font-weight: 500;
}

.artifact-changes {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 8px;
}

.artifact-change {
  font-size: 0.65rem;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
}

.artifact-change--add {
  color: #7ee787;
}

.artifact-change--update {
  color: #e8a838;
}

.artifact-status {
  font-size: 0.65rem;
}

.status-done {
  color: #77CABD;
  font-weight: 500;
}

.status-pending {
  color: rgba(255, 255, 255, 0.25);
  font-style: italic;
}

/* Terminal */
.demo-terminal {
  padding: 20px 24px;
  overflow-y: auto;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
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

@keyframes prompt-pulse {
  0%, 100% { border-color: rgba(119, 202, 189, 0.15); }
  50% { border-color: rgba(119, 202, 189, 0.35); }
}

@keyframes line-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes card-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .demo-split {
    grid-template-columns: 1fr;
    height: auto;
    max-height: none;
  }

  .demo-terminal {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding: 16px 20px;
    order: 1;
    max-height: 280px;
  }

  .demo-artifacts {
    padding: 16px 20px;
    border-right: none;
    order: 2;
    max-height: 220px;
  }

  .terminal-content {
    font-size: 0.7rem;
  }
}
</style>
