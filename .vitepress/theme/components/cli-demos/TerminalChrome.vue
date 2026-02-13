<script setup>
defineProps({
  title: { type: String, default: '' },
})
</script>

<template>
  <div class="terminal-window">
    <div class="terminal-titlebar">
      <div class="terminal-dots">
        <span class="dot dot-red"></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
      </div>
      <span v-if="title" class="terminal-title">{{ title }}</span>
      <div class="terminal-spacer"></div>
    </div>
    <div class="terminal-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.terminal-window {
  background: #1a1b26;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 40px rgba(119, 202, 189, 0.06);
}

.terminal-titlebar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #15161e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  gap: 12px;
}

.terminal-dots {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot-red { background: #ff5f57; }
.dot-yellow { background: #febc2e; }
.dot-green { background: #28c840; }

.terminal-title {
  color: rgba(255, 255, 255, 0.4);
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.75rem;
}

.terminal-spacer {
  flex: 1;
}

.terminal-body {
  min-height: 280px;
}

@media (max-width: 768px) {
  .terminal-window {
    border-radius: 10px;
  }

  .terminal-titlebar {
    padding: 10px 12px;
  }

  .dot {
    width: 10px;
    height: 10px;
  }

  .terminal-body {
    min-height: 240px;
  }
}
</style>
