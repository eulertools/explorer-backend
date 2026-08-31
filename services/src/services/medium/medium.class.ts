import { Paginated, Params } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { AppService, Data, ServiceOptions } from '../app_service';
import { FeathersError } from '@feathersjs/errors';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const medium = require('@giuseppecampanelli/medium-api');

export class Medium extends AppService {
  protected twitter: any;

  constructor(options: ServiceOptions, app: Application) {
    super(options, app);
  }

  async find(params?: Params): Promise<Data[] | Paginated<Data> | any> {
    let response;
    const profile = params?.query?.profile;
    const topic = params?.query?.topic;

    try {
      const data = await medium[profile ? 'profile' : 'topic'].getRecentPosts(
        profile || topic
      );
      response = data;
    } catch (err) {
      return new FeathersError(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        err?.message,
        'BadRequest',
        400,
        'bad-request',
        {}
      );
    }

    return response;
  }
}
