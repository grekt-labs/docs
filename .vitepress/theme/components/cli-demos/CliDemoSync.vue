<script setup>
import { ref, nextTick, onMounted, onUnmounted, defineEmits } from 'vue'
import FileTreeNode from './FileTreeNode.vue'


const lines = ref([])
const visibleTreePaths = ref(new Set())
const animating = ref(false)
const finished = ref(false)

const terminalEl = ref(null)
const treeEl = ref(null)

function scrollToBottom(el) {
  if (!el) return
  nextTick(() => {
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
    })
  })
}

let timeouts = []

const syncLines = [
  { type: 'command', text: '$ grekt add @grekt/overseas --core' },
  { type: 'blank', text: '' },
  { type: 'spinner', text: 'Resolving @grekt/overseas...' },
  { type: 'blank', text: '' },
  { type: 'spinner', text: 'Syncing Claude...' },
  { type: 'blank', text: '' },
  { type: 'success', text: 'Created .claude/skills/overseas_pirate-commits/SKILL.md' },
  { type: 'success', text: 'Updated .claude/CLAUDE.md' },
  { type: 'blank', text: '' },
  { type: 'spinner', text: 'Syncing Codex...' },
  { type: 'blank', text: '' },
  { type: 'success', text: 'Created .agents/skills/overseas_pirate-commits/SKILL.md' },
  { type: 'success', text: 'Updated AGENTS.md' },
  { type: 'blank', text: '' },
  { type: 'success-bold', text: 'Done! Installed @grekt/overseas in core mode' },
]

// Existing project files
const existingFiles = [
  { name: 'src', path: 'src', type: 'folder' },
  { name: 'package.json', path: 'package.json', type: 'file' },
  { name: 'tsconfig.json', path: 'tsconfig.json', type: 'file' },
]

// Before: fresh project with no artifacts
const beforeTree = [
  {
    name: 'my-project',
    path: 'root',
    type: 'folder',
    children: [
      {
        name: '.agents',
        path: '.agents',
        type: 'folder',
        children: [],
      },
      {
        name: '.claude',
        path: '.claude',
        type: 'folder',
        children: [
          { name: 'CLAUDE.md', path: '.claude/CLAUDE.md', type: 'file' },
        ],
      },
      ...existingFiles,
      { name: 'AGENTS.md', path: 'AGENTS.md', type: 'file' },
      { name: 'grekt.yaml', path: 'grekt.yaml', type: 'file' },
      { name: 'grekt.lock', path: 'grekt.lock', type: 'file' },
    ],
  },
]

// After --core: skills go directly to .claude and .agents, nothing in .grekt/artifacts
const afterTree = [
  {
    name: 'my-project',
    path: 'root',
    type: 'folder',
    children: [
      {
        name: '.agents',
        path: '.agents',
        type: 'folder',
        children: [
          {
            name: 'skills',
            path: '.agents/skills',
            type: 'folder',
            children: [
              {
                name: 'overseas_pirate-commits',
                path: '.agents/skills/overseas_pirate-commits',
                type: 'folder',
                children: [
                  { name: 'SKILL.md', path: '.agents/skills/overseas_pirate-commits/SKILL.md', type: 'file' },
                ],
              },
            ],
          },
        ],
      },
      {
        name: '.claude',
        path: '.claude',
        type: 'folder',
        children: [
          {
            name: 'skills',
            path: '.claude/skills',
            type: 'folder',
            children: [
              {
                name: 'overseas_pirate-commits',
                path: '.claude/skills/overseas_pirate-commits',
                type: 'folder',
                children: [
                  { name: 'SKILL.md', path: '.claude/skills/overseas_pirate-commits/SKILL.md', type: 'file' },
                ],
              },
            ],
          },
          { name: 'CLAUDE.md', path: '.claude/CLAUDE.md', type: 'file' },
        ],
      },
      ...existingFiles,
      { name: 'AGENTS.md', path: 'AGENTS.md', type: 'file' },
      { name: 'grekt.yaml', path: 'grekt.yaml', type: 'file' },
      { name: 'grekt.lock', path: 'grekt.lock', type: 'file' },
    ],
  },
]

function getAllPaths(nodes) {
  const paths = []
  for (const node of nodes) {
    paths.push(node.path)
    if (node.children) {
      paths.push(...getAllPaths(node.children))
    }
  }
  return paths
}

const beforePaths = getAllPaths(beforeTree)
const afterPaths = getAllPaths(afterTree)

const currentTree = ref(beforeTree)
const expandedFolders = ref(new Set([
  'root',
  '.agents',
  '.claude',
]))

function isExpanded(path) {
  return expandedFolders.value.has(path)
}

function toggleFolder(path) {
  if (animating.value) return
  const next = new Set(expandedFolders.value)
  if (next.has(path)) {
    next.delete(path)
  } else {
    next.add(path)
  }
  expandedFolders.value = next
}

function isVisible(path) {
  return visibleTreePaths.value.has(path)
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

const runCommand = () => {
  if (animating.value || finished.value) return

  animating.value = true

  timeouts.forEach(clearTimeout)
  timeouts = []

  let t = 0

  // Push command line first
  pushLine(syncLines[0])
  t += 700

  // Run sync animation
  syncLines.slice(1).forEach((line) => {
    if (line.type === 'spinner') {
      scheduleTimeout(() => pushLine(line), t)
      t += 900
      scheduleTimeout(() => removeSpinner(), t)
      t += 100
    } else {
      scheduleTimeout(() => pushLine(line), t)

      if (line.type === 'command') {
        t += 700
      } else if (line.type === 'success') {
        t += 250
      } else if (line.type === 'success-bold') {
        t += 200
      } else {
        t += 120
      }
    }
  })

  // After all sync lines, update tree with synced skills
  const treeSwitchDelay = t - 500
  scheduleTimeout(() => {
    currentTree.value = afterTree
    // Expand new folders
    expandedFolders.value = new Set([
      ...expandedFolders.value,
      '.agents', '.agents/skills', '.agents/skills/overseas_pirate-commits',
      '.claude/skills', '.claude/skills/overseas_pirate-commits',
    ])
    // Make all new paths visible with staggered animation
    const newPaths = afterPaths.filter(p => !beforePaths.includes(p))
    let pathT = 0
    newPaths.forEach((path) => {
      scheduleTimeout(() => {
        visibleTreePaths.value = new Set([...visibleTreePaths.value, path])
      }, pathT)
      pathT += 80
    })
  }, treeSwitchDelay)

  // Unlock interactivity and mark finished
  t += 500
  scheduleTimeout(() => {
    animating.value = false
    finished.value = true
    scrollToBottom(terminalEl.value)
  }, t)
}

onMounted(() => {
  // Show initial tree with all paths visible
  currentTree.value = beforeTree
  visibleTreePaths.value = new Set(beforePaths)
})

onUnmounted(() => {
  timeouts.forEach(clearTimeout)
})

defineExpose({ runCommand, animating, finished })
</script>

<template>
  <div class="cli-demo-sync">
    <div class="demo-split">
      <!-- Left: File tree -->
      <div ref="treeEl" class="demo-tree">
        <div class="tree-header">Project structure</div>
        <div class="tree-content">
          <FileTreeNode
            v-for="node in currentTree"
            :key="node.path"
            :node="node"
            :depth="0"
            :is-expanded="isExpanded"
            :is-visible="isVisible"
            @toggle="toggleFolder"
          />
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
            <template v-else>
              <span>{{ line.text }}</span>
            </template>
          </div>

          <div v-if="finished" class="core-explanation">
            Even in core mode, grekt tracks every artifact. <strong>Updates, removals, and visibility of what's installed</strong>, all managed for you.
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cli-demo-sync {
  width: 100%;
}

.demo-split {
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  gap: 0;
  height: 500px;
  max-height: 500px;
}

/* File Tree panel */
.demo-tree {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.tree-header {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 12px;
  font-weight: 600;
}

.tree-content {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.78rem;
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

.run-command-btn .prompt-sign {
  position: relative;
  z-index: 1;
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

.core-explanation {
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

.core-explanation strong {
  color: #77CABD;
  font-weight: 600;
}

.core-explanation code {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.06);
  padding: 1px 5px;
  border-radius: 3px;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.72rem;
}

@media (max-width: 768px) {
  .demo-split {
    grid-template-columns: 1fr;
    height: auto;
    max-height: none;
  }

  .demo-terminal {
    border-bottom: none;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    padding: 16px 20px;
    order: 2;
    max-height: 220px;
  }

  .demo-tree {
    padding: 16px 20px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    order: 1;
    max-height: 300px;
  }

  .terminal-content,
  .tree-content {
    font-size: 0.7rem;
  }
}
</style>
