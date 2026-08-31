import { HookContext } from '@feathersjs/feathers';

export default function (context: HookContext): HookContext {
  context.params.is_count = true;

  return context;
}
