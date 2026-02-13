<script setup>
import { ref, shallowRef, defineAsyncComponent } from 'vue'

const CliDemoInit = defineAsyncComponent(() => import('./CliDemoInit.vue'))
const CliDemoSync = defineAsyncComponent(() => import('./CliDemoSync.vue'))
const CliDemoChoose = defineAsyncComponent(() => import('./CliDemoChoose.vue'))
const CliDemoUpdate = defineAsyncComponent(() => import('./CliDemoUpdate.vue'))
const CliDemoCheck = defineAsyncComponent(() => import('./CliDemoCheck.vue'))

const tabs = [
  { id: 'getting-started', label: 'Get started', component: CliDemoInit },
  { id: 'choose', label: 'Pick & skip', component: CliDemoChoose },
  { id: 'sync', label: 'Choose what matters', component: CliDemoSync },
  { id: 'update', label: 'Update', component: CliDemoUpdate },
  { id: 'check', label: 'Detect diffs', component: CliDemoCheck },
]

const activeTab = ref('getting-started')
const activeComponent = shallowRef(CliDemoInit)

const switchTab = (tab) => {
  activeTab.value = tab.id
  activeComponent.value = tab.component
}

const goToNextTab = () => {
  const currentIndex = tabs.findIndex(t => t.id === activeTab.value)
  const next = tabs[currentIndex + 1]
  if (next) switchTab(next)
}
</script>

<template>
  <div class="cli-demo">
    <!-- Terminal chrome -->
    <div class="terminal-window">
      <div class="terminal-titlebar">
        <div class="terminal-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <div class="terminal-tabs">
          <template v-for="(tab, index) in tabs" :key="tab.id">
            <span v-if="index > 0" class="terminal-tab-chevron">›</span>
            <button
              class="terminal-tab"
              :class="{ 'terminal-tab--active': activeTab === tab.id }"
              @click="switchTab(tab)"
            >
              {{ tab.label }}
            </button>
          </template>
        </div>
        <div class="terminal-spacer"></div>
      </div>

      <!-- Demo content -->
      <div class="terminal-body">
        <component :is="activeComponent" :key="activeTab" @next-tab="goToNextTab" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cli-demo {
  max-width: 1100px;
  margin: 0 auto;
}

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

.terminal-tabs {
  display: flex;
  align-items: center;
  gap: 2px;
  overflow-x: auto;
}

.terminal-tab-chevron {
  color: rgba(255, 255, 255, 0.15);
  font-size: 0.9rem;
  padding: 0 4px;
  user-select: none;
}

.terminal-tab {
  padding: 6px 16px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.4);
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.terminal-tab:hover {
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.04);
}

.terminal-tab--active {
  color: #77CABD;
  background: rgba(119, 202, 189, 0.1);
}


.terminal-spacer {
  flex: 1;
}

.terminal-body {
  min-height: 280px;
}

/* Mobile */
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

  .terminal-tab {
    padding: 4px 12px;
    font-size: 0.72rem;
  }

  .terminal-body {
    min-height: 240px;
  }
}
</style>
