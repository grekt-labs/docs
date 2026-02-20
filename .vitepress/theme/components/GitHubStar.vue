<script setup>
import { ref, onMounted } from 'vue'

const stars = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('https://api.github.com/repos/grekt-labs/cli')
    const data = await response.json()
    stars.value = data.stargazers_count
  } catch {
    stars.value = null
  }
})

function formatStars(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return String(count)
}
</script>

<template>
  <a
    class="github-star"
    href="https://github.com/grekt-labs/cli"
    target="_blank"
    rel="noopener noreferrer"
    title="Star grekt on GitHub"
  >
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
    </svg>
    <span class="github-star-label">Star</span>
    <span v-if="stars !== null" class="github-star-count">{{ formatStars(stars) }}</span>
  </a>
</template>

<style scoped>
.github-star {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
  padding: 3px 10px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: border-color 0.25s, color 0.25s;
  line-height: 1;
  white-space: nowrap;
}

.github-star:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.github-star-count {
  padding-left: 4px;
  border-left: 1px solid var(--vp-c-divider);
}
</style>
