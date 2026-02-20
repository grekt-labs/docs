const SITE_URL = 'https://grekt.com'
const SITE_NAME = 'grekt'
const SITE_TITLE = 'grekt - The open artifact manager for AI tools'
const SITE_DESCRIPTION = 'Manage and sync AI tool configurations. The open CLI for prompt templates, system instructions, MCP configs, and more.'
const OG_IMAGE = `${SITE_URL}/og.png`

const faqItems = [
  {
    question: 'What is grekt?',
    answer: 'grekt is the open artifact manager for AI tools. It helps you install, sync, share, and check for security or drifts. It works with agents, skills, hooks, and other AI configurations across any tool available like Claude Code, Cursor, OpenCode, and more.'
  },
  {
    question: 'How does grekt work?',
    answer: 'Add artifacts with a single command, grekt handles downloading and organizing them in your project. Optionally sync to specific tools or use lazy mode to load artifacts on demand from the .grekt folder, keeping your context lean. A lockfile tracks versions and integrity so installs are deterministic.'
  },
  {
    question: 'Is grekt free?',
    answer: 'Yes! The CLI is source available and free to use. The public registry is free for public artifacts, and self-hosted registries are on your own, so free too.'
  },
  {
    question: 'Which AI tools are supported?',
    answer: 'Claude Code, Cursor, OpenCode, and any tool that reads markdown files. You can also define custom targets for any AI tool you use.'
  },
  {
    question: 'Can I create my own artifacts?',
    answer: 'Yes! You can create artifacts for your own use or publish them to share with others. Check the documentation for the artifact format specification.'
  }
]

function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }
}

function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: 'grekt-labs',
      url: 'https://github.com/grekt-labs'
    }
  }
}

function buildSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Linux, Windows',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    author: {
      '@type': 'Organization',
      name: 'grekt-labs',
      url: 'https://github.com/grekt-labs'
    }
  }
}

function buildBreadcrumbSchema(pageUrl, pageTitle) {
  const path = pageUrl.replace(SITE_URL, '').replace(/\.html$/, '').replace(/\/$/, '')
  const segments = path.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const items = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }
  ]

  let currentPath = SITE_URL
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: index === segments.length - 1 ? pageTitle : segment.replace(/-/g, ' '),
      item: currentPath
    })
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  }
}

/**
 * VitePress transformHead hook.
 * Injects per-page canonical, OG tags, Twitter tags, and JSON-LD schemas.
 */
export function transformHead(context) {
  const { pageData } = context
  const relativePath = pageData.relativePath.replace(/\.md$/, '.html').replace(/index\.html$/, '')
  const pageUrl = `${SITE_URL}/${relativePath}`
  const pageTitle = pageData.title ? `${pageData.title} | ${SITE_NAME}` : SITE_TITLE
  const pageDescription = pageData.description || SITE_DESCRIPTION
  const isHomePage = relativePath === '' || relativePath === 'index.html'

  const head = []

  // Per-page canonical
  head.push(['link', { rel: 'canonical', href: pageUrl }])

  // Per-page OG tags
  head.push(['meta', { property: 'og:title', content: pageTitle }])
  head.push(['meta', { property: 'og:description', content: pageDescription }])
  head.push(['meta', { property: 'og:url', content: pageUrl }])

  // Per-page Twitter tags
  head.push(['meta', { name: 'twitter:title', content: pageTitle }])
  head.push(['meta', { name: 'twitter:description', content: pageDescription }])

  // JSON-LD schemas
  const schemas = []

  if (isHomePage) {
    schemas.push(buildWebSiteSchema())
    schemas.push(buildSoftwareApplicationSchema())
    schemas.push(buildFaqSchema())
  }

  const breadcrumb = buildBreadcrumbSchema(pageUrl, pageData.title || SITE_NAME)
  if (breadcrumb) {
    schemas.push(breadcrumb)
  }

  schemas.forEach(schema => {
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify(schema)])
  })

  return head
}

export { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, OG_IMAGE, SITE_NAME }
