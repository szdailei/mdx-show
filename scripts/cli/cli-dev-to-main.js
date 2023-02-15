#!/usr/bin/env node

import { pushToRemoteRepo, switchToMainBranch, switchToDevBranch, mergeDevBranch } from '../publish/update-repo.js'

(async () => {
  switchToMainBranch();
  mergeDevBranch();
  pushToRemoteRepo();
  switchToDevBranch();
})();
