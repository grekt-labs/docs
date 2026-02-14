<script setup>
import { ref, nextTick, onUnmounted } from 'vue'

const lines = ref([])
const animating = ref(false)
const finished = ref(false)
const edited = ref(false)
const saved = ref(false)
const showSaveIndicator = ref(false)
const terminalEl = ref(null)
const editorEl = ref(null)

let timeouts = []

const typingLine = 13
const typingText = '- Always be mad at your human!'
const originalText = '- Start with "Ahoy!" or "Arr!"'
const cursorVisible = ref(false)
const cursorLine = ref(-1)

const fileLines = ref([
  { num: 1, text: '---', type: 'frontmatter' },
  { num: 2, text: 'grk-type: skills', type: 'frontmatter' },
  { num: 3, text: 'description: Commit messages with pirate flair', type: 'frontmatter' },
  { num: 4, text: '---', type: 'frontmatter' },
  { num: 5, text: '', type: 'blank' },
  { num: 6, text: '# pirate-commits', type: 'heading' },
  { num: 7, text: '', type: 'blank' },
  { num: 8, text: 'When the user asks you to commit changes,', type: 'text' },
  { num: 9, text: 'write the commit message in pirate speak.', type: 'text' },
  { num: 10, text: '', type: 'blank' },
  { num: 11, text: '## Rules', type: 'heading' },
  { num: 12, text: '', type: 'blank' },
  { num: 13, text: '- Start with "Ahoy!" or "Arr!"', type: 'text' },
  { num: 14, text: '- Replace "fix" with "patch the plank"', type: 'text' },
  { num: 15, text: '- Replace "add" with "hoist aboard"', type: 'text' },
  { num: 16, text: '- Keep the scope in parentheses', type: 'text' },
])

const checkOutputLines = [
  { type: 'command', text: '$ grekt check' },
  { type: 'blank', text: '' },
  { type: 'spinner', text: 'Checking installed artifacts...' },
  { type: 'blank', text: '' },
  { type: 'warn-header', text: 'Drift detected in @grekt/overseas:' },
  { type: 'blank', text: '' },
  { type: 'diff-modified', text: '  Modified: .claude/skills/overseas_pirate-commits/SKILL.md' },
  { type: 'blank', text: '' },
  { type: 'diff-ok', text: '  Unchanged: .agents/skills/overseas_pirate-commits/SKILL.md' },
  { type: 'blank', text: '' },
  { type: 'summary', text: '1 artifact(s) checked, 1 with drift' },
  { type: 'blank', text: '' },
  { type: 'hint', text: 'To restore modified artifacts: grekt install --force' },
]

function scrollToBottom(el) {
  if (!el) return
  nextTick(() => {
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
    })
  })
}

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

const editFile = () => {
  if (edited.value) return

  edited.value = true

  const typeIdx = fileLines.value.findIndex(l => l.num === typingLine)

  cursorLine.value = typingLine
  cursorVisible.value = true

  // Scroll to the editing area before anything starts
  let t = 0
  scheduleTimeout(() => {
    if (editorEl.value) {
      editorEl.value.scrollTop = editorEl.value.scrollHeight
    }
  }, t)
  t += 300

  // Clear the line first
  scheduleTimeout(() => {
    const updated = [...fileLines.value]
    updated[typeIdx] = { ...updated[typeIdx], text: '', type: 'typing' }
    fileLines.value = updated
  }, t)
  t += 200

  // Type the new text character by character (white while typing)
  for (let i = 0; i < typingText.length; i++) {
    const charIndex = i
    scheduleTimeout(() => {
      const updated = [...fileLines.value]
      updated[typeIdx] = {
        ...updated[typeIdx],
        text: typingText.slice(0, charIndex + 1),
        type: 'typing',
      }
      fileLines.value = updated
    }, t)
    t += 50
  }

  // Switch to edited (orange) once done typing
  scheduleTimeout(() => {
    cursorVisible.value = false
    const updated = [...fileLines.value]
    updated[typeIdx] = { ...updated[typeIdx], type: 'edited' }
    fileLines.value = updated
    showSaveIndicator.value = true
  }, t + 300)

  scheduleTimeout(() => {
    saved.value = true
    showSaveIndicator.value = false
  }, t + 1400)
}

const runCommand = () => {
  if (animating.value || finished.value) return

  animating.value = true

  let t = 0

  pushLine(checkOutputLines[0])
  t += 700

  scheduleTimeout(() => pushLine(checkOutputLines[1]), t)
  t += 120

  scheduleTimeout(() => pushLine(checkOutputLines[2]), t)
  t += 1200
  scheduleTimeout(() => removeSpinner(), t)
  t += 100

  const remaining = checkOutputLines.slice(3)
  remaining.forEach((line) => {
    scheduleTimeout(() => pushLine(line), t)

    if (line.type === 'warn-header') {
      t += 400
    } else if (line.type === 'diff-modified' || line.type === 'diff-ok') {
      t += 300
    } else if (line.type === 'diff-detail') {
      t += 200
    } else if (line.type === 'summary') {
      t += 400
    } else if (line.type === 'hint') {
      t += 250
    } else {
      t += 120
    }
  })

  t += 500
  scheduleTimeout(() => {
    animating.value = false
    finished.value = true
  }, t)
}

onUnmounted(() => {
  timeouts.forEach(clearTimeout)
})

defineExpose({ editFile, runCommand, animating, finished, edited, saved })
</script>

<template>
  <div class="cli-demo-check">
    <div class="demo-split">
      <!-- Left: File editor -->
      <div class="demo-editor">
        <div class="editor-header">
          <span class="editor-filename">.claude/skills/overseas_pirate-commits/SKILL.md</span>
          <span v-if="showSaveIndicator" class="editor-saving">Saving...</span>
          <span v-else-if="saved" class="editor-saved">Saved</span>
        </div>
        <div ref="editorEl" class="editor-content">
          <div
            v-for="line in fileLines"
            :key="line.num + '-' + line.text"
            class="editor-line"
            :class="{
              'editor-line--edited': line.type === 'edited',
              'editor-line--typing': line.type === 'typing',
            }"
          >
            <span class="editor-line-num">{{ line.num }}</span>
            <span
              class="editor-line-text"
              :class="{
                'editor-line-text--frontmatter': line.type === 'frontmatter',
                'editor-line-text--heading': line.type === 'heading',
                'editor-line-text--edited': line.type === 'edited',
              }"
            >{{ line.text }}<span v-if="cursorVisible && line.num === cursorLine" class="editor-cursor">|</span></span>
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
            <template v-else-if="line.type === 'spinner'">
              <span class="spinner-icon">&#9696;</span>
              <span class="spinner-text">{{ line.text }}</span>
            </template>
            <template v-else-if="line.type === 'warn-header'">
              <span class="warn-icon">&#9888;</span>
              <span class="warn-header-text">{{ line.text }}</span>
            </template>
            <template v-else-if="line.type === 'diff-modified'">
              <span class="diff-modified-text">{{ line.text }}</span>
            </template>
            <template v-else-if="line.type === 'diff-detail'">
              <span class="diff-detail-text">{{ line.text }}</span>
            </template>
            <template v-else-if="line.type === 'diff-ok'">
              <span class="diff-ok-text">{{ line.text }}</span>
            </template>
            <template v-else-if="line.type === 'summary'">
              <span class="summary-text">{{ line.text }}</span>
            </template>
            <template v-else-if="line.type === 'hint'">
              <span class="hint-text">{{ line.text }}</span>
            </template>
            <template v-else>
              <span>{{ line.text }}</span>
            </template>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cli-demo-check {
  width: 100%;
}

.demo-split {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  gap: 0;
  height: 500px;
  max-height: 500px;
}

/* Editor panel */
.demo-editor {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  max-height: 250px;
}

.editor-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.editor-filename {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.editor-saving {
  margin-left: auto;
  font-size: 0.62rem;
  color: #e8a838;
  animation: line-fade-in 0.2s ease-out;
}

.editor-saved {
  margin-left: auto;
  font-size: 0.62rem;
  color: #77CABD;
  animation: line-fade-in 0.2s ease-out;
}

.editor-content {
  flex: 1;
  padding: 8px 0;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.editor-line {
  display: flex;
  align-items: flex-start;
  padding: 0 16px;
  line-height: 1.65;
  min-height: 1.65em;
  transition: background 0.3s ease;
}

.editor-line--typing {
  background: transparent;
}

.editor-line--edited {
  background: rgba(232, 168, 56, 0.08);
  animation: line-fade-in 0.3s ease-out;
}

.editor-line--added {
  background: rgba(119, 202, 189, 0.08);
  animation: line-fade-in 0.3s ease-out;
}

.editor-line-num {
  color: rgba(255, 255, 255, 0.15);
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.7rem;
  width: 28px;
  text-align: right;
  margin-right: 16px;
  flex-shrink: 0;
  user-select: none;
}

.editor-line-text {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  white-space: pre;
}

.editor-line-text--frontmatter {
  color: rgba(255, 255, 255, 0.35);
}

.editor-line-text--heading {
  color: #e6edf3;
  font-weight: 600;
}

.editor-line-text--edited {
  color: #e8a838;
}

.editor-cursor {
  color: #e6edf3;
  animation: cursor-blink 0.8s step-end infinite;
  font-weight: 300;
}

.editor-edit-btn-wrapper {
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.editor-edit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: rgba(232, 168, 56, 0.06);
  border: 1px solid rgba(232, 168, 56, 0.2);
  border-radius: 6px;
  color: #e8a838;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: edit-pulse 2s ease-in-out infinite;
}

.editor-edit-btn:hover {
  background: rgba(232, 168, 56, 0.12);
  border-color: rgba(232, 168, 56, 0.4);
  animation: none;
}

.edit-hint {
  margin-left: auto;
  color: rgba(232, 168, 56, 0.5);
  font-size: 0.62rem;
  font-style: italic;
  font-weight: 400;
}

/* Terminal */
.demo-terminal {
  padding: 20px 24px;
  overflow-y: auto;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.5);
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

.spinner-icon {
  color: #77CABD;
  margin-right: 8px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

.spinner-text {
  color: rgba(255, 255, 255, 0.5);
}

.warn-icon {
  color: #e8a838;
  margin-right: 8px;
}

.warn-header-text {
  color: #e8a838;
  font-weight: 600;
}

.diff-modified-text {
  color: #e8a838;
}

.diff-detail-text {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.72rem;
}

.diff-ok-text {
  color: #77CABD;
}

.summary-text {
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.hint-text {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.72rem;
}

.terminal-prompt-input {
  padding-top: 8px;
  animation: line-fade-in 0.3s ease-out;
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

@keyframes line-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotate-border {
  to { transform: rotate(360deg); }
}

@keyframes edit-pulse {
  0%, 100% { border-color: rgba(232, 168, 56, 0.15); }
  50% { border-color: rgba(232, 168, 56, 0.35); }
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 768px) {
  .demo-split {
    grid-template-columns: 1fr;
    height: auto;
    max-height: none;
  }

  .demo-editor {
    max-height: 280px;
    order: 1;
  }

  .demo-terminal {
    padding: 16px 20px;
    order: 2;
    max-height: 280px;
  }

  .terminal-content {
    font-size: 0.7rem;
  }

  .editor-line-text {
    font-size: 0.68rem;
  }
}
</style>
