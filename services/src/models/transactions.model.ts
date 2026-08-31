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
  const transactions = sequelizeClient.define(
    'transactions',
    {
      hash: { type: DataTypes.STRING, primaryKey: true },
      nonce: { type: DataTypes.BIGINT },
      transaction_index: { type: DataTypes.BIGINT },
      from_address: { type: DataTypes.STRING },
      to_address: { type: DataTypes.STRING },
      value: { type: DataTypes.INTEGER },
      gas: { type: DataTypes.BIGINT },
      gas_price: { type: DataTypes.BIGINT },
      input: { type: DataTypes.TEXT },
      receipt_cumulative_gas_used: { type: DataTypes.BIGINT },
      receipt_gas_used: { type: DataTypes.BIGINT },
      receipt_contract_address: { type: DataTypes.STRING },
      receipt_root: { type: DataTypes.STRING },
      receipt_status: { type: DataTypes.BIGINT },
      block_timestamp: { type: DataTypes.DATE },
      block_number: { type: DataTypes.BIGINT },
      block_hash: { type: DataTypes.STRING },
    },
    {
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = true;
        },
      },
      schema,
    }
  );

  // define relations
  (transactions as any).associate = function (models: any): void {
    const { logs, token_transfers, blocks } = models;

    transactions.hasMany(logs, {
      foreignKey: 'transaction_hash',
    });
    transactions.hasMany(token_transfers, {
      foreignKey: 'transaction_hash',
    });
    transactions.belongsTo(blocks, {
      foreignKey: 'hash',
    });
  };

  return transactions;
}
