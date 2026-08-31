import { HookContext } from '@feathersjs/feathers';

export default function (options: any) {
  options.models = options.models || [];

  return async (context: HookContext) => {
    const sequelize = context.params.sequelize || {};
    const include = sequelize.include || [];

    //	Reasign in case we created these properties
    sequelize.include = include.concat(
      options.models.map((model: { model: string | number }) => {
        const newModel = { ...model };

        newModel.model = context.app.services[model.model].Model;
        return newModel;
      })
    );

    //	Nested output
    sequelize.raw = false;

    context.params.sequelize = sequelize;
    return context;
  };
}
