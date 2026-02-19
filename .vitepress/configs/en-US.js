export const enUSSidebar = {
  '/en-US/docs/': [
    {
      text: 'Getting started',
      items: [
        { text: 'Introduction', link: '/en-US/docs/guide/introduction' },
        { text: 'Quick start', link: '/en-US/docs/guide/getting-started' }
      ]
    },
    {
      text: 'Core concepts',
      items: [
        { text: 'Artifacts', link: '/en-US/docs/guide/artifacts' },
        { text: 'Targets', link: '/en-US/docs/guide/targets' },
        { text: 'Sync modes', link: '/en-US/docs/guide/sync-modes' },
        { text: 'Handling artifacts', link: '/en-US/docs/guide/handling' }
      ]
    },
    {
      text: 'Registries',
      items: [
        { text: 'Overview', link: '/en-US/docs/guide/sources/overview' },
        { text: 'GitHub / GitHub Enterprise', link: '/en-US/docs/guide/sources/github' },
        { text: 'GitLab / GitLab Self-hosted', link: '/en-US/docs/guide/sources/gitlab' },
        { text: 'Authentication', link: '/en-US/docs/guide/sources/authentication' }
      ]
    },
    {
      text: 'Managing',
      items: [
        { text: 'Overview', link: '/en-US/docs/guide/managing/overview' },
        { text: 'Publishing', link: '/en-US/docs/guide/managing/publishing' },
        { text: 'Publishing hooks', link: '/en-US/docs/guide/managing/hooks' },
        { text: 'Versioning', link: '/en-US/docs/guide/managing/versioning' }
      ]
    },
    {
      text: 'Configuration',
      items: [
        { text: 'Environment', link: '/en-US/docs/guide/environment' }
      ]
    },
    {
      text: 'Offline mode',
      items: [
        { text: 'Using grekt without a registry', link: '/en-US/docs/guide/offline-mode' }
      ]
    },
    {
      text: 'Legal',
      items: [
        { text: 'Licensing', link: '/en-US/docs/guide/licensing' },
        { text: 'Terms of Service', link: '/en-US/docs/guide/terms' },
        { text: 'Privacy Policy', link: '/en-US/docs/guide/privacy' }
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
        { text: 'grekt versions', link: '/en-US/api/versions' },
        { text: 'grekt outdated', link: '/en-US/api/outdated' },
        { text: 'grekt upgrade', link: '/en-US/api/upgrade' }
      ]
    },
    {
      text: 'Sync & Config',
      items: [
        { text: 'grekt sync', link: '/en-US/api/sync' },
        { text: 'grekt check', link: '/en-US/api/check' },
        { text: 'grekt config', link: '/en-US/api/config' }
      ]
    },
    {
      text: 'Authoring',
      items: [
        { text: 'grekt pack', link: '/en-US/api/pack' },
        { text: 'grekt version', link: '/en-US/api/version' }
      ]
    },
    {
      text: 'Worktree',
      items: [
        { text: 'grekt worktree', link: '/en-US/api/worktree' }
      ]
    }
  ]
}

export const enUSNav = [
  { text: 'Home', link: '/' },
  { text: 'Use Cases', link: '/en-US/use-cases/' },
  { text: 'Docs', link: '/en-US/docs/guide/introduction' },
  { text: 'API', link: '/en-US/api/' }
]
