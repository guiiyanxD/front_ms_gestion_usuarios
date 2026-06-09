import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'estadisticas',
  exposes: {
    './Routes': 'apps/estadisticas/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
