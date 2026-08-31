import { HookContext } from '@feathersjs/feathers';

const RESERVED_ATTRIBUTES = [
  '$metadata',
  'ConsumedCapacity',
  'ItemCollectionMetrics',
  'Attributes',
];
const INMUTABLE_ATTRIBUTES = [
  'created_at',
  'updated_at',
  'identifier',
  'user_sub',
];

export default function (context: HookContext): HookContext {
  RESERVED_ATTRIBUTES.forEach((attr) => {
    if (context.data) {
      delete context.data[attr];
    }

    if (context.result) {
      delete context.result[attr];
    }
  });

  if (/create|update/gi.test(context.method) && context.type === 'before') {
    INMUTABLE_ATTRIBUTES.forEach((attr) => {
      if (context.data) {
        delete context.data[attr];
      }

      if (context.result) {
        delete context.result[attr];
      }
    });
  }

  return context;
}
