<script setup>
import { computed } from 'vue'

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 },
  isExpanded: { type: Function, required: true },
  isVisible: { type: Function, required: true },
  isHighlighted: { type: Function, default: () => false },
})

const emit = defineEmits(['toggle'])

const isFolder = computed(() => props.node.type === 'folder')
const expanded = computed(() => isFolder.value && props.isExpanded(props.node.path))
const hasChildren = computed(() => isFolder.value && props.node.children?.length > 0)
const isEmpty = computed(() => isFolder.value && props.node.children?.length === 0)
const visible = computed(() => props.isVisible(props.node.path))
const highlighted = computed(() => props.isHighlighted(props.node.path))
const indent = computed(() => `${props.depth * 16}px`)

function handleClick() {
  if (isFolder.value) {
    emit('toggle', props.node.path)
  }
}
</script>

<template>
  <div v-if="visible" class="tree-node" :class="{ 'tree-node--dimmed': node.tag }">
    <div
      class="tree-node-row"
      :class="{ 'tree-node-row--folder': isFolder, 'tree-node-row--highlighted': highlighted }"
      :style="{ paddingLeft: indent }"
      @click="handleClick"
    >
      <span :class="isFolder ? 'tree-node-icon tree-node-icon--folder' : 'tree-node-icon tree-node-icon--file'">
        <!-- Folder open -->
        <svg v-if="isFolder && expanded" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 14l1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
        </svg>
        <!-- Folder closed -->
        <svg v-else-if="isFolder" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
        <!-- File -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
      </span>
      <span :class="isFolder ? 'tree-node-name tree-node-name--folder' : 'tree-node-name tree-node-name--file'">
        {{ node.name }}
      </span>
      <span v-if="node.tag" class="tree-node-tag">{{ node.tag }}</span>
      <span v-if="isEmpty" class="tree-node-empty">(empty)</span>
    </div>

    <div v-if="hasChildren" class="tree-node-children" :class="{ 'tree-node-children--collapsed': !expanded }">
      <FileTreeNode
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        :depth="depth + 1"
        :is-expanded="isExpanded"
        :is-visible="isVisible"
        :is-highlighted="isHighlighted"
        @toggle="emit('toggle', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.tree-node {
  animation: tree-fade-in 0.25s ease-out;
}

.tree-node--dimmed {
  opacity: 0.45;
}

.tree-node-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 6px;
  border-radius: 4px;
  transition: background 0.15s ease;
  cursor: default;
  user-select: none;
}

.tree-node-row--folder {
  cursor: pointer;
}

.tree-node-row:hover {
  background: rgba(255, 255, 255, 0.04);
}

.tree-node-row--highlighted {
  background: rgba(119, 202, 189, 0.08);
}

.tree-node-row--highlighted .tree-node-name--file {
  color: #77CABD;
}

.tree-node-row--highlighted .tree-node-name--folder {
  color: #77CABD;
}

.tree-node-row--highlighted .tree-node-icon--file {
  color: #77CABD;
}

.tree-node-row--highlighted .tree-node-icon--folder {
  color: #77CABD;
}

.tree-node-children {
  overflow: hidden;
  max-height: 500px;
  transition: max-height 0.25s ease, opacity 0.2s ease;
  opacity: 1;
}

.tree-node-children--collapsed {
  max-height: 0;
  opacity: 0;
}

.tree-node-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.tree-node-icon--folder {
  color: #e8a838;
}

.tree-node-icon--file {
  color: rgba(255, 255, 255, 0.4);
}

.tree-node-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.8rem;
}

.tree-node-name--folder {
  color: #e6edf3;
  font-weight: 500;
}

.tree-node-name--file {
  color: rgba(255, 255, 255, 0.65);
}

.tree-node-tag {
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.6rem;
  font-style: italic;
  margin-left: 4px;
}

.tree-node-empty {
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.7rem;
  font-style: italic;
}

@keyframes tree-fade-in {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .tree-node-name {
    font-size: 0.72rem;
  }
}
</style>
