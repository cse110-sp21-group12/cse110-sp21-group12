## CI/CD Pipeline status

The pipeline at the moment consists of four separate jobs, contained within two separate Github Actions:

### `docs.yml`
- unchanged from phase 1, I think

### `lint.yml`
- The action is called as it was previously
- the main linting functionality remains as it was
- `.eslintignore` now ignores tests and configs
- This file also includes functionality for running Jest and Jest-Puppeteer tests
  - The `package.json` has been updated appropriately (jest configs, scripts.test)
  - The Jest test is its own job
    - Runs tests from `sample.test.js` (may be changed later)
  - The Jest-Puppeteer test is its own job
    - Runs tests from `sampleP.test.js` (may be changed later)
    - This uses the configs in `jest-puppeteer.config.js`

### Pipeline logic
- The jest and jest-puppeteer tests are called whenever `lint.yml`'s job is run. Consult Phase 1 for more details.