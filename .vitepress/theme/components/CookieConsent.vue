<script setup lang="ts">
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: Record<string, unknown>[]
  }
}

import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'cookie-consent'
const isVisible = ref(false)
const hasConsented = ref(false)

function getStoredConsent(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function saveConsent(value: 'accepted' | 'rejected') {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Storage unavailable — banner will reappear next visit
  }
}

function updateGtagConsent(granted: boolean) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
  })
}

function accept() {
  saveConsent('accepted')
  updateGtagConsent(true)
  isVisible.value = false
  hasConsented.value = true
}

function reject() {
  saveConsent('rejected')
  updateGtagConsent(false)
  isVisible.value = false
  hasConsented.value = true
}

function reopenBanner() {
  isVisible.value = true
}

onMounted(() => {
  const stored = getStoredConsent()

  if (!stored) {
    isVisible.value = true
    return
  }

  hasConsented.value = true

  if (stored === 'accepted') {
    updateGtagConsent(true)
  }
})
</script>

<template>
  <Transition name="cookie-banner">
    <div v-if="isVisible" class="cookie-consent">
      <p class="cookie-consent-title">Cookie preferences</p>
      <p class="cookie-consent-text">
        We use cookies to analyse our traffic and improve your experience.
        <a href="/en-US/docs/guide/privacy" class="cookie-consent-link">Privacy Policy</a>
      </p>
      <div class="cookie-consent-actions">
        <button class="cookie-btn cookie-btn-reject" @click="reject">Decline all</button>
        <button class="cookie-btn cookie-btn-accept" @click="accept">Save and close</button>
      </div>
    </div>
  </Transition>

  <Transition name="cookie-trigger">
    <button
      v-if="hasConsented && !isVisible"
      class="cookie-trigger"
      aria-label="Cookie preferences"
      @click="reopenBanner"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <circle cx="5" cy="6" r="1" fill="currentColor"/>
        <circle cx="9" cy="4.5" r="0.75" fill="currentColor"/>
        <circle cx="7" cy="9" r="1" fill="currentColor"/>
        <circle cx="10.5" cy="7.5" r="0.75" fill="currentColor"/>
        <circle cx="5.5" cy="11" r="0.75" fill="currentColor"/>
      </svg>
    </button>
  </Transition>
</template>
