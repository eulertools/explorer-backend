/*
 * Utility hook to invalidate any call made to a service, except internal ones.
 */
import { HookContext } from '@feathersjs/feathers';
import { FeathersError } from '@feathersjs/errors';

export default function (context: HookContext): HookContext {
  const isInternalCall =
    context.app.get('internalKey') === context.params?.internalKey ?? false;
    false;

  if (!isInternalCall) {
    throw new FeathersError(
      'This service is unavailable',
      'BadRequest',
      400,
      'bad-request',
      {}
    );
  } else {
    return context;
  }
}
