import DefaultTheme from 'vitepress/theme'
import HomePage from './components/HomePage.vue'
import GitHubStar from './components/GitHubStar.vue'
import './custom.css'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(GitHubStar)
    })
  }
}
