module.exports = {
  branch: 'main',
  branches: [{ name: 'main' }, { channel: 'chore/setup-monorepo', name: 'alpha', prerelease: true }],
  plugins: [
    '@semantic-release/changelog',
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          { release: 'minor', type: 'feat' },
          { release: 'patch', scope: 'README', type: 'docs' },
          { release: 'patch', type: 'refactor' },
          { release: 'patch', type: 'style' },
          { release: 'patch', type: 'chore' },
          { release: 'patch', type: 'perf' },
          { release: 'patch', type: 'test' },
          { release: 'patch', type: 'bug' },
          { release: 'patch', type: 'fix' },
        ],
      },
    ],
    [
      '@semantic-release/git',
      {
        message: 'chore(release): ${nextRelease.version}\n\n${nextRelease.notes}',
      },
    ],
  ],
}
