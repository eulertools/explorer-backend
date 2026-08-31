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
  const logs = sequelizeClient.define(
    'logs',
    {
      log_index: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false },
      transaction_hash: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      transaction_index: { type: DataTypes.BIGINT, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      data: { type: DataTypes.TEXT, allowNull: true },
      topic0: { type: DataTypes.STRING, allowNull: true },
      topic1: { type: DataTypes.STRING, allowNull: true },
      topic2: { type: DataTypes.STRING, allowNull: true },
      topic3: { type: DataTypes.STRING, allowNull: true },
      block_timestamp: { type: DataTypes.TIME, allowNull: true },
      block_number: { type: DataTypes.BIGINT, allowNull: true },
      block_hash: { type: DataTypes.STRING, allowNull: true },
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
  (logs as any).associate = function (models: any): void {
    logs.belongsTo(models.transactions, {
      foreignKey: 'transaction_hash',
    });
  };

  return logs;
}
