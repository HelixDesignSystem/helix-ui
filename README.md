# HelixUI

## Developer Setup

0. [install yarn](https://yarnpkg.com/en/docs/install)
0. `yarn install` to install project dependencies
0. `yarn start` to begin working


### Key Files/Directories
Path | Ship? | Notes
----- | ----- | -----
`source/_posts/` | No | HelixUI release notes
`source/components/` | No | Source files for components and their documentation
`source/scripts/explorer.js` | No | Component explorer behavior
`source/scripts/helix-ui.js` | Yes | HelixUI behaviors
`source/styles/helix-ui.less` | Yes | HelixUI styles
`source/styles/bootstrap.helix.less` | Yes | Helix theme of Bootstrap 3
`source/styles/explorer.less` | No | Component explorer appearance
`public/` | No | Generated output
`themes/helix-ui/` | No | Component explorer layout


## Deploy Docs
* `hexo deploy -g`
  * See https://hexo.io/docs/commands.html#deploy
  * See https://github.com/hexojs/hexo-deployer-git
