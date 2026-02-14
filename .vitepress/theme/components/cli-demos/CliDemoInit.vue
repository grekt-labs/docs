<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
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

// File preview state (unused, kept for potential restore)
const previewTabs = ref([])
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

// Without grekt: each AI follows its own style
const preClaudeMessages = [
  { role: 'user', text: 'Commit my changes', muted: true },
  {
    role: 'assistant',
    html: 'I\'ll commit with:<br><strong>"feat: add user authentication flow"</strong>',
    annotation: 'Conventional commits',
    highlight: 'warn',
  },
]

const preCodexMessages = [
  { role: 'user', text: 'Commit my changes', muted: true },
  {
    role: 'assistant',
    html: 'Done! Committed as:<br><strong>"added the login stuff and fixed some things"</strong>',
    annotation: 'No convention at all',
    highlight: 'warn',
  },
]

// With grekt: both follow the same pirate-commits skill
const postClaudeMessages = [
  { role: 'user', text: 'Commit my changes', muted: true },
  {
    role: 'assistant',
    html: 'I\'ll commit with:<br><strong>"feat: hoist the auth sails, captain! Ahoy!"</strong>',
    highlight: 'success',
  },
]

const postCodexMessages = [
  { role: 'user', text: 'Commit my changes', muted: true },
  {
    role: 'assistant',
    html: 'Done! Committed as:<br><strong>"feat: anchor the login flow, matey! Fair winds!"</strong>',
    highlight: 'success',
  },
]

const activeTab = ref('without')

defineExpose({ activeTab })

const displayedClaudeMessages = computed(() =>
  activeTab.value === 'with' ? postClaudeMessages : preClaudeMessages
)

const displayedCodexMessages = computed(() =>
  activeTab.value === 'with' ? postCodexMessages : preCodexMessages
)

const isWithMode = computed(() => activeTab.value === 'with')

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
  <div class="cli-demo-init" :class="{ 'cli-demo-init--synced': isWithMode }">
    <div class="demo-layout">
      <!-- Tabs -->
      <div class="demo-tabs">
        <button
          class="demo-tab"
          :class="{ 'demo-tab--active': activeTab === 'without' }"
          @click="activeTab = 'without'"
        >PROMPT & PRAY</button>
        <button
          class="demo-tab"
          :class="{ 'demo-tab--active': activeTab === 'with' }"
          @click="activeTab = 'with'"
        >MANAGED</button>
      </div>

      <!-- Chats side by side -->
      <div class="demo-top">
        <div class="demo-chats">
          <!-- Claude chat -->
          <div class="chat-window" :class="{ 'chat-window--synced': isWithMode }">
            <div class="chat-titlebar">
              <img
                src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/claude.png"
                alt="Claude"
                width="16"
                height="16"
                class="chat-icon"
              />
              <span class="chat-title">Claude</span>
            </div>
            <div class="chat-body">
              <Transition name="chat-fade" mode="out-in">
                <div :key="activeTab" class="chat-messages-list">
                  <div
                    v-for="(msg, index) in displayedClaudeMessages"
                    :key="index"
                    :class="[`chat-msg chat-msg--${msg.role}`, { 'chat-msg--muted': msg.muted }]"
                  >
                    <span v-if="msg.html" class="chat-bubble" :class="[`chat-bubble--${msg.role}`, msg.highlight ? `chat-bubble--${msg.highlight}` : '']" v-html="msg.html"></span>
                    <span v-else class="chat-bubble" :class="[`chat-bubble--${msg.role}`, msg.highlight ? `chat-bubble--${msg.highlight}` : '']">{{ msg.text }}</span>
                    <!-- <span v-if="msg.annotation" class="chat-annotation">{{ msg.annotation }}</span> -->
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Center: Connector + Skill toast -->
          <div class="chat-center">
            <div class="chat-connector" :class="{ 'chat-connector--synced': isWithMode }">
              <div class="connector-line"></div>
            </div>
            <Transition name="toast-slide" mode="out-in">
              <div v-if="isWithMode" key="with" class="skill-toast skill-toast--inline">
                <span class="skill-toast-label">Synced skill</span>
                <span class="skill-toast-name">pirate-commits</span>
                <span class="skill-toast-source">@grekt/overseas@<span class="skill-toast-version">1.0.5</span></span>
              </div>
              <div v-else key="without" class="skill-toast skill-toast--inline skill-toast--warn">
                <span class="skill-toast-name">Who? When? What?</span>
              </div>
            </Transition>
          </div>

          <!-- Codex chat -->
          <div class="chat-window" :class="{ 'chat-window--synced': isWithMode }">
            <div class="chat-titlebar">
              <img
                src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/openai.png"
                alt="Codex"
                width="16"
                height="16"
                class="chat-icon"
              />
              <span class="chat-title">Codex</span>
            </div>
            <div class="chat-body">
              <Transition name="chat-fade" mode="out-in">
                <div :key="activeTab" class="chat-messages-list">
                  <div
                    v-for="(msg, index) in displayedCodexMessages"
                    :key="index"
                    :class="[`chat-msg chat-msg--${msg.role}`, { 'chat-msg--muted': msg.muted }]"
                  >
                    <span v-if="msg.html" class="chat-bubble" :class="[`chat-bubble--${msg.role}`, msg.highlight ? `chat-bubble--${msg.highlight}` : '']" v-html="msg.html"></span>
                    <span v-else class="chat-bubble" :class="[`chat-bubble--${msg.role}`, msg.highlight ? `chat-bubble--${msg.highlight}` : '']">{{ msg.text }}</span>
                    <!-- <span v-if="msg.annotation" class="chat-annotation">{{ msg.annotation }}</span> -->
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

      </div>

      <!-- Skill toast (moved inline between chats) -->

      <!-- Bottom: Terminal (full width) — temporarily hidden -->
      <div v-if="false" ref="terminalEl" class="demo-terminal">
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
  transition: all 0.4s ease;
}

.demo-layout {
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Skill toast */
.skill-toast {
  position: absolute;
  bottom: -44px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 18px;
  background: #141414;
  border: 1px solid rgba(119, 202, 189, 0.2);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  z-index: 10;
}

.skill-toast-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

.skill-toast-name {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.8rem;
  font-weight: 600;
  color: #77CABD;
  padding: 3px 10px;
  background: rgba(119, 202, 189, 0.1);
  border-radius: 6px;
}

.skill-toast-source {
  font-size: 0.72rem;
  color: #77CABD;
}

.skill-toast-version {
  color: #77CABD;
  font-weight: 600;
}

/* Toast transition */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}

.toast-slide-enter-to,
.toast-slide-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Chats area */
.demo-top {
  display: flex;
  flex-direction: column;
}

/* AI Chats side by side */
.demo-chats {
  display: flex;
  flex-direction: row;
  gap: 0;
  padding: 20px 20px 20px;
  position: relative;
  min-height: 280px;
  align-items: stretch;
}

/* Chat windows */
.chat-window {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.chat-window--synced {
  border-color: rgba(119, 202, 189, 0.15);
  box-shadow: 0 0 24px rgba(119, 202, 189, 0.06);
}

.chat-titlebar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
}

.chat-icon {
  border-radius: 4px;
  flex-shrink: 0;
}

.chat-title {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.chat-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-msg {
  display: flex;
  flex-direction: column;
}

.chat-msg--user {
  align-items: flex-end;
}

.chat-msg--assistant {
  align-items: flex-start;
}

.chat-bubble {
  display: inline-block;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  line-height: 1.6;
  max-width: 100%;
  word-wrap: break-word;
}

.chat-bubble--user {
  background: rgba(119, 202, 189, 0.15);
  color: #77CABD;
  border-bottom-right-radius: 4px;
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

.chat-msg--muted .chat-bubble {
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.04);
}

.chat-bubble--warn {
  background: rgba(232, 168, 56, 0.15);
  color: rgba(255, 255, 255, 0.7);
}

.chat-bubble--warn :deep(strong) {
  color: #e8a838;
}

.chat-bubble--success {
  background: rgba(119, 202, 189, 0.15);
  color: rgba(255, 255, 255, 0.7);
}

.chat-bubble--success :deep(strong) {
  color: #77CABD;
}

/* Annotation labels on messages */
.chat-annotation {
  display: inline-block;
  margin-top: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  color: #e8a838;
  padding: 2px 8px;
  background: rgba(232, 168, 56, 0.08);
  border: 1px solid rgba(232, 168, 56, 0.15);
  border-radius: 4px;
  letter-spacing: 0.3px;
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


/* Connector between chat windows */
.chat-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 240px;
  min-width: 240px;
  position: relative;
}

.chat-connector {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  z-index: 0;
}

.connector-line {
  width: 100%;
  height: 2px;
  background: repeating-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.15) 0px,
    rgba(255, 255, 255, 0.15) 6px,
    transparent 6px,
    transparent 12px
  );
  background-size: 200% 100%;
  animation: connector-flow 20s linear infinite;
  transition: all 0.4s ease;
}

.chat-connector--synced .connector-line {
  background: repeating-linear-gradient(
    90deg,
    #77CABD 0px,
    #77CABD 6px,
    transparent 6px,
    transparent 12px
  );
  background-size: 200% 100%;
  animation: connector-flow 10s linear infinite;
  box-shadow: 0 0 8px rgba(119, 202, 189, 0.3);
}

@keyframes connector-flow {
  0% { background-position: 0% 0; }
  100% { background-position: -200% 0; }
}

.skill-toast--inline {
  position: relative;
  bottom: auto;
  left: auto;
  transform: none;
  flex-direction: column;
  gap: 4px;
  padding: 8px 14px;
  text-align: center;
  z-index: 1;
}

.skill-toast--warn {
  border-color: rgba(232, 168, 56, 0.2);
  background: #1a1400;
}

.skill-toast--warn .skill-toast-name {
  color: #e8a838;
  background: rgba(232, 168, 56, 0.1);
}

/* Tabs */
.demo-tabs {
  display: inline-flex;
  align-self: center;
  gap: 4px;
  padding: 6px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  margin-top: 20px;
  margin-bottom: 4px;
}

.demo-tab {
  width: 190px;
  padding: 10px 0;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-align: center;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-tab:hover {
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.05);
}

.demo-tab--active {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

/* Chat fade transition */
.chat-fade-enter-active {
  transition: opacity 0.25s ease 0.05s, transform 0.25s ease 0.05s;
}

.chat-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.chat-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.chat-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.chat-messages-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Light mode */
html:not(.dark) .chat-window {
  background: #f5f5f5;
  border-color: rgba(0, 0, 0, 0.15);
}

html:not(.dark) .chat-window--synced {
  border-color: rgba(50, 130, 115, 0.4);
  box-shadow: 0 0 24px rgba(50, 130, 115, 0.12);
}

html:not(.dark) .chat-titlebar {
  border-bottom-color: rgba(0, 0, 0, 0.12);
}

html:not(.dark) .chat-title {
  color: rgba(0, 0, 0, 0.8);
}

html:not(.dark) .chat-bubble--user {
  background: rgba(50, 130, 115, 0.15);
  color: #2a7568;
}

html:not(.dark) .chat-bubble--assistant {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.75);
}

html:not(.dark) .chat-bubble--assistant :deep(strong) {
  color: #111;
}

html:not(.dark) .chat-msg--muted .chat-bubble {
  color: rgba(0, 0, 0, 0.45);
  background: rgba(0, 0, 0, 0.05);
}

html:not(.dark) .chat-bubble--warn {
  background: rgba(180, 120, 20, 0.14);
  color: rgba(0, 0, 0, 0.75);
}

html:not(.dark) .chat-bubble--warn :deep(strong) {
  color: #7a5510;
}

html:not(.dark) .chat-bubble--success {
  background: rgba(50, 130, 115, 0.14);
  color: rgba(0, 0, 0, 0.75);
}

html:not(.dark) .chat-bubble--success :deep(strong) {
  color: #2a7568;
}

html:not(.dark) .connector-line {
  background: repeating-linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.25) 0px,
    rgba(0, 0, 0, 0.25) 6px,
    transparent 6px,
    transparent 12px
  );
  background-size: 200% 100%;
}

html:not(.dark) .chat-connector--synced .connector-line {
  background: repeating-linear-gradient(
    90deg,
    #2a7568 0px,
    #2a7568 6px,
    transparent 6px,
    transparent 12px
  );
  background-size: 200% 100%;
  box-shadow: 0 0 8px rgba(50, 130, 115, 0.3);
}

html:not(.dark) .skill-toast {
  background: #eee;
  border-color: rgba(50, 130, 115, 0.35);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

html:not(.dark) .skill-toast-label {
  color: rgba(0, 0, 0, 0.5);
}

html:not(.dark) .skill-toast-name {
  color: #2a7568;
  background: rgba(50, 130, 115, 0.15);
}

html:not(.dark) .skill-toast-source {
  color: #2a7568;
}

html:not(.dark) .skill-toast-version {
  color: #2a7568;
}

html:not(.dark) .skill-toast--warn {
  background: #f5eddb;
  border-color: rgba(180, 120, 20, 0.35);
}

html:not(.dark) .skill-toast--warn .skill-toast-name {
  color: #7a5510;
  background: rgba(180, 120, 20, 0.15);
}

html:not(.dark) .demo-tab {
  color: rgba(0, 0, 0, 0.55);
}

html:not(.dark) .demo-tab--active {
  background: #fff;
  color: rgba(0, 0, 0, 0.9);
}

html:not(.dark) .demo-tabs {
  background: rgba(0, 0, 0, 0.06);
  border-color: rgba(0, 0, 0, 0.12);
}

html:not(.dark) .chat-annotation {
  color: #7a5510;
  background: rgba(180, 120, 20, 0.12);
}

html:not(.dark) .chat-icon {
  filter: invert(1);
}

/* Mobile */
@media (max-width: 768px) {
  .demo-chats {
    flex-direction: column;
    padding: 12px;
    gap: 0;
  }

  .demo-tabs {
    align-self: stretch;
    margin-left: 0.2rem;
    margin-right: 0.2rem;
    max-width: calc(100% - 0.4rem);
  }

  .demo-tab {
    width: auto;
    flex: 1;
  }

  .chat-window {
    min-width: 0;
  }

  .chat-center {
    width: 100%;
    min-width: unset;
    min-height: 150px;
    flex-direction: row;
    padding: 12px 0;
  }


  .chat-connector {
    top: 50%;
    left: 50%;
    width: 2px;
    height: 100%;
    transform: translate(-50%, -50%);
  }

  .connector-line {
    width: 2px;
    height: 150px;
    background: repeating-linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.15) 0px,
      rgba(255, 255, 255, 0.15) 6px,
      transparent 6px,
      transparent 12px
    ) !important;
  }

  .cli-demo-init:not(.cli-demo-init--synced) .connector-line {
    height: 150px;
  }

  .chat-connector--synced .connector-line {
    background: repeating-linear-gradient(
      180deg,
      #77CABD 0px,
      #77CABD 6px,
      transparent 6px,
      transparent 12px
    ) !important;
    background-size: 100% 200% !important;
    animation: connector-flow-vertical 10s linear infinite !important;
  }

  .chat-body {
    padding: 12px;
  }

  .chat-bubble {
    font-size: 0.8rem;
    padding: 8px 12px;
  }

  .chat-annotation {
    font-size: 0.62rem;
  }

  .skill-bridge {
    padding: 8px 12px;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .skill-bridge-name {
    font-size: 0.7rem;
  }

  .chat-skill-indicator {
    font-size: 0.58rem;
  }

  .skill-toast--inline {
    font-size: 0.75rem;
  }
}

@keyframes connector-flow-vertical {
  0% { background-position: 0 0%; }
  100% { background-position: 0 -200%; }
}
</style>
