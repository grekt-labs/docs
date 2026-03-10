const SITE_URL = 'https://grekt.com'
const SITE_NAME = 'grekt'
const SITE_TITLE = 'grekt - Open source MCP & AI tool manager'
const SITE_DESCRIPTION = 'Audit, manage, and version MCPs, AI agents, skills, and prompts across Claude Code, Cursor, and more. Lockfile-based installs, security scanning, drift detection, and self-hosted registry. Free and open source.'
const OG_IMAGE = `${SITE_URL}/og.png`

const faqItems = [
  {
    question: 'What is grekt?',
    answer: 'grekt is an open source MCP and AI tool manager. It audits, versions, and secures MCPs, agents, skills, hooks, and commands across Claude Code, Cursor, OpenCode, and more. Everything runs locally on your machine with no cloud dependency.'
  },
  {
    question: 'How does grekt work?',
    answer: 'Install AI artifacts with a single CLI command. grekt downloads, organizes, and locks them with SHA-verified lockfiles for deterministic, reproducible installs. Sync versioned artifacts to specific AI tools or use lazy mode to load them on demand.'
  },
  {
    question: 'Is grekt free?',
    answer: 'The CLI is source available and free. The public registry is free for open artifacts. Self-hosted registries run on your own infrastructure at no cost.'
  },
  {
    question: 'Which AI tools are supported?',
    answer: 'Claude Code, Cursor, OpenCode, and any tool that reads markdown files. Custom targets let you integrate any AI coding assistant into the grekt workflow.'
  },
  {
    question: 'Can I create my own artifacts?',
    answer: 'Artifacts follow a versioned schema with support for agents, skills, hooks, and commands. Create them locally or publish to a registry for team-wide use.'
  },
  {
    question: 'How do I manage MCP servers across projects?',
    answer: 'grekt tracks every MCP server in your projects with version pinning and SHA integrity checks. Run grekt check to detect drift, grekt scan to audit for prompt injection, and grekt sync to distribute configurations across your AI tools.'
  },
  {
    question: 'How do I version AI prompts and rules?',
    answer: 'grekt uses lockfile-based version management for all AI artifacts including prompts, rules, skills, and agent configurations. Pin specific versions, update with rollback support, and share exact configurations across your team.'
  },
  {
    question: 'Can I scan MCPs for security issues?',
    answer: 'Run grekt scan to check any artifact for prompt injection, data exfiltration, and other security risks. Artifacts published to the grekt registry are scanned automatically before listing.'
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
    applicationSubCategory: 'AI Development Tools',
    operatingSystem: 'macOS, Linux, Windows',
    description: SITE_DESCRIPTION,
    keywords: 'MCP manager, AI tool manager, MCP security scanner, prompt injection detection, AI artifact registry, version management AI tools, Claude Code extensions, Cursor rules manager',
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
