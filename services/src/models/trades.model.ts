// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const {
    dialectOptions: { schema },
  } = app.get('postgres');
  const trades = sequelizeClient.define(
    'trades',
    {
      log_index: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false },
      transaction_hash: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      address: { type: DataTypes.STRING, allowNull: false },
      base_token: { type: DataTypes.STRING },
      quote_token: { type: DataTypes.STRING },
      base_in: { type: DataTypes.BIGINT },
      base_out: { type: DataTypes.BIGINT },
      quote_in: { type: DataTypes.BIGINT },
      quote_out: { type: DataTypes.BIGINT },
      price_base: { type: DataTypes.BIGINT },
      price_bnb: { type: DataTypes.BIGINT },
      price_usd: { type: DataTypes.INTEGER },
      block_number: { type: DataTypes.INTEGER },
      block_timestamp: { type: DataTypes.TIME, primaryKey: true },
      volume: { type: DataTypes.BIGINT },
      ratio: { type: DataTypes.BIGINT },
    },
    {
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = true;
          options.distinct = false;
          options.col = '*';
        },
      },
      schema,
    }
  );
  return trades;
}
