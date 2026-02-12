import { defineConfig } from 'vitepress'
import { enUSSidebar, enUSNav } from './configs/en-US'

export default defineConfig({
  title: "grekt | AI artifact manager",
  description: "Manage and sync AI tool configurations. The open CLI for prompt templates, system instructions, MCP configs, and more.",

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'canonical', href: 'https://grekt.com/' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'grekt' }],
    ['meta', { property: 'og:title', content: 'grekt | AI artifact manager' }],
    ['meta', { property: 'og:description', content: 'Manage and sync AI tool configurations. The open CLI for prompt templates, system instructions, MCP configs, and more.' }],
    ['meta', { property: 'og:url', content: 'https://grekt.com/' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:image', content: 'https://grekt.com/og.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'grekt - AI artifact manager' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'grekt | AI artifact manager' }],
    ['meta', { name: 'twitter:description', content: 'Manage and sync AI tool configurations. The open CLI for prompt templates, system instructions, MCP configs, and more.' }],
    ['meta', { name: 'twitter:image', content: 'https://grekt.com/og.png' }],
  ],

  locales: {
    'en-US': {
      label: 'English',
      lang: 'en-US',
      link: '/'
    }
  },

  themeConfig: {
    outline: [2, 3],
    siteTitle: false,
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
