// Initializes the `voting` service on path `/voting`
import { Application } from '../../declarations';
import { Voting } from './voting.class';
import hooks from './voting.hooks';

export default function (app: Application): void {
  // Initialize our service with any options it requires
  const {
    tables: { userVotes },
  } = app.get('dynamodb');
  const options = {
    paginate: app.get('paginate'),
    table: userVotes,
    primaryKey: 'identifier',
  };

  app.use('/voting', new Voting(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('voting');

  service.hooks(hooks);

  // setup live channel
  service.publish((data: any, context: any) => context.app.channel('voting'));

  app.on('connection', (connection: any): void => {
    app.channel('voting').join(connection);
  });
}
