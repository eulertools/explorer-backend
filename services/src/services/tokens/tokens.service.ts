// Initializes the `tokens` service on path `/pairs`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Tokens } from './tokens.class';
import { Tokensv2 } from './tokensv2.class';
import { TokensSecurity } from './tokens_security.class'
import hooks from './tokens.hooks';

export function tokens (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/tokens', new Tokens(options, app));
  app.use('/v2/tokens', new Tokensv2(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tokens');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`tokens`).join(connection);
  });
}

export function tokens_security(app: Application): void{
  const options = {
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/tokens_security', new TokensSecurity(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('tokens_security')

  service.hooks(hooks);

  // Setup live channel
  service.publish(channelMiddleware);

  app.options('connection', (connection: any): void =>{
    app.channel(`tokens_security-${connection?.user?.user_sub}`).join(connection)
  })
}
