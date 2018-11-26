import { join } from 'path';

import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
    // this.APP_TITLE = 'Put name of your app here';
    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
      {src: 'humps/humps.js', inject: 'libs'},
      {src: 'mdbootstrap/css/bootstrap.min.css', inject: true},
      {src: 'mdbootstrap/css/mdb.min.css', inject: true},
      {src: 'mdbootstrap/js/jquery-3.3.1.min.js', inject: 'libs'},
   //   {src: 'mdbootstrap/js/tether.min.js', inject: 'libs'},
      {src: 'mdbootstrap/js/popper.min.js', inject: 'libs'},
      {src: 'mdbootstrap/js/bootstrap.min.js', inject: 'libs'},
      {src: 'mdbootstrap/js/mdb.min.js', inject: 'libs'},
      {src: 'chart.js/dist/Chart.bundle.js', inject: 'libs' },
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
      {src: `${this.ASSETS_SRC}/js/phaser/phaser.min.js`, inject: true, vendor: false},
      {src: `${this.ASSETS_SRC}/js/blockly/blockly_compressed.js`, inject: true, vendor: false},
      {src: `${this.ASSETS_SRC}/js/blockly/blocks_compressed.js`, inject: true, vendor: false},
      {src: `${this.ASSETS_SRC}/js/blockly/javascript_compressed.js`, inject: true, vendor: false},
      {src: `${this.ASSETS_SRC}/js/blockly/en.js`, inject: true, vendor: false}
    ];

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];

    // Add packages (e.g. ng2-translate)
    const additionalPackages: ExtendPackages[] = [{
      name: '@ngui/auto-complete',
      // Path to the package's bundle
      path: 'node_modules/@ngui/auto-complete/dist/auto-complete.umd.js'
    },
    {
      name: 'ng5-breadcrumb',
      // Path to the package's bundle
      path: 'node_modules/ng5-breadcrumb/bundles/breadcrumb.umd.js',
      packageMeta: {
        defaultExtension: 'js',
        // main: 'dist/lib/index', possibly required for your package, see description below
      }

    },
    {
      name: 'ng2-charts/ng2-charts',
      // Path to the package's bundle
      path: 'node_modules/ng2-charts/bundles/ng2-charts.umd.min.js',
      packageMeta: {
        defaultExtension: 'js',
        // main: 'dist/lib/index', possibly required for your package, see description below
      }

    },
    {
      name: 'ng2-dnd',
      // Path to the package's bundle
      path: 'node_modules/ng2-dnd/bundles/index.umd.js'
    }];

    this.addPackagesBundles(additionalPackages);

    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }

}
