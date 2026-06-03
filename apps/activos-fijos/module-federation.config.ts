import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'activos-fijos',
  exposes: {
    './Routes': 'apps/activos-fijos/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
