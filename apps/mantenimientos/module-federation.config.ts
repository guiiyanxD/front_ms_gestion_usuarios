import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'mantenimientos',
  exposes: {
    './Routes': 'apps/mantenimientos/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
