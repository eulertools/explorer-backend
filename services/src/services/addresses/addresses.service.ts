// Initializes the `addresses` service on path `/addresses`
import { Application } from '../../declarations';
import hooks from './addresses.hooks';
import { Stacking } from './stacking.class';
import { Addresses } from "./addresses.class";

export default function (app: Application): void {
  const {poolsNode: node} = app.get('web3');
  const {
    tables: {userEntities},
  } = app.get('dynamodb');
  const options = {
    paginate: app.get('paginate'),
    node,
    table: userEntities,
    primaryKey: 'identifier',
  };

  // Initialize our service with any options it requires
  app.use('/addresses', new Addresses(options, app));

  app.use('/stacking', new Stacking(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('addresses');

  service.hooks(hooks);

  // setup live channel
  service.publish((data: any, context: any) => {
    return app.channel('addresses');
  });

  app.on('connection', (connection: any): void => {
    app.channel('addresses').join(connection);
  });
}
