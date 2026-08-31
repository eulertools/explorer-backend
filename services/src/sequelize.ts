import { Options, Sequelize } from 'sequelize';
import { Application } from './declarations';

export default function (app: Application): void {
  const options: Options = app.get('postgres');

  const sequelize = new Sequelize(options);
  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelize);

  app.setup = function (...args): Application {
    const result = oldSetup.apply(this, args);

    return result;
  };
}
