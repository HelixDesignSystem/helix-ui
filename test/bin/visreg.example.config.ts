/*
 * This is simply exported so that typescript can give you hints
 * about what your config has in it.
 */
export interface IConfig {
    githubEmail: string,
    githubName: string,
    repo: string,
};

/*
 * Configuration object for the local visreg service.
 * Needed to associate visreg job runs to your github profile.
 * Repo name can stay the same, but you should update the other
 * values and then finally, copy these changes over to the (ignored)
 * `visreg.config.ts` file.
 */
export var config: IConfig = {
    "githubEmail": "your.email@rackspace.com",
    "githubName": "name1234",
    "repo": "catalog-helix-ui-0",
}
