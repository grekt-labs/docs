const SITE_URL = 'https://grekt.com'
const SITE_NAME = 'grekt'
const SITE_TITLE = 'grekt - Local-first AI tooling infrastructure'
const SITE_DESCRIPTION = 'Audit, manage, and secure your AI tools from the CLI. Local-first infrastructure for MCPs, agents, skills, hooks across Claude, Cursor, OpenCode.'
const OG_IMAGE = `${SITE_URL}/og.png`

const faqItems = [
  {
    question: 'What is grekt?',
    answer: 'grekt is local-first AI tooling infrastructure. It audits, manages, and secures MCPs, agents, skills, hooks, and commands across tools like Claude Code, Cursor, and OpenCode. Everything runs on your machine. No cloud dependency, no data exposure.'
  },
  {
    question: 'How does grekt work?',
    answer: 'Install artifacts with a single CLI command. grekt downloads, organizes, and locks them with SHA-verified lockfiles for deterministic installs. Sync to specific AI tools or use lazy mode to load artifacts on demand, keeping context lean.'
  },
  {
    question: 'Is grekt free?',
    answer: 'The CLI is source available and free. The public registry is free for open artifacts. Self-hosted registries run on your own infrastructure at no cost.'
  },
  {
    question: 'Which AI tools are supported?',
    answer: 'Claude Code, Cursor, OpenCode, and any tool that reads markdown files. Custom targets let you integrate any AI tool into the grekt workflow.'
  },
  {
    question: 'Can I create my own artifacts?',
    answer: 'Artifacts follow a versioned schema with support for agents, skills, hooks, and commands. Create them locally or publish to a registry for team-wide use.'
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
