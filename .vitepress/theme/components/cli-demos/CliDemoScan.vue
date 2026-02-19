<script setup>
import { ref, onUnmounted } from 'vue'

const lines = ref([])
const animating = ref(false)
const finished = ref(false)
const terminalEl = ref(null)

let timeouts = []

const scheduleTimeout = (fn, delay) => {
  const id = setTimeout(fn, delay)
  timeouts.push(id)
  return id
}

const pushLine = (line) => {
  lines.value.push(line)
}

const scanOutput = [
  { type: 'command', text: '$ grekt scan' },
  { type: 'blank', text: '' },
  { type: 'spinner', text: 'Scanning 4 artifacts...' },
  { type: 'blank', text: '' },
  { type: 'ok', text: '  ✓ @author/cursor-rules       100  certified' },
  { type: 'ok', text: '  ✓ @author/eslint-config        85  conditional  2 findings' },
  { type: 'warn', text: '  ⚠ @other/sketchy-thing         35  suspicious   5 findings' },
  { type: 'danger', text: '  ⚠ @other/malware-lol           12  rejected     8 findings' },
  { type: 'blank', text: '' },
  { type: 'idle', text: '' },
]

const runCommand = () => {
  if (animating.value) return
  animating.value = true
  lines.value = []

  let delay = 0

  scanOutput.forEach((line, i) => {
    const lineDelay = line.type === 'spinner' ? 800 :
                      line.type === 'ok' ? 400 :
                      line.type === 'warn' ? 500 :
                      line.type === 'danger' ? 600 :
                      line.type === 'command' ? 100 :
                      80

    delay += lineDelay

    scheduleTimeout(() => {
      pushLine(line)

      if (i === scanOutput.length - 1) {
        animating.value = false
        finished.value = true
      }
    }, delay)
  })
}

defineExpose({ runCommand, animating, finished })

onUnmounted(() => {
  timeouts.forEach(clearTimeout)
})
</script>

<template>
  <div ref="terminalEl" class="cli-demo-scan">
    <div v-if="lines.length === 0" class="terminal-line terminal-line--idle">
      <span class="prompt-sign">$</span>
      <span class="idle-cursor">&#9612;</span>
    </div>
    <template v-for="(line, i) in lines" :key="i">
      <div v-if="line.type === 'command'" class="terminal-line terminal-line--command">
        <span class="prompt-sign">$</span>
        <span class="command-text">{{ line.text.slice(2) }}</span>
      </div>
      <div v-else-if="line.type === 'idle'" class="terminal-line terminal-line--idle">
        <span class="prompt-sign">$</span>
        <span class="idle-cursor">&#9612;</span>
      </div>
      <div v-else :class="['terminal-line', `terminal-line--${line.type}`]">
        {{ line.text }}
      </div>
    </template>
  </div>
</template>

<style scoped>
.cli-demo-scan {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.8rem;
  line-height: 1.6;
  padding: 16px;
  min-height: 200px;
  white-space: pre;
}

.prompt-sign {
  color: #77CABD;
  margin-right: 8px;
  font-weight: 600;
}

.idle-cursor {
  color: rgba(255, 255, 255, 0.7);
}

.terminal-line--idle .idle-cursor {
  animation: blink-cursor 1s step-end infinite;
}

.terminal-line--command .idle-cursor {
  animation: none;
}

@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.command-text {
  color: rgba(255, 255, 255, 0.9);
}

.terminal-line--blank {
  height: 0.8em;
}

.terminal-line--spinner {
  color: #77CABD;
}

.terminal-line--ok {
  color: #39EDAA;
}

.terminal-line--warn {
  color: #ED9839;
}

.terminal-line--danger {
  color: #ef4444;
}
</style>
