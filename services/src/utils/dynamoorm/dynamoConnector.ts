export interface QueryResponse<T> {
  Items: T[];
  ExclusiveStartKey?: ExclusiveStartKey;
}

export interface GetResponse<T> {
  Item: T;
  ExclusiveStartKey?: ExclusiveStartKey;
}

interface ExclusiveStartKey {
  hash_key: string;
  range_key: string;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
  maxRetries: 5,
  retryDelayOptions: {
    base: 300,
  },
});

// For keeping connection live between lambda and dynamo
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { HttpsAgent } = require('agentkeepalive');

AWS.config.httpOptions = { agent: new HttpsAgent() };

export const docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-10-08',
});

export const getDynamoDocument = async <T = any>(
  table_name: string | undefined,
  hash_key: string,
  range_key: string
) => {
  const response: GetResponse<T> = await docClient
    .get({
      TableName: table_name,
      Key: { hash_key, range_key },
      FilterExpression: 'not is_deleted = :isDel',
      ExpressionAttributeValues: {
        ':isDel': true,
      },
    })
    .promise();
  return response.Item;
};

export async function getDynamoQuery(
  table_name: string | undefined,
  symbol: string
) {
  return await docClient
    .query({
      TableName: table_name,
      KeyConditionExpression: 'symbol = :hkey',
      ExpressionAttributeValues: {
        ':hkey': symbol,
      },
    })
    .promise();
}

export async function getRkBegWithDynamoQuery(
  table_name: string | undefined,
  hash_key: string,
  range_key_prefix: string
) {
  return await docClient
    .query({
      TableName: table_name,
      KeyConditionExpression:
        'hash_key = :hkey and begins_with(range_key, :rkey)',
      FilterExpression: 'not is_deleted = :isDel',
      ExpressionAttributeValues: {
        ':hkey': hash_key,
        ':rkey': range_key_prefix,
        ':isDel': true,
      },
    })
    .promise();
}

export async function getDynamoActiveItem(
  table_name: string | undefined,
  hash_key: string,
  range_key?: string
) {
  return await docClient
    .get({
      TableName: table_name,
      Key: {
        hash_key,
        range_key: range_key || '0',
      },
      FilterExpression: 'not is_deleted = :isDel',
      ExpressionAttributeValues: {
        ':isDel': true,
      },
    })
    .promise();
}

export async function getDynamoItem(
  table_name: string | undefined,
  hash_key: string,
  range_key?: string
) {
  return await docClient
    .get({
      TableName: table_name,
      Key: {
        hash_key,
        range_key: range_key || '0',
      },
    })
    .promise();
}

export async function putDynamoItemCache(
  table_name: string | undefined,
  symbol: string,
  timestamps: number | string,
  item: any
) {
  item = {
    data: item,
    symbol,
    timestamps,
    update_date: Date.now(),
  };
  return await docClient
    .put({
      TableName: table_name,
      Item: item,
    })
    .promise();
}

export async function putDynamoItem(table_name: string | undefined, item: any) {
  item = {
    ...item,
    update_date: Date.now(),
  };
  return await docClient
    .put({
      TableName: table_name,
      Item: item,
    })
    .promise();
}

export async function deleteDynamoItem(
  table_name: string | undefined,
  hash_key: string,
  range_key: string
) {
  const response = await docClient
    .update({
      TableName: table_name,
      Key: { hash_key, range_key },
      UpdateExpression: 'set is_deleted = :del, update_date = :update_date',
      ExpressionAttributeValues: {
        ':del': true,
        ':update_date': Date.now(),
      },
      ReturnValues: 'ALL_NEW',
    })
    .promise();
  return response.Attributes;
}

export async function updateDynamoItem(
  table_name: string | undefined,
  hash_key: string,
  data: any,
  range_key: string
) {
  data = {
    ...data,
    update_date: Date.now(),
  };
  return await docClient
    .update({
      TableName: table_name,
      Key: { hash_key, range_key },
      Item: data,
      ReturnValues: 'ALL_NEW',
    })
    .promise();
}

export async function listMainTokensQuery(table_name: string | undefined) {
  const response = await docClient
    .query({
      TableName: table_name,
      IndexName: 'main_tkn',
      KeyConditionExpression: 'gsi_main_tkn = :hkey',
      ExpressionAttributeValues: {
        ':hkey': 'main_token',
      },
    })
    .promise();
  return response.Items;
}

export async function getTokenBySymbolQuery(
  table_name: string | undefined,
  hash_key: string
) {
  const response = await docClient
    .get({
      TableName: table_name,
      Key: { hash_key },
    })
    .promise();
  return response.Item;
}

export async function getTokenByBscHashQuery(
  table_name: string | undefined,
  hash_key: string
) {
  const response = await docClient
    .query({
      TableName: table_name,
      IndexName: 'bsc_hash',
      KeyConditionExpression: 'gsi_bsc_hash = :hkey',
      ExpressionAttributeValues: {
        ':hkey': hash_key,
      },
    })
    .promise();
  return response.Items;
}

export async function getTokenByEthHashQuery(
  table_name: string | undefined,
  hash_key: string
) {
  const response = await docClient
    .query({
      TableName: table_name,
      IndexName: 'ethereum_hash',
      KeyConditionExpression: 'gsi_eth_hash = :hkey',
      ExpressionAttributeValues: {
        ':hkey': hash_key,
      },
    })
    .promise();
  return response.Items;
}

export async function getCatalogPairsByOwner(table_name: string | undefined) {
  const response = await docClient
    .query({
      TableName: table_name,
      IndexName: 'byOwner',
      KeyConditionExpression: '#owner_gsi = :owner',
      FilterExpression: '#type_filter = :type',
      ExpressionAttributeNames: {
        '#owner_gsi': 'owner',
        '#type_filter': 'type',
      },
      ExpressionAttributeValues: {
        ':owner': 'wswap',
        ':type': 'swapPool',
      },
    })
    .promise();
  return response.Items;
}
