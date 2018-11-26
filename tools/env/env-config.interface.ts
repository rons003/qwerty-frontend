// Feel free to extend this interface
// depending on your app specific config.
export interface EnvConfig {
  ENVIRONMENT?: string;
  API_ENDPOINT?: string;
  PHASER_DISPLAY_SIZE?: {
    width: number,
    height: number
  };
  BLOCKLY_DISPLAY_SIZE?: {
    height: number
  };
}
