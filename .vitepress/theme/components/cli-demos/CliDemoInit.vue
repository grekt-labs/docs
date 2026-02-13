<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import FileTreeNode from './FileTreeNode.vue'

const emit = defineEmits(['next-tab'])

const lines = ref([])
const visibleTreePaths = ref(new Set())
const chatMessages = ref({ claude: [], codex: [] })
const animating = ref(false)
const currentStep = ref(0)
const finished = ref(false)
const chatStatus = ref('idle') // 'idle' | 'warning' | 'synced'

const terminalEl = ref(null)
const treeEl = ref(null)
const claudeChatEl = ref(null)
const codexChatEl = ref(null)

// File preview state
const previewTabs = ref([])
const activeTab = ref(null)
const previewVisible = ref(false)

function scrollToBottom(el) {
  if (!el) return
  nextTick(() => {
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
    })
  })
}

let timeouts = []

// Steps the user can trigger
const steps = [
  { type: 'ask-ai', label: 'Tell AI to commit your changes', hint: 'see what happens' },
  { type: 'command', command: 'grekt init', hint: 'Initialize grekt in your project' },
  { type: 'command', command: 'grekt add @grekt/overseas', hint: 'Install an artifact from the registry' },
  { type: 'ask-ai', label: 'Tell AI to commit your changes', hint: 'try again' },
]

// File preview contents
const fileContents = {
  'grekt.yaml': `# grekt.yaml
targets:
  - claude
  - codex

artifacts: {}`,
  'grekt.yaml-after': `# grekt.yaml
targets:
  - claude
  - codex

artifacts:
  @grekt/overseas:
    version: "1.2.0"`,
  'pirate-commits.md': `---
grk-type: skills
name: pirate-commits
description: Commit messages with pirate flair
target: all
---

# Pirate Commits

Write commit messages like a pirate captain.

Rules:
- Use conventional commits (feat, fix, chore...)
- Add pirate flair to the description
- Refer to features as "new sails"
- Refer to fixes as "patching the hull"
- End messages with a pirate exclamation`,
}

// Phase 1: grekt init output
// Options appear unchecked first, then get selected one by one
const initLines = [
  { type: 'blank', text: '' },
  { type: 'info', text: 'Initializing grekt...' },
  { type: 'blank', text: '' },
  { type: 'prompt', text: 'Select targets to configure:' },
  { type: 'blank', text: '' },
  { type: 'option', id: 'claude', label: 'claude', checked: false },
  { type: 'option', id: 'codex', label: 'codex', checked: false },
  { type: 'option', id: 'cursor', label: 'cursor', checked: false },
  { type: 'option', id: 'opencode', label: 'opencode', checked: false },
  { type: 'option-more', text: '    Others...' },
]

// Lines shown after selection is confirmed
const postSelectionLines = [
  { type: 'blank', text: '' },
  { type: 'success', text: 'Created grekt.yaml' },
  { type: 'success', text: 'Created .grekt/' },
  { type: 'success', text: 'Created .claude/' },
  { type: 'success', text: 'Created .agents/' },
  { type: 'success', text: 'Created AGENTS.md' },
  { type: 'blank', text: '' },
  { type: 'success-bold', text: 'grekt initialized successfully!' },
  { type: 'blank', text: '' },
  { type: 'info', text: '  Sync targets: claude, codex' },
  { type: 'info', text: '  Run \'grekt add <artifact>\' to install your first artifact' },
]

// Phase 2: grekt add output
const addLines = [
  { type: 'blank', text: '' },
  { type: 'spinner', text: 'Downloading @grekt/overseas...' },
  { type: 'blank', text: '' },
  { type: 'success', text: 'Installed @grekt/overseas@1.2.0' },
  { type: 'info', text: '  skills: pirate-commits' },
]

// Pre-install chat (each AI commits differently)
const preClaudeMessages = [
  { role: 'user', text: 'Commit my changes' },
  { role: 'assistant', html: 'I\'ll set <strong>"feat: add user authentication flow"</strong> as commit message' },
]

const preCodexMessages = [
  { role: 'user', text: 'Commit my changes' },
  { role: 'assistant', html: 'I\'ll set <strong>"added the login stuff and fixed some things"</strong> as commit message' },
]

// Post-install chat (both follow pirate + conventional commits)
const postClaudeMessages = [
  { role: 'user', text: 'Commit my changes' },
  { role: 'assistant', html: 'I\'ll set <strong>"feat: hoist the auth sails, captain! Ahoy!"</strong> as commit message' },
]

const postCodexMessages = [
  { role: 'user', text: 'Commit my changes' },
  { role: 'assistant', html: 'I\'ll set <strong>"feat: anchor the login flow, matey! Fair winds!"</strong> as commit message' },
]

// Existing project files (visible from the start)
const existingFiles = [
  { name: 'src', path: 'src', type: 'folder' },
  { name: '.env', path: '.env', type: 'file' },
  { name: 'README.md', path: 'README.md', type: 'file' },
]

const existingPaths = ['root', 'src', '.env', 'README.md']

// Phase 1 tree: after init
// grekt init creates .grekt/, target folders (.agents/, .claude/), and config files
const initTree = [
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
          { name: 'artifacts', path: '.grekt/artifacts', type: 'folder', children: [] },
        ],
      },
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

// Phase 2 tree: after grekt add
// The artifact is stored in .grekt/artifacts/ with skills/agents/hooks subfolders
const addTree = [
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
                name: '@grekt',
                path: '.grekt/artifacts/@grekt',
                type: 'folder',
                children: [
                  {
                    name: 'overseas',
                    path: '.grekt/artifacts/@grekt/overseas',
                    type: 'folder',
                    children: [
                      { name: 'grekt.yaml', path: '.grekt/artifacts/@grekt/overseas/grekt.yaml', type: 'file' },
                      {
                        name: 'skills',
                        path: '.grekt/artifacts/@grekt/overseas/skills',
                        type: 'folder',
                        children: [
                          { name: 'pirate-commits.md', path: '.grekt/artifacts/@grekt/overseas/skills/pirate-commits.md', type: 'file' },
                        ],
                      },
                      { name: 'agents', path: '.grekt/artifacts/@grekt/overseas/agents', type: 'folder', children: [] },
                      { name: 'hooks', path: '.grekt/artifacts/@grekt/overseas/hooks', type: 'folder', children: [] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
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

const initPaths = getAllPaths(initTree)
const addPaths = getAllPaths(addTree)

const currentTree = ref(initTree)
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

function pushChat(target, msg) {
  chatMessages.value[target].push(msg)
  const el = target === 'claude' ? claudeChatEl.value : codexChatEl.value
  scrollToBottom(el)
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlightYaml(text) {
  return text.split('\n').map(line => {
    // Comments
    if (line.trimStart().startsWith('#')) {
      return `<span class="hl-comment">${escapeHtml(line)}</span>`
    }
    // Empty line
    if (line.trim() === '') return ''
    // Key: value pairs
    const kvMatch = line.match(/^(\s*)([\w@/.-]+)(\s*:\s*)(.+)?$/)
    if (kvMatch) {
      const [, indent, key, colon, value] = kvMatch
      let valuePart = ''
      if (value) {
        if (value.startsWith('"') || value.startsWith("'")) {
          valuePart = `<span class="hl-string">${escapeHtml(value)}</span>`
        } else if (value === '{}' || value === '[]') {
          valuePart = `<span class="hl-punctuation">${escapeHtml(value)}</span>`
        } else {
          valuePart = `<span class="hl-value">${escapeHtml(value)}</span>`
        }
      }
      return `${indent}<span class="hl-key">${escapeHtml(key)}</span><span class="hl-punctuation">${escapeHtml(colon)}</span>${valuePart}`
    }
    // List items
    const listMatch = line.match(/^(\s*)(- )(.+)$/)
    if (listMatch) {
      const [, indent, dash, item] = listMatch
      return `${indent}<span class="hl-punctuation">${escapeHtml(dash)}</span><span class="hl-value">${escapeHtml(item)}</span>`
    }
    return escapeHtml(line)
  }).join('\n')
}

function highlightMarkdown(text) {
  let inFrontmatter = false
  let frontmatterCount = 0

  return text.split('\n').map(line => {
    // Frontmatter delimiters
    if (line.trim() === '---') {
      frontmatterCount++
      inFrontmatter = frontmatterCount === 1
      return `<span class="hl-frontmatter-delimiter">${escapeHtml(line)}</span>`
    }
    // Inside frontmatter - highlight as YAML
    if (inFrontmatter) {
      const kvMatch = line.match(/^(\s*)([\w-]+)(\s*:\s*)(.+)?$/)
      if (kvMatch) {
        const [, indent, key, colon, value] = kvMatch
        const valuePart = value ? `<span class="hl-frontmatter-value">${escapeHtml(value)}</span>` : ''
        return `${indent}<span class="hl-frontmatter-key">${escapeHtml(key)}</span><span class="hl-punctuation">${escapeHtml(colon)}</span>${valuePart}`
      }
      return `<span class="hl-frontmatter-value">${escapeHtml(line)}</span>`
    }
    // Headers
    if (line.startsWith('#')) {
      return `<span class="hl-md-heading">${escapeHtml(line)}</span>`
    }
    // Empty line
    if (line.trim() === '') return ''
    // List items
    const listMatch = line.match(/^(- )(.+)$/)
    if (listMatch) {
      const [, dash, content] = listMatch
      return `<span class="hl-punctuation">${escapeHtml(dash)}</span><span class="hl-md-text">${escapeHtml(content)}</span>`
    }
    // Label: text
    const labelMatch = line.match(/^(.+?:\s)(.+)$/)
    if (labelMatch) {
      return `<span class="hl-md-bold">${escapeHtml(labelMatch[1])}</span><span class="hl-md-text">${escapeHtml(labelMatch[2])}</span>`
    }
    return `<span class="hl-md-text">${escapeHtml(line)}</span>`
  }).join('\n')
}

function addLineNumbers(highlighted) {
  const lines = highlighted.split('\n')
  return lines.map((line, i) => {
    const num = i + 1
    return `<span class="hl-line"><span class="hl-line-number">${num}</span>${line}</span>`
  }).join('\n')
}

function highlight(fileName, content) {
  let result
  if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) {
    result = highlightYaml(content)
  } else if (fileName.endsWith('.md')) {
    result = highlightMarkdown(content)
  } else {
    result = escapeHtml(content)
  }
  return addLineNumbers(result)
}

const highlightedPreview = ref('')

function addTab(fileName, contentKey) {
  const existing = previewTabs.value.find(t => t.name === fileName)
  if (existing) {
    existing.contentKey = contentKey
    existing.highlighted = highlight(fileName, fileContents[contentKey])
  } else {
    previewTabs.value.push({
      name: fileName,
      contentKey,
      highlighted: highlight(fileName, fileContents[contentKey]),
    })
  }
  selectTab(fileName)
}

function selectTab(fileName) {
  const tab = previewTabs.value.find(t => t.name === fileName)
  if (!tab) return
  previewVisible.value = false
  setTimeout(() => {
    activeTab.value = fileName
    highlightedPreview.value = tab.highlighted
    previewVisible.value = true
  }, 100)
}

function showPreview(fileName, contentKey) {
  addTab(fileName, contentKey)
}

function scheduleTimeout(fn, delay) {
  const timeout = setTimeout(fn, delay)
  timeouts.push(timeout)
  return delay
}

function animateLines(outputLines, startDelay) {
  let t = startDelay

  outputLines.forEach((line) => {
    if (line.type === 'spinner') {
      scheduleTimeout(() => pushLine(line), t)
      t += 1200
      scheduleTimeout(() => removeSpinner(), t)
      t += 100
    } else {
      scheduleTimeout(() => pushLine(line), t)

      if (line.type === 'prompt') {
        t += 400
      } else if (line.type === 'option' || line.type === 'option-more') {
        t += 200
      } else if (line.type === 'success' || line.type === 'success-bold') {
        t += 250
      } else {
        t += 120
      }
    }
  })

  return t
}

function runStep() {
  if (animating.value || finished.value) return

  const step = currentStep.value
  animating.value = true

  if (step === 0) {
    runAskAi()
  } else if (step === 1) {
    pushLine({ type: 'command', text: `$ ${steps[step].command}` })
    runInit()
  } else if (step === 2) {
    pushLine({ type: 'command', text: `$ ${steps[step].command}` })
    runAdd()
  } else if (step === 3) {
    runAskAiPost()
  }
}

function runAskAi() {
  let claudeT = 300
  preClaudeMessages.forEach((msg) => {
    claudeT += msg.role === 'assistant' ? 900 : 500
    scheduleTimeout(() => pushChat('claude', msg), claudeT)
  })

  let codexT = 300
  preCodexMessages.forEach((msg) => {
    codexT += msg.role === 'assistant' ? 900 : 500
    scheduleTimeout(() => pushChat('codex', msg), codexT)
  })

  const warningTime = Math.max(claudeT, codexT) + 400
  scheduleTimeout(() => {
    chatStatus.value = 'warning'
  }, warningTime)

  scheduleTimeout(() => {
    animating.value = false
    currentStep.value = 1
  }, warningTime + 300)
}

function checkOption(id) {
  const line = lines.value.find(l => l.type === 'option' && l.id === id)
  if (line) {
    line.checked = true
  }
}

function runInit() {
  let t = 600

  // Animate init output (options appear unchecked)
  t = animateLines(initLines, t)

  // Select claude and codex one by one
  t += 400
  scheduleTimeout(() => checkOption('claude'), t)
  t += 500
  scheduleTimeout(() => checkOption('codex'), t)

  // After selection, show the rest of the output
  t += 600
  t = animateLines(postSelectionLines, t)

  // Show tree paths (collapsed, user can expand them)
  t += 300
  scheduleTimeout(() => {
    visibleTreePaths.value = new Set(initPaths)
  }, t)

  // Unlock interaction as soon as terminal output is done
  t += 200
  scheduleTimeout(() => {
    animating.value = false
    currentStep.value = 2
    scrollToBottom(terminalEl.value)
  }, t)

  // Preview loads in the background, non-blocking
  scheduleTimeout(() => showPreview('grekt.yaml', 'grekt.yaml'), t + 300)
}

function runAdd() {
  let t = 600

  // Animate add output
  t = animateLines(addLines, t)

  // Update tree (collapsed, user can explore)
  t += 400
  scheduleTimeout(() => {
    currentTree.value = addTree
    visibleTreePaths.value = new Set(addPaths)
    // Only expand .grekt first level, not deep children
    expandedFolders.value = new Set([
      'root',
      '.agents',
      '.claude',
      '.grekt',
    ])
  }, t)

  // Update grekt.yaml with the new artifact
  t += 400
  scheduleTimeout(() => showPreview('grekt.yaml', 'grekt.yaml-after'), t)

  // Then show the pirate skill
  t += 2000
  scheduleTimeout(() => showPreview('SKILL.md', 'pirate-commits.md'), t)

  // Unlock for the final "Tell AI" step
  t += 600
  scheduleTimeout(() => {
    animating.value = false
    currentStep.value = 3
    scrollToBottom(terminalEl.value)
  }, t)
}

function runAskAiPost() {
  // Clear previous chats and show post-install responses
  chatMessages.value = { claude: [], codex: [] }
  chatStatus.value = 'idle'

  let claudeT = 300
  postClaudeMessages.forEach((msg) => {
    claudeT += msg.role === 'assistant' ? 900 : 500
    scheduleTimeout(() => pushChat('claude', msg), claudeT)
  })

  let codexT = 300
  postCodexMessages.forEach((msg) => {
    codexT += msg.role === 'assistant' ? 900 : 500
    scheduleTimeout(() => pushChat('codex', msg), codexT)
  })

  const syncedTime = Math.max(claudeT, codexT) + 400
  scheduleTimeout(() => {
    chatStatus.value = 'synced'
  }, syncedTime)

  scheduleTimeout(() => {
    animating.value = false
    finished.value = true
  }, syncedTime + 300)
}

onMounted(() => {
  visibleTreePaths.value = new Set(existingPaths)
  currentTree.value = initTree
})

onUnmounted(() => {
  timeouts.forEach(clearTimeout)
})
</script>

<template>
  <div class="cli-demo-init">
    <div class="demo-layout">
      <!-- Top row: Chats | Preview | Tree -->
      <div class="demo-top">
        <!-- Left: AI Chat windows -->
        <div class="demo-chats">
          <!-- Claude chat -->
          <div class="chat-window">
            <div class="chat-titlebar">
              <img
                src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/claude.png"
                alt="Claude"
                width="14"
                height="14"
                class="chat-icon"
              />
              <span class="chat-title">Claude</span>
            </div>
            <div ref="claudeChatEl" class="chat-body">
              <div
                v-for="(msg, index) in chatMessages.claude"
                :key="`claude-${index}`"
                :class="`chat-msg chat-msg--${msg.role}`"
              >
                <span v-if="msg.role === 'system'" class="chat-system">{{ msg.text }}</span>
                <span v-else-if="msg.html" class="chat-bubble" :class="`chat-bubble--${msg.role}`" v-html="msg.html"></span>
                <span v-else class="chat-bubble" :class="`chat-bubble--${msg.role}`">{{ msg.text }}</span>
              </div>
            </div>
          </div>

          <!-- Status indicator -->
          <div v-if="chatStatus !== 'idle'" class="chat-status" :class="`chat-status--${chatStatus}`">
            <span v-if="chatStatus === 'warning'" class="chat-status-icon">&#9888;</span>
            <span v-if="chatStatus === 'warning'" class="chat-status-text">Each one does its own thing</span>
            <span v-if="chatStatus === 'synced'" class="chat-status-icon chat-status-icon--check">&#10003;</span>
            <span v-if="chatStatus === 'synced'" class="chat-status-text">Same skills, consistent behavior</span>
          </div>

          <!-- Codex chat -->
          <div class="chat-window">
            <div class="chat-titlebar">
              <img
                src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/openai.png"
                alt="Codex"
                width="14"
                height="14"
                class="chat-icon"
              />
              <span class="chat-title">Codex</span>
            </div>
            <div ref="codexChatEl" class="chat-body">
              <div
                v-for="(msg, index) in chatMessages.codex"
                :key="`codex-${index}`"
                :class="`chat-msg chat-msg--${msg.role}`"
              >
                <span v-if="msg.role === 'system'" class="chat-system">{{ msg.text }}</span>
                <span v-else-if="msg.html" class="chat-bubble" :class="`chat-bubble--${msg.role}`" v-html="msg.html"></span>
                <span v-else class="chat-bubble" :class="`chat-bubble--${msg.role}`">{{ msg.text }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Center: File preview (editor) -->
        <div class="demo-preview">
          <div class="preview-tabs">
            <button
              v-for="tab in previewTabs"
              :key="tab.name"
              class="preview-tab"
              :class="{ 'preview-tab--active': activeTab === tab.name }"
              @click="selectTab(tab.name)"
            >
              {{ tab.name }}
            </button>
            <span v-if="previewTabs.length === 0" class="preview-tab-empty">No files open</span>
          </div>
          <div class="preview-body">
            <div v-if="previewTabs.length > 0" class="preview-content" :class="{ 'preview-content--visible': previewVisible }">
              <pre class="preview-code" v-html="highlightedPreview"></pre>
            </div>
            <div v-else class="preview-placeholder">
              <span class="preview-placeholder-text">Send a command to see files</span>
            </div>
          </div>
        </div>

        <!-- Right: File tree -->
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
      </div>

      <!-- Bottom: Terminal (full width) -->
      <div ref="terminalEl" class="demo-terminal">
        <div class="terminal-content" :class="{ 'terminal-content--bottom': currentStep >= 2 }">
          <!-- Next tab button -->
          <div v-if="finished" class="terminal-prompt-input terminal-next-tab">
            <button class="run-command-btn run-command-btn--next" @click="emit('next-tab')">
              <span class="next-tab-label">Pick & skip</span>
              <span class="next-tab-arrow">›</span>
            </button>
          </div>

          <!-- Interactive prompt (top when ask-ai, bottom when commands) -->
          <div v-else class="terminal-prompt-input" :class="{ 'terminal-prompt-input--disabled': animating }">
            <button
              v-if="steps[currentStep]?.type === 'ask-ai'"
              class="run-command-btn run-command-btn--ask"
              :disabled="animating"
              @click="runStep"
            >
              <span class="ask-ai-label">{{ steps[currentStep]?.label }}</span>
              <span class="run-hint">{{ steps[currentStep]?.hint }}</span>
            </button>
            <button
              v-else
              class="run-command-btn"
              :disabled="animating"
              @click="runStep"
            >
              <span class="prompt-sign">$</span>
              <span class="command-preview">{{ steps[currentStep]?.command }}</span>
              <span class="run-hint">click to run</span>
            </button>
          </div>

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
              <span class="option-row" :class="line.checked ? 'option-row--checked' : 'option-row--unchecked'">
                <span class="option-circle">{{ line.checked ? '\u25C9' : '\u25CB' }}</span>
                <span class="option-label">{{ line.label }}</span>
              </span>
            </template>
            <template v-else-if="line.type === 'option-more'">
              <span class="option-row option-row--unchecked">
                <span class="option-circle">&bull;</span>
                <span class="option-label option-label--more">{{ line.text }}</span>
              </span>
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cli-demo-init {
  width: 100%;
}

.demo-layout {
  display: flex;
  flex-direction: column;
  height: 640px;
  max-height: 640px;
}

/* Top row: 3 columns */
.demo-top {
  display: grid;
  grid-template-columns: 1fr 1.15fr 0.5fr;
  gap: 0;
  flex: 1;
  min-height: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

/* File Tree panel */
.demo-tree {
  padding: 16px 20px;
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
  font-size: 0.75rem;
}

/* File preview panel - editor style */
.demo-preview {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.15);
}

.preview-tabs {
  display: flex;
  align-items: stretch;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  height: 34px;
  overflow-x: auto;
}

.preview-tab {
  display: inline-flex;
  align-items: center;
  padding: 0 14px;
  height: 100%;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.68rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.35);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  white-space: nowrap;
}

.preview-tab:hover {
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.02);
}

.preview-tab--active {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  background: rgba(0, 0, 0, 0.15);
  border-bottom-color: #77CABD;
}

.preview-tab-empty {
  display: inline-flex;
  align-items: center;
  padding: 0 14px;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.2);
}

.preview-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.preview-content {
  opacity: 0;
  transition: opacity 0.2s ease;
  height: 100%;
}

.preview-content--visible {
  opacity: 1;
}

.preview-code {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.72rem;
  line-height: 0.9;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
  padding: 10px 0 10px 0;
  background: transparent;
  border: none;
  border-radius: 0;
  white-space: pre;
  overflow: auto;
}

.preview-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-placeholder-text {
  color: rgba(255, 255, 255, 0.12);
  font-size: 0.75rem;
  font-style: italic;
}

/* Line numbers */
.preview-code :deep(.hl-line) {
  display: block;
}

.preview-code :deep(.hl-line-number) {
  display: inline-block;
  width: 28px;
  padding-right: 12px;
  margin-right: 14px;
  text-align: right;
  color: rgba(255, 255, 255, 0.18);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  user-select: none;
}

/* Syntax highlighting - YAML */
.preview-code :deep(.hl-comment) {
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
}

.preview-code :deep(.hl-key) {
  color: #7dcfff;
}

.preview-code :deep(.hl-punctuation) {
  color: rgba(255, 255, 255, 0.35);
}

.preview-code :deep(.hl-string) {
  color: #9ece6a;
}

.preview-code :deep(.hl-value) {
  color: #e0af68;
}

/* Syntax highlighting - Markdown */
.preview-code :deep(.hl-md-heading) {
  color: #7dcfff;
  font-weight: 600;
}

.preview-code :deep(.hl-md-bold) {
  color: #bb9af7;
  font-weight: 500;
}

.preview-code :deep(.hl-md-text) {
  color: rgba(255, 255, 255, 0.7);
}

/* Syntax highlighting - Frontmatter */
.preview-code :deep(.hl-frontmatter-delimiter) {
  color: rgba(255, 255, 255, 0.25);
}

.preview-code :deep(.hl-frontmatter-key) {
  color: #bb9af7;
}

.preview-code :deep(.hl-frontmatter-value) {
  color: #9ece6a;
}

/* AI Chats column */
.demo-chats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  overflow-y: auto;
}

.chat-window {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chat-titlebar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
}

.chat-icon {
  border-radius: 3px;
  flex-shrink: 0;
}

.chat-title {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.chat-body {
  padding: 10px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  scroll-behavior: smooth;
  min-height: 0;
}

.chat-msg {
  animation: msg-fade-in 0.3s ease-out;
}

.chat-system {
  display: block;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.58rem;
  color: #77CABD;
  text-align: center;
  padding: 3px 8px;
  background: rgba(119, 202, 189, 0.08);
  border-radius: 4px;
  font-weight: 500;
}

.chat-bubble {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 0.65rem;
  line-height: 1.5;
  max-width: 100%;
  word-wrap: break-word;
}

.chat-bubble--user {
  background: rgba(119, 202, 189, 0.15);
  color: #77CABD;
  border-bottom-right-radius: 4px;
}

.chat-msg--user {
  display: flex;
  justify-content: flex-end;
}

.chat-bubble--assistant {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
  border-bottom-left-radius: 4px;
}

.chat-bubble--assistant :deep(strong) {
  color: #fff;
  font-weight: 600;
}

.chat-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
}

.chat-empty-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  animation: dot-pulse 1.4s ease-in-out infinite;
}

.chat-empty-dot:nth-child(2) { animation-delay: 0.2s; }
.chat-empty-dot:nth-child(3) { animation-delay: 0.4s; }

/* Chat status indicator */
.chat-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 0;
  animation: msg-fade-in 0.3s ease-out;
  flex-shrink: 0;
}

.chat-status-icon {
  font-size: 0.7rem;
}

.chat-status--warning .chat-status-icon {
  color: #e8a838;
}

.chat-status--warning .chat-status-text {
  color: #e8a838;
  font-size: 0.62rem;
  font-weight: 500;
}

.chat-status--synced .chat-status-icon--check {
  color: #77CABD;
  font-weight: 700;
}

.chat-status--synced .chat-status-text {
  color: #77CABD;
  font-size: 0.62rem;
  font-weight: 500;
}

/* Terminal (bottom, full width) */
.demo-terminal {
  padding: 12px 20px;
  overflow-y: auto;
  scroll-behavior: smooth;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  height: 280px;
  min-height: 280px;
  max-height: 280px;
}

.terminal-content {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.75rem;
  line-height: 1.6;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.terminal-line {
  animation: line-fade-in 0.2s ease-out;
}

.terminal-line--blank {
  height: 0.7em;
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

.option-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding-left: 12px;
  transition: color 0.25s ease;
}

.option-row--checked {
  color: #77CABD;
}

.option-row--unchecked {
  color: rgba(255, 255, 255, 0.3);
}

.option-circle {
  font-size: 0.85em;
  transition: color 0.25s ease;
}

.option-label {
  transition: color 0.25s ease;
}

.option-label--more {
  font-style: italic;
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

.terminal-content--bottom .terminal-prompt-input {
  order: 99;
  margin-top: auto;
  padding-top: 8px;
}

/* Interactive command prompt */
.terminal-prompt-input {
  padding-bottom: 6px;
}

.run-command-btn {
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  padding: 6px 12px;
  background: rgba(119, 202, 189, 0.06);
  border: 1px solid rgba(119, 202, 189, 0.2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.75rem;
  animation: ask-pulse 2s ease-in-out infinite;
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
  font-size: 0.65rem;
  font-style: italic;
}


.run-command-btn--ask {
  justify-content: center;
}

.run-command-btn--next {
  justify-content: center;
  gap: 8px;
}

.next-tab-label {
  color: #77CABD;
  font-weight: 500;
}

.next-tab-arrow {
  color: #77CABD;
  font-size: 1.1em;
  font-weight: 600;
}

.terminal-next-tab {
  order: 99;
  margin-top: auto;
  padding-top: 8px;
}

@keyframes ask-pulse {
  0%, 100% {
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.08), 0 0 20px rgba(255, 255, 255, 0.03);
  }
  50% {
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.2), 0 0 35px rgba(255, 255, 255, 0.08);
  }
}

.ask-ai-label {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.terminal-prompt-input--disabled .run-hint {
  display: none;
}

/* Animations */
@keyframes line-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes msg-fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes dot-pulse {
  0%, 80%, 100% { opacity: 0.15; transform: scale(1); }
  40% { opacity: 0.6; transform: scale(1.2); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}


/* Mobile */
@media (max-width: 768px) {
  .demo-layout {
    height: auto;
    max-height: none;
  }

  .demo-top {
    grid-template-columns: 1fr;
    border-bottom: none;
  }

  .demo-tree {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding: 12px 16px;
    max-height: 200px;
  }

  .demo-preview {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding: 12px 16px;
    max-height: 180px;
  }

  .demo-chats {
    padding: 12px 16px;
    flex-direction: row;
    gap: 8px;
    max-height: 180px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .chat-window {
    flex: 1;
    min-width: 0;
  }

  .demo-terminal {
    height: auto;
    min-height: 140px;
    max-height: 200px;
    padding: 12px 16px;
  }

  .terminal-content,
  .tree-content {
    font-size: 0.68rem;
  }

  .preview-code {
    font-size: 0.65rem;
  }

  .chat-bubble {
    font-size: 0.6rem;
  }

  .chat-system {
    font-size: 0.52rem;
  }
}
</style>
