// Initializes the `datatables` service on path `/datatables`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Data } from '../app_service';
import { Datatables } from './datatables.class';
import hooks from './datatables.hooks';
import { DatatablesV2 } from './datatablesV2.class';

export default function(app: Application): void {
  // Initialize our service with any options it requires
  app.use('/datatables', new Datatables({}, app));

  app.use('/v2/datatables', new DatatablesV2({}, app));
  // Get our initialized service so that we can register hooks
  const service = app.service('datatables');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`datatables-${connection?.user?.user_sub}`).join(connection);
  });
}
