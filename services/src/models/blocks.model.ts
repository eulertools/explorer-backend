// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const {
    dialectOptions: { schema },
  } = app.get('postgres');
  const blocks = sequelizeClient.define(
    'blocks',
    {
      number: { type: DataTypes.BIGINT, primaryKey: true },
      hash: { type: DataTypes.STRING, primaryKey: true },
      parent_hash: { type: DataTypes.STRING },
      nonce: { type: DataTypes.STRING },
      sha3_uncles: { type: DataTypes.STRING },
      logs_bloom: { type: DataTypes.TEXT },
      transactions_root: { type: DataTypes.STRING },
      state_root: { type: DataTypes.STRING },
      receipts_root: { type: DataTypes.STRING },
      miner: { type: DataTypes.STRING },
      difficulty: { type: DataTypes.BIGINT },
      total_difficulty: { type: DataTypes.BIGINT },
      size: { type: DataTypes.BIGINT },
      extra_data: { type: DataTypes.TEXT },
      gas_limit: { type: DataTypes.BIGINT },
      gas_used: { type: DataTypes.BIGINT },
      timestamp: { type: DataTypes.DATE },
      transaction_count: { type: DataTypes.BIGINT },
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
  (blocks as any).associate = function (models: any): void {
    blocks.hasMany(models.transactions, {
      foreignKey: 'block_hash',
      sourceKey: 'hash',
    });
  };

  return blocks;
}
