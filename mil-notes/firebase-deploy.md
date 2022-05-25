For deploying to multiple website, [this resource](https://firebase.google.com/docs/hosting/multisites#set_up_deploy_targets) was useful. I had to create a new `index.html` inside the `source/` directory to route users to our login page.

### Multiple deployment websites
Currently, there are two deployment "targets": `testing-stegosource-9lives`, and `stegosource-9lives`. These are defined in `.firebaserc` under "targets". If you access the firebase console, and click on the "hosting" section in the left tab bar, you will see 2 sites.

These 2 sites are also defined in the `firebase.json` file. You will see two different "target"s in the "hosting" array, they are identical except for the name since we want them to deploy the same files (the `source/` directory).

### Setting firebase CLI and actually deploying
You can install the firebase CLI through npm, and login in through your google account. [This link](https://firebase.google.com/docs/cli#sign-in-test-cli) can help you with that. Logging in through the firebase CLI allows it to recognize the stegosource project and gives it access to the 2 deployment sites. Now you need to hook up the firebase CLI targets, with the deployment targets on the firebase console.

Setting up the deploy targets can be done with the following command:
```
firebase target:apply hosting TARGET_NAME RESOURCE_IDENTIFIER
```
Again the first link can help you with that, note that the `TARGET_NAME` and `RESOURCE_IDENTIFIER` I defined are the same names. For example the command I ran to connect the target `stegosource-9lives` with the hosting site `stegosource-9lives.web.app` is `firebase target:apply hosting stegosource-9lives stegosource-9lives`.

 I'm still not sure if you have to redefine the 2 targets that I originally set up, or you can simply deploy to either of them using the command `firebase deploy --only hosting:TARGET_NAME` (where `TARGET_NAME` is either "stegosource-9lives" or "testing-stegosource-9lives).


### Automated github workflows
There are currently 2 new workflow/github actions that can be found in the `.github/workflows/` folder.
- firebase-hosting-pull-request.yml - whenever a PR made, firebase will automatically deploy to a temp URL the PR's files and append that link as a comment on the PR. This is a good way to get a good preview of incoming changes and we can take a look/test it.
- firebase-hosting-merge.yml - this deploys to our primary site "stegosource-9lives" when a merge is made to `main`
