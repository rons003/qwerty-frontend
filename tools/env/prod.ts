import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  ENVIRONMENT: 'prod',
  API_ENDPOINT: 'https://gakkoblocks.codegakko.com/db'
};

export = ProdConfig;
