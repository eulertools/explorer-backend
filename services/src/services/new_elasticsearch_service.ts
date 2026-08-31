import { Client } from '@opensearch-project/opensearch';
import { AppService, ServiceOptions } from './app_service';
import { Application } from '../declarations';

export class NewElasticSearchService extends AppService {
  protected options: ServiceOptions;
  protected app: Application;
  protected client: Client;

  constructor(options: ServiceOptions, app: Application) {
    super(options, app);

    this.options = options;
    this.app = app;

    this.client = new Client({
      node: app.get('new_elasticsearch'),
      ssl: {
        rejectUnauthorized: false,
      },
      maxRetries: 5,
      requestTimeout: 60000,
      sniffOnStart: false,
    });
  }
}
