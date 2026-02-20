import { defineConfig } from 'vitepress'
import { createSitemapItems } from './sitemap'
import { enUSSidebar, enUSNav } from './configs/en-US'
import { transformHead, SITE_TITLE, SITE_DESCRIPTION, OG_IMAGE } from './seo'

export default defineConfig({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  srcExclude: ['BRAND.md', 'README.md'],

  sitemap: {
    hostname: 'https://grekt.com',
    transformItems: createSitemapItems,
  },

  transformHead,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-48x48.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#77cabd' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'grekt' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:image', content: OG_IMAGE }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'grekt - The open artifact manager for AI tools' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: OG_IMAGE }],
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

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/grekt-labs' }
    ]
  }
})
