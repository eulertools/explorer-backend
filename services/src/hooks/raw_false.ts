import { HookContext } from '@feathersjs/feathers';

export default function rawFalse(context: HookContext): any {
  if (!context.params.sequelize) context.params.sequelize = {};

  Object.assign(context.params.sequelize, { raw: false });

  return context;
}
