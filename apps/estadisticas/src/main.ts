import { setRemoteDefinitions } from '@nx/angular/mf';

fetch('/module-federation.manifest.json')
  .then((r) => r.json())
  .then((definitions) => setRemoteDefinitions(definitions))
  .then(() => import('./bootstrap').then((m) => m.bootstrap()));
