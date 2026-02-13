<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
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
  { type: 'command', text: '$ grekt sync' },
  { type: 'blank', text: '' },
  { type: 'spinner', text: 'Syncing Claude...' },
  { type: 'blank', text: '' },
  { type: 'success', text: 'Created .claude/skills/superpowers_systematic-debugging.md' },
  { type: 'success', text: 'Created .claude/skills/superpowers_test-driven-development.md' },
  { type: 'success', text: 'Created .claude/skills/superpowers_brainstorming.md' },
  { type: 'success', text: 'Updated .claude/CLAUDE.md' },
  { type: 'blank', text: '' },
  { type: 'spinner', text: 'Syncing Codex...' },
  { type: 'blank', text: '' },
  { type: 'success', text: 'Updated AGENTS.md' },
  { type: 'blank', text: '' },
  { type: 'success-bold', text: 'Sync complete!' },
]

// Existing project files
const existingFiles = [
  {
    name: 'src',
    path: 'src',
    type: 'folder',
    children: [
      { name: 'index.ts', path: 'src/index.ts', type: 'file' },
      { name: 'app.ts', path: 'src/app.ts', type: 'file' },
      { name: 'utils.ts', path: 'src/utils.ts', type: 'file' },
    ],
  },
  { name: 'package.json', path: 'package.json', type: 'file' },
  { name: 'tsconfig.json', path: 'tsconfig.json', type: 'file' },
]

// Before sync: artifacts exist but not synced to targets
const beforeTree = [
  {
    name: 'my-project',
    path: 'root',
    type: 'folder',
    children: [
      {
        name: '.grekt',
        path: '.grekt',
        type: 'folder',
        tag: '(gitignored)',
        children: [
          { name: 'index', path: '.grekt/index', type: 'file' },
          {
            name: 'artifacts',
            path: '.grekt/artifacts',
            type: 'folder',
            children: [
              {
                name: '@obra',
                path: '.grekt/artifacts/@obra',
                type: 'folder',
                children: [
                  {
                    name: 'superpowers',
                    path: '.grekt/artifacts/@obra/superpowers',
                    type: 'folder',
                    children: [
                      { name: 'grekt.yaml', path: '.grekt/artifacts/@obra/superpowers/grekt.yaml', type: 'file' },
                      {
                        name: 'skills',
                        path: '.grekt/artifacts/@obra/superpowers/skills',
                        type: 'folder',
                        children: [
                          { name: 'systematic-debugging.md', path: '.grekt/artifacts/@obra/superpowers/skills/systematic-debugging.md', type: 'file' },
                          { name: 'test-driven-development.md', path: '.grekt/artifacts/@obra/superpowers/skills/tdd.md', type: 'file' },
                          { name: 'brainstorming.md', path: '.grekt/artifacts/@obra/superpowers/skills/brainstorming.md', type: 'file' },
                        ],
                      },
                    ],
                  },
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
                name: 'grekt',
                path: '.claude/skills/grekt',
                type: 'folder',
                children: [
                  { name: 'SKILL.md', path: '.claude/skills/grekt/SKILL.md', type: 'file' },
                ],
              },
            ],
          },
          { name: 'CLAUDE.md', path: '.claude/CLAUDE.md', type: 'file' },
          { name: 'settings.json', path: '.claude/settings.json', type: 'file' },
        ],
      },
      ...existingFiles,
      { name: 'AGENTS.md', path: 'AGENTS.md', type: 'file' },
      { name: 'grekt.yaml', path: 'grekt.yaml', type: 'file' },
      { name: 'grekt.lock', path: 'grekt.lock', type: 'file' },
    ],
  },
]

// After sync: skills synced to .claude/skills/ and AGENTS.md updated
const afterTree = [
  {
    name: 'my-project',
    path: 'root',
    type: 'folder',
    children: [
      {
        name: '.grekt',
        path: '.grekt',
        type: 'folder',
        tag: '(gitignored)',
        children: [
          { name: 'index', path: '.grekt/index', type: 'file' },
          {
            name: 'artifacts',
            path: '.grekt/artifacts',
            type: 'folder',
            children: [
              {
                name: '@obra',
                path: '.grekt/artifacts/@obra',
                type: 'folder',
                children: [
                  {
                    name: 'superpowers',
                    path: '.grekt/artifacts/@obra/superpowers',
                    type: 'folder',
                    children: [
                      { name: 'grekt.yaml', path: '.grekt/artifacts/@obra/superpowers/grekt.yaml', type: 'file' },
                      {
                        name: 'skills',
                        path: '.grekt/artifacts/@obra/superpowers/skills',
                        type: 'folder',
                        children: [
                          { name: 'systematic-debugging.md', path: '.grekt/artifacts/@obra/superpowers/skills/systematic-debugging.md', type: 'file' },
                          { name: 'test-driven-development.md', path: '.grekt/artifacts/@obra/superpowers/skills/tdd.md', type: 'file' },
                          { name: 'brainstorming.md', path: '.grekt/artifacts/@obra/superpowers/skills/brainstorming.md', type: 'file' },
                        ],
                      },
                    ],
                  },
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
                name: 'grekt',
                path: '.claude/skills/grekt',
                type: 'folder',
                children: [
                  { name: 'SKILL.md', path: '.claude/skills/grekt/SKILL.md', type: 'file' },
                ],
              },
              { name: 'superpowers_systematic-debugging.md', path: '.claude/skills/sp-debug.md', type: 'file' },
              { name: 'superpowers_test-driven-development.md', path: '.claude/skills/sp-tdd.md', type: 'file' },
              { name: 'superpowers_brainstorming.md', path: '.claude/skills/sp-brain.md', type: 'file' },
            ],
          },
          { name: 'CLAUDE.md', path: '.claude/CLAUDE.md', type: 'file' },
          { name: 'settings.json', path: '.claude/settings.json', type: 'file' },
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
  'src',
  '.grekt',
  '.grekt/artifacts',
  '.grekt/artifacts/@obra',
  '.grekt/artifacts/@obra/superpowers',
  '.grekt/artifacts/@obra/superpowers/skills',
  '.claude',
  '.claude/skills',
  '.claude/skills/grekt',
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

  // After Claude sync lines, update tree with synced skills
  const claudeSyncEnd = 700 + 120 + 900 + 100 + 120 + (250 * 3) + 250 + 120
  scheduleTimeout(() => {
    currentTree.value = afterTree
    // Make all paths visible
    const newPaths = afterPaths.filter(p => !beforePaths.includes(p))
    let pathT = 0
    newPaths.forEach((path) => {
      scheduleTimeout(() => {
        visibleTreePaths.value = new Set([...visibleTreePaths.value, path])
      }, pathT)
      pathT += 80
    })
  }, claudeSyncEnd)

  // Unlock interactivity and mark finished
  t += 500
  scheduleTimeout(() => {
    animating.value = false
    finished.value = true
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

          <div v-if="!finished" class="terminal-prompt-input" :class="{ 'terminal-prompt-input--disabled': animating }">
            <button class="run-command-btn" :disabled="animating" @click="runCommand">
              <span class="prompt-sign">$</span>
              <span class="command-preview">grekt sync</span>
              <span class="run-hint">click to run</span>
            </button>
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
  grid-template-columns: 1.2fr 1fr;
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
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding: 16px 20px;
    order: 1;
    max-height: 280px;
  }

  .demo-tree {
    padding: 16px 20px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    order: 2;
    max-height: 260px;
  }

  .terminal-content,
  .tree-content {
    font-size: 0.7rem;
  }
}
</style>
