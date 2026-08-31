import {
  QueryCommandOutput,
  ScanCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { zipObject } from 'lodash';

export function wrapExpression(params: any, prefix = ''): any {
  const keys = Object.keys(params).map((key) => `${prefix}${key}`);
  const values = Object.values(
    marshall(params, {
      convertClassInstanceToMap: true,
      removeUndefinedValues: true,
    })
  );

  return zipObject(keys, values);
}

export function wrapKeys(params: any): any {
  const keys = Object.keys(params).map((key) => `#${key}`);
  const values = Object.keys(params);

  return zipObject(keys, values);
}

export function wrapAttributes(params: any) {
  return marshall(params, {
    convertClassInstanceToMap: true,
    removeUndefinedValues: true,
    convertEmptyValues: true,
  });
}

export function generateCondition(params: any): string {
  const out: string[] = [];
  const keys = Object.keys(params);

  keys.forEach((key) => out.push(`#${key} = :${key}`));

  return out.join(' and ');
}

export function parseOutput(
  output: ScanCommandOutput | QueryCommandOutput | undefined
): any {
  const items =
    (Array.isArray(output?.Items) && output?.Items?.map(mapItem)) ||
    mapItem(output);

  return items;
}

export function mapItem(item: any): any {
  return unmarshall(item);
}

export function camelToUnderscore(data: any): any {
  const keys = Object.keys(data).map((key) =>
    key.replace(/([A-Z])/g, '_$1').toLowerCase()
  );
  const values = Object.values(data);

  return zipObject(keys, values);
}

export function parseIdentifier(id: string): string {
  return id?.split('~')[1] ?? id;
}
