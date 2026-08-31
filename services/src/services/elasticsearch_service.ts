import { Client } from '@opensearch-project/opensearch';
import { AppService, ServiceOptions } from './app_service';
import { Application } from '../declarations';

export class ElasticSearchService extends AppService {
  protected options: ServiceOptions;
  protected app: Application;
  protected client: Client;

  constructor(options: ServiceOptions, app: Application) {
    super(options, app);

    this.options = options;
    this.app = app;
    
    this.client = new Client({
      node: app.get('elasticsearch'),
      ssl: {
        rejectUnauthorized: false,
      },
      auth: {
        username: app.get('elasticsearch_username'),
        password: app.get('elasticsearch_password')
      },
      maxRetries: 5,
      requestTimeout: 60000,
      sniffOnStart: false,
    });
  }
}
