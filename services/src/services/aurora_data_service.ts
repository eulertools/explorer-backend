/*
 * A base service with an underlying data source using Auroradb thru Sequelize.
 */
import { SequelizeServiceOptions, Service } from 'feathers-sequelize';
import { Application } from '../declarations';

export interface Data {}

export class AuroraDataService extends Service {
  protected static ASSOC_STARTED = false;
  protected app: Application;

  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);

    this.app = app;
  }

  async setup(app: Application, path: string): Promise<void> {
    // attach model relations. This must happen within services initialization's context.
    if (!AuroraDataService.ASSOC_STARTED) {
      const models = app.get('models');

      Object.keys(models).forEach((name) => {
        if ('associate' in models[name]) {
          (models[name] as any).associate(models);
        }
      });

      AuroraDataService.ASSOC_STARTED = true;
    }
  }
}
