#!/usr/bin/env node

import { devToMain } from '../publish/update-repo.js';

(async () => {
  devToMain();
})();
