export const enUSSidebar = {
  '/en-US/docs/': [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/en-US/docs/guide/introduction' },
        { text: 'Quick Start', link: '/en-US/docs/guide/getting-started' },
        { text: 'Authentication', link: '/en-US/docs/guide/authentication' }
      ]
    },
    {
      text: 'Core Concepts',
      items: [
        { text: 'Artifacts', link: '/en-US/docs/guide/artifacts' },
        { text: 'Targets', link: '/en-US/docs/guide/targets' }
      ]
    },
    {
      text: 'Registries',
      items: [
        { text: 'Overview', link: '/en-US/docs/guide/registries/overview' },
        { text: 'GitHub', link: '/en-US/docs/guide/registries/github' },
        { text: 'GitLab', link: '/en-US/docs/guide/registries/gitlab' },
        { text: 'Authentication', link: '/en-US/docs/guide/registries/authentication' }
      ]
    },
    {
      text: 'Publishing',
      items: [
        { text: 'Publishing Artifacts', link: '/en-US/docs/guide/publishing' }
      ]
    }
  ],
  '/en-US/api/': [
    {
      text: 'Authentication',
      items: [
        { text: 'grekt login', link: '/en-US/api/login' },
        { text: 'grekt logout', link: '/en-US/api/logout' },
        { text: 'grekt whoami', link: '/en-US/api/whoami' }
      ]
    },
    {
      text: 'Artifact Management',
      items: [
        { text: 'grekt init', link: '/en-US/api/init' },
        { text: 'grekt add', link: '/en-US/api/add' },
        { text: 'grekt install', link: '/en-US/api/install' },
        { text: 'grekt remove', link: '/en-US/api/remove' },
        { text: 'grekt list', link: '/en-US/api/list' }
      ]
    },
    {
      text: 'Registry Operations',
      items: [
        { text: 'grekt publish', link: '/en-US/api/publish' },
        { text: 'grekt deprecate', link: '/en-US/api/deprecate' },
        { text: 'grekt undeprecate', link: '/en-US/api/undeprecate' },
        { text: 'grekt info', link: '/en-US/api/info' },
        { text: 'grekt versions', link: '/en-US/api/versions' }
      ]
    },
    {
      text: 'Sync & Config',
      items: [
        { text: 'grekt sync', link: '/en-US/api/sync' },
        { text: 'grekt check', link: '/en-US/api/check' },
        { text: 'grekt config', link: '/en-US/api/config' }
      ]
    }
  ]
}

export const enUSNav = [
  { text: 'Home', link: '/' },
  { text: 'Docs', link: '/en-US/docs/guide/introduction' },
  { text: 'API', link: '/en-US/api/' }
]
