import { FeathersError } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';

export default async function (context: HookContext): Promise<HookContext> {
  const joiOptions = { convert: true, abortEarly: false };

  return new Promise((resolve, reject) => {
    // instantiate schema
    import(`../models/${context.path}.model`)
      .then((module) => {
        const { error } = module.default.validate(context.data, joiOptions);

        if (error?.details) {
          const errors = error.details.map((detail: any) => ({
            key: detail.context.key,
            msg: detail.message,
          }));

          if (process.env.NODE_ENV === 'test') {
            console.log(errors);
          }

          reject(
            new FeathersError(errors, 'BadRequest', 400, 'validation-error', {})
          );
        }
      })
      .catch(() => resolve(context))
      .finally(() => resolve(context));
  });
}
