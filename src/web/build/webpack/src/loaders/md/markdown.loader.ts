import { RuleSetRule } from 'webpack'

const markdownLoader: RuleSetRule = {
  test: /\.md$/,
  use: [
    {
      loader: 'html-loader',
    },
    {
      loader: 'markdown-loader',
    },
  ],
}

export default markdownLoader
