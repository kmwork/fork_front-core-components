// import bind from 'lodash-decorators/bind';

import SubModuleFactory from '@kmwork/front-core/lib/modules/SubModuleFactory';
import ParentServerRunner from '@kmwork/front-core/lib/server/CoreServerRunner';
// import serverConfig from '@kmwork/front-core/lib/server/server-config';

import ClientRunner from '../client/ClientRunner';

export default class ServerRunner extends ParentServerRunner {
  createClientRunner() {
    return new ClientRunner();
  }

  loadServerSubModules() {
    return [
      ...super.loadServerSubModules(),
      ...SubModuleFactory.loadSubModules(
        require.context('../modules', true, /^\.\/(.*)\/server\/index\.js/gi),
        SubModuleFactory.SUB_MODULE_TYPES.SERVER
      ),
    ];
  }
}

