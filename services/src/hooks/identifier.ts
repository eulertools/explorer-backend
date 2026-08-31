import { HookContext } from '@feathersjs/feathers';
import isArray from 'lodash/isArray';
import pluralize from 'pluralize';
import { v4 } from 'uuid';
import { parseIdentifier } from '../utils/dynamo_utils';

export default function (context: HookContext): HookContext {
  const serviceId = pluralize.singular(context.path);
  const isBeforeCreate =
    context.method === 'create' && context.type === 'before';
  const isBeforeUpdate =
    context.method === 'update' && context.type === 'before';
  const isAfterCreate = context.method === 'create' && context.type === 'after';
  const isAfterUpdate = context.method === 'update' && context.type === 'after';
  const isAfterFind = context.method === 'find' && context.type === 'after';
  const isAfterGet = context.method === 'get' && context.type === 'after';

  context.params.identifierPrefix = serviceId;
  context.params.identifier = `${serviceId}~${String(context.id)}`;

  if (isBeforeCreate) {
    // we update the POST data and generate an ID
    context.data.identifier = `${serviceId}~${v4()}`;
  } else if (isBeforeUpdate) {
    // we update the PUT data to match DB's
    context.data.identifier = `${serviceId}~${String(context.id)}`;
  } else if (isAfterCreate || isAfterUpdate || isAfterGet || isAfterFind) {
    // we humanize the ID for client/UI
    if (isArray(context.result)) {
      context.result = context.result.map((doc) => ({
        ...doc,
        identifier: parseIdentifier(doc.identifier),
      }));
    } else if (context.result?.identifier) {
      context.result.identifier = parseIdentifier(context.result.identifier);
    }
  }

  return context;
}
