import DefaultTheme from 'vitepress/theme'
import HomePage from './components/HomePage.vue'
import GitHubStar from './components/GitHubStar.vue'
import CookieConsent from './components/CookieConsent.vue'
import './custom.css'
import { h, defineComponent, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vitepress'
import mediumZoom, { type Zoom } from 'medium-zoom'

let zoom: Zoom | null = null

const Layout = defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()

    // GTM page tracking
    if (typeof window !== 'undefined' && import.meta.env.PROD) {
      onMounted(() => {
        router.onAfterRouteChanged = (to: string) => {
          window.dataLayer = window.dataLayer || []
          window.dataLayer.push({
            event: 'page_view',
            page_path: to,
          })
        }
      })
    }

    // Medium zoom
    onMounted(() => {
      zoom = mediumZoom('.vp-doc img', { background: 'var(--vp-c-bg)' })
      watch(() => route.path, () => {
        nextTick(() => {
          zoom?.detach()
          zoom = mediumZoom('.vp-doc img', { background: 'var(--vp-c-bg)' })
        })
      })
    })

    return () => h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(GitHubStar),
      'layout-bottom': () => h(CookieConsent),
    })
  },
})

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
  },
  Layout,
}
