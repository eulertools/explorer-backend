/*
 * Authentication hook to be run as a "before all" hook
 */
import { FeathersError } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import first from 'lodash/first';
import { AclRule } from '../acl';
import aclHook from '../acl/hook';
import userMock from '../mocks/user.json';
import { User } from '../models/user.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CognitoExpress = require('cognito-express');

// pseudo singleton
let cognitoExpress: any = null;

function initCognito(settings: any) {
  // initialize cognito if not done yet
  if (!cognitoExpress) {
    const {
      userPoolId: cognitoUserPoolId,
      region,
      tokenUse = 'id',
      tokenExpiration = 3600000,
    } = settings;

    cognitoExpress = new CognitoExpress({
      region,
      cognitoUserPoolId,
      tokenUse,
      tokenExpiration,
    });
  }

  return cognitoExpress;
}

interface AuthOptions {
  acl: AclRule[];
}

export function websocketHook(app: any) {
  return function (socket: any, next: any) {
    if (socket?.handshake?.query?.token) {
      const token = socket?.handshake?.query?.token;
      const { cognito: config } = app.get('authentication');
      const cognito = initCognito(config);

      cognito.validate(token, function (err: any, response: any) {
        if (err) {
          next();
        } else {
          const { username, user_sub, scope } = response;
          socket.feathers.user = { username, user_sub, scope };

          next();
        }
      });
    } else {
      next();
    }
  };
}

export default function (options: AuthOptions) {
  const { acl } = options;

  return async (context: HookContext): Promise<any> => {
    return new Promise((resolve, reject) => {
      const path: AclRule | undefined = acl.find(
        (path: AclRule) => path.service === context.path
      );
      const methods = Object.keys(path?.methods || []);
      const protectedMethod = methods.find(
        (action) => action === context.method
      );
      const isInternalCall =
        context.app.get('internalKey') === context.params?.internalKey ?? false;
      const isTest = process.env.NODE_ENV === 'test';

      if (isInternalCall) {
        resolve(context);
      } else if (protectedMethod) {
        const { cognito: config } = context.app.get('authentication');
        const cognito = initCognito(config);
        const idToken = (
          context?.params?.headers?.authorization ??
          context.data?.idToken ??
          ''
        ).replace(/^Bearer (.*)$/gi, '$1');

        if (!isTest) {
          cognito.validate(
            idToken,
            async function (err: any, response: any) {
              if (err) {
                reject(
                  new FeathersError(
                    'Invalid id token',
                    'BadRequest',
                    403,
                    'bad-request',
                    {}
                  )
                );
              } else {
                const { username, sub, scope, address }: User = response;
                const user: User = { username, user_sub: sub!, scope, address };
                const internalKey = context.app.get('internalKey');

                // retrieve current subscription for user
                const userSubscription = first(
                  await context.app.service('subscriptions').find({
                    internalKey,
                    user,
                  })
                );

                context.params = {
                  ...context.params,
                  user: { ...user, subscription: userSubscription },
                };

                resolve(aclHook({ acl })(context));
              }
            }
          );
        } else {
          const { username, user_sub, scope, address }: User = userMock;

          context.params = {
            ...context.params,
            user: { username, user_sub, scope, address },
          };

          resolve(context);
        }
      } else {
        resolve(context);
      }
    });
  };
}
