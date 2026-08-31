import neo4j from 'neo4j-driver';
import { AppService, ServiceOptions } from './app_service';
import { Application } from '../declarations';

export class Neo4jService extends AppService {
  protected options: ServiceOptions;
  protected app: Application;
  protected client: any;

  constructor(options: ServiceOptions, app: Application) {
    super(options, app);

    this.options = options;
    this.app = app;

    this.client = neo4j.driver('neo4j+s://663cadde.databases.neo4j.io', neo4j.auth.basic('neo4j', '4QBPTfEwfmauH_KgWvMG4owkbinrijRmfz89lxEVnL8'));
  }
}
