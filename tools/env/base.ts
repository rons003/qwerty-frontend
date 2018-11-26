import { EnvConfig } from './env-config.interface';

const BaseConfig: EnvConfig = {
  ENVIRONMENT: 'base',
  API_ENDPOINT: 'https://gakkoblocks.codegakko.com/db',
  PHASER_DISPLAY_SIZE: {
    width: 400,
    height: 400
  },
  BLOCKLY_DISPLAY_SIZE: {
    height: 400
  }
};

export = BaseConfig;
