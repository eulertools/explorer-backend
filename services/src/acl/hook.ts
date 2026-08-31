/**
 * ACL hook. To be run from within auth hook as it depends on the 'user' param set in there.
 * Define the rules in src/acl/index.ts
 */
import { FeathersError } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { AclRule, Rule } from './index';
import { SubscriptionSettings } from '../models/subscription_settings.model';

interface AclOptions {
  acl: AclRule[];
}

export default function (options: AclOptions): any {
  const { acl } = options;

  return function (context: HookContext): Promise<HookContext> {
    return new Promise((resolve, reject) => {
      const isInternalCall =
        context.app.get('internalKey') === context.params?.internalKey ?? false;
      const { user } = context.params;
      const aclRule: AclRule | undefined = acl.find(
        (path: AclRule) => path.service === context.path
      );
      const methods = Object.keys(aclRule?.methods || []);
      const protectedMethod = methods.find(
        (action) => action === context.method
      );

      if (isInternalCall) {
        return resolve(context);
      } else if (protectedMethod) {
        if (!user) {
          throw new FeathersError(
            'No user is set',
            'BadRequest',
            403,
            'bad-request',
            {}
          );
        }

        // load up all defined rules
        const settings: SubscriptionSettings[] = context.app.get(
          'subscription_settings'
        );
        const rules: Rule[] | undefined =
          aclRule?.methods[protectedMethod].rules;
        const allows: any = rules?.map((rule: Rule) => rule.allow);
        const all = Promise.all(
          allows?.map((allow: any, ix: number) =>
            allow(user, context, settings)
          )
        );

        // run all rules' allow methods
        all
          .then((alloweds) => {
            const blockIxs: number[] = alloweds
              .map((allowed, ix) => (allowed === false ? ix : undefined))
              .filter((ix) => ix !== undefined) as number[];

            // some rules didn't pass
            if (blockIxs.length > 0) {
              const errors = blockIxs
                .map((ix) => (rules && rules[ix] ? rules[ix].error : undefined))
                .filter(Boolean);

              throw new FeathersError(
                errors.join('. '),
                'BadRequest',
                403,
                'bad-request',
                {}
              );
            } else {
              // all good, go on
              return resolve(context);
            }
          })
          .catch(reject);
      } else {
        return resolve(context);
      }
    });
  };
}
