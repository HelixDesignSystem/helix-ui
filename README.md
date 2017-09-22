# HelixUI

## Developer Setup

0. [install yarn](https://yarnpkg.com/en/docs/install)
0. `yarn install` to install project dependencies
0. `yarn start` to begin working


### Key Files/Directories
Path | Ship? | Notes
----- | ----- | -----
`source/bootstrap.helix.less` | Yes | Helix theme of Bootstrap 3
`source/components/` | No | Source files for components and their documentation
`source/docs.js` | No | Documentation functionality
`source/docs.less` | No | Documentation styles
`source/helix-ui.js` | Yes | HelixUI behaviors (including web component definitions)
`source/helix-ui.less` | Yes | HelixUI styles
`public/` | No | Generated output
`source/_templates` | No | Component explorer layout templates

Changes within `source/_templates` or `source/_data` will require
restarting the development server.


## Publish Documentation
```
yarn run publish
```
