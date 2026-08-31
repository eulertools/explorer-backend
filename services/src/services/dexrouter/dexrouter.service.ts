// Initializes the `dexrouter` service on path `/dexrouter`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Dexrouter } from './dexrouter.class';
import hooks from './dexrouter.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'dexrouter': Dexrouter & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/dexrouter', new Dexrouter(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('dexrouter');

  service.hooks(hooks);
}
