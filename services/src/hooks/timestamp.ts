import { HookContext } from '@feathersjs/feathers';

export default function (context: HookContext): HookContext {
  if (context.method === 'create') {
    context.data.created_at = new Date().toISOString();
  }

  if (context.method === 'update') {
    context.data.updated_at = new Date().toISOString();
  }

  return context;
}
