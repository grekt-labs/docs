import DefaultTheme from 'vitepress/theme'
import HomePage from './components/HomePage.vue'
import GitHubStar from './components/GitHubStar.vue'
import CookieConsent from './components/CookieConsent.vue'
import './custom.css'
import { h, onMounted } from 'vue'
import { useRouter } from 'vitepress'

function useGtmPageTracking() {
  if (typeof window === 'undefined') return

  const router = useRouter()

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

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
  },
  Layout() {
    useGtmPageTracking()

    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(GitHubStar),
      'layout-bottom': () => h(CookieConsent),
    })
  }
}
