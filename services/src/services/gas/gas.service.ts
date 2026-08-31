// Initializes the `gas` service on path `/gas`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Gas } from './gas.class';
import hooks from './gas.hooks';

// Add this service to the service type index
export default function (app: Application): void {
  const { poolsNode: node } = app.get('web3');

  const options = {
    paginate: app.get('paginate'),
    node,
  };

  // Initialize our service with any options it requires
  app.use('/gas', new Gas(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('gas');

  service.hooks(hooks);

  // Setup live channel
  service.publish(channelMiddleware);

  app.options('connection', (connection: any): void => {
    app.channel(`gas-${connection?.user?.user_sub}`).join(connection)
  })
}
