import { defineConfig } from 'vitepress'
import { enUSSidebar, enUSNav } from './configs/en-US'

export default defineConfig({
  title: " ",
  description: "AI Artifact Manager - Manage and sync AI tool configurations",

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
  ],

  locales: {
    'en-US': {
      label: 'English',
      lang: 'en-US',
      link: '/'
    }
  },

  themeConfig: {
    logo: {
      light: '/grekt-logo-light.svg',
      dark: '/grekt-logo-dark.svg'
    },
    nav: [
      ...enUSNav,
      { text: 'GitHub', link: 'https://github.com/grekt-labs' }
    ],

    sidebar: enUSSidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/grekt-labs' }
    ]
  }
})
