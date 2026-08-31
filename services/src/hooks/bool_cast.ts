import { HookContext } from '@feathersjs/feathers';
import isString from 'lodash/isString';

export default function (context: HookContext): HookContext {
  const { query = null } = context.params;
  const { data = null } = context;

  if (query) {
    Object.keys(query).forEach((key) => {
      if (isString(query[key]) && /^(?:true|false)$/.test(query[key])) {
        query[key] = (query[key] === 'true' && true) || false;
      }
    });

    context.params.query = query;
  }

  if (data) {
    Object.keys(data).forEach((key) => {
      if (isString(data[key]) && /^(?:true|false)$/.test(data[key])) {
        data[key] = (data[key] === 'true' && true) || false;
      }
    });

    context.data = data;
  }

  return context;
}
