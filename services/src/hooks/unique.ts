/*
 * Force uniqueness for DynamoDataService's create method.
 * It filters by user as default and takes additional fields to check uniqueness.
 */
import { HookContext } from '@feathersjs/feathers';
import { FeathersError } from '@feathersjs/errors';
import pick from 'lodash/pick';

export default function unique(fields: string[] = [], options: any = {}) {
  return async function (context: HookContext): Promise<HookContext> {
    const internalKey = context.app.get('internalKey');
    const { data = null } = context;
    const { user } = context.params;

    if (data && user?.user_sub) {
      const attrs = pick(data, fields);
      const { count = 0 } = await context.service.find({
        query: { user_sub: user.sub, ...attrs },
        is_count: true,
        internalKey,
      });

      if (count > 0) {
        throw new FeathersError(
          options.message || `User has already created an item for ${context.path}`,
          'BadRequest',
          406,
          'bad-request',
          {}
        );
      }
    }

    return context;
  };
}
