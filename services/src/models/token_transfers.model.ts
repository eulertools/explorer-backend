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
  const token_transfers = sequelizeClient.define(
    'token_transfers',
    {
      token_address: { type: DataTypes.STRING },
      from_address: { type: DataTypes.STRING },
      to_address: { type: DataTypes.STRING },
      value: { type: DataTypes.BIGINT },
      transaction_hash: { type: DataTypes.STRING, primaryKey: true },
      log_index: { type: DataTypes.BIGINT, primaryKey: true },
      block_timestamp: { type: DataTypes.DATE, primaryKey: true },
      block_number: { type: DataTypes.BIGINT },
      price_usd: { type: DataTypes.BIGINT },
      block_hash: { type: DataTypes.STRING },
    },
    {
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = false;
        },
      },
      schema,
    }
  );

  // define relations
  (token_transfers as any).associate = function (models: any): void {
    const { transactions } = models;
    token_transfers.belongsTo(transactions, {
      foreignKey: 'transaction_hash',
    });
  };

  return token_transfers;
}
