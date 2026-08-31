/*
 * A base service with an underlying data source using Dynamodb.
 */
import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { FeathersError } from '@feathersjs/errors';
import { NullableId, Paginated, Params } from '@feathersjs/feathers';
import { omit } from 'lodash';
import { Application } from '../declarations';
import {
  camelToUnderscore,
  generateCondition,
  parseOutput,
  wrapAttributes,
  wrapExpression,
  wrapKeys,
} from '../utils/dynamo_utils';
import { AppService } from './app_service';

export interface Data {}
export interface ServiceOptions {
  paginate?: any;
  table: string;
  primaryKey?: string;
  prefix?: string;
}

export interface DynamoQueryParams {
  /*
  condition example:

  Season = :s and Episode > :e
  */
  condition?: string;
  /*
  filter example:

  contains (Subtitle, :topic)
  */
  filter?: string;
  /*
  expression_values example:

  {
    ":s": { N: "1" },
    ":e": { N: "2" },
    ":topic": { S: "SubTitle" },
  }
  */
  expression_values: any;
  /*
  projection example:

  Episode, Title, Subtitle
  */
  projection?: string;
  table: string;
}

export class DynamoDataService extends AppService {
  protected options: ServiceOptions;
  protected app: Application;
  protected client: DynamoDBClient;

  constructor(options: ServiceOptions, app: Application) {
    super(options, app);

    this.options = options;
    this.app = app;
    this.client = app.get('ddb') as DynamoDBClient;
  }

  async find(params: Params): Promise<any[] | Paginated<any> | any> {
    let results: any;
    let condition;
    const { query = {}, is_count: isCount = false } = params;

    if (params.user) {
      query.user_sub = params.user?.user_sub;
    }

    const baseCondition = 'begins_with(#identifier,:prefix)';
    const expressionValues = wrapExpression(query, ':');
    const queryCondition = generateCondition(query);

    if (params.identifierPrefix && this.options.prefix !== 'none') {
      expressionValues[':prefix'] = { S: params.identifierPrefix };
      condition = [baseCondition, queryCondition].filter(Boolean).join(' AND ');
    } else {
      condition = queryCondition;
    }

    const dynamoQuery: DynamoQueryParams = {
      expression_values: expressionValues,
      table: this.options.table,
      condition,
    };

    try {
      let expressionAttributeNames

      const attributeNames = wrapKeys(query);

      if (params.identifierPrefix && this.options.prefix !== 'none') {
        expressionAttributeNames = {
          ...attributeNames,
          '#identifier': 'identifier',
        }
      } else {
        expressionAttributeNames = {...attributeNames,}
      }
      const options: ScanCommandInput = {
        FilterExpression: dynamoQuery.condition,
        ExpressionAttributeValues: dynamoQuery.expression_values,
        TableName: dynamoQuery.table,
        ExpressionAttributeNames: {...expressionAttributeNames}
        // Limit: this.options.paginate.max,
      };

      if (isCount) {
        options.Select = 'COUNT';
        delete options.Limit;
      }

      const queryOptions: ScanCommandInput = options;
      const output: ScanCommandOutput | undefined = await this.client.send(
        new ScanCommand(queryOptions)
      );

      results = isCount
        ? { count: output.Count ?? 0 }
        : (output && parseOutput(output)) || null;
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return new FeathersError(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        err?.message,
        'BadRequest',
        400,
        'bad-request',
        {}
      );
    }

    return results;
  }

  async get(id: NullableId, params: Params | undefined): Promise<any> {
    let results: any;
    const { user, query: { ...otherParams } = {} } = params as any;
    const query = {
      [this.options.primaryKey ?? 'identifier']: params?.identifier,
    };

    if (user) {
      query.user_sub = user.sub;
    }

    console.log("query", query)

    const finalQuery = { ...query, ...otherParams };
    const expressionValues = wrapExpression(finalQuery, ':');
    const condition = generateCondition(finalQuery);
    const dynamoQuery: DynamoQueryParams = {
      expression_values: expressionValues,
      table: this.options.table,
      condition,
    };

    try {
      const attributeNames = wrapKeys(finalQuery);
      const queryOptions: QueryCommandInput = {
        KeyConditionExpression: dynamoQuery.condition,
        ExpressionAttributeValues: dynamoQuery.expression_values,
        ExpressionAttributeNames: {
          ...attributeNames,
          '#identifier': 'identifier',
        },
        TableName: dynamoQuery.table,
        Limit: this.options.paginate.max,
      };
      const output: QueryCommandOutput | undefined = await this.client.send(
        new QueryCommand(queryOptions)
      );

      results = (output && parseOutput(output)) || null;
    } catch (err) {
      return new FeathersError(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        err?.message,
        'BadRequest',
        400,
        'bad-request',
        {}
      );
    }

    return (
      (Array.isArray(results) &&
        ((results.length > 1 && results) || results[0])) ||
      results
    );
  }

  async create(data: any, params: Params | undefined): Promise<any> {
    let output: PutItemCommandOutput | undefined;
    const item = camelToUnderscore(data);
    const itemInput = {
      TableName: this.options.table,
      Item: wrapAttributes({ ...item, user_sub: params?.user?.user_sub }),
    };

    try {
      output = await this.client?.send(new PutItemCommand(itemInput));
    } catch (err) {
      return new FeathersError(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        err?.message,
        'BadRequest',
        400,
        'bad-request',
        {}
      );
    }

    return { ...item, ...output };
  }

  async update(
    id: NullableId,
    data: any,
    params: Params | undefined
  ): Promise<any> {
    let output: PutItemCommandOutput | undefined;
    const query = {
      [this.options.primaryKey ?? 'hash_key']: id,
    };
    let item = camelToUnderscore(data);

    // retrieve old version
    try {
      // first, fetch existing to preserve standard info
      const old = await this.get(id, params);
      item = omit(item, ['created_at']);
      item = { ...old, ...item };
    } catch (err) {
      return new FeathersError(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        err?.message,
        'BadRequest',
        400,
        'bad-request',
        {}
      );
    }

    const itemInput: PutItemCommandInput = {
      TableName: this.options.table,
      Item: wrapAttributes({ ...query, ...item, user_sub: params?.user?.user_sub }),
    };

    try {
      output = await this.client?.send(new PutItemCommand(itemInput));
    } catch (err) {
      return new FeathersError(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        err?.message,
        'BadRequest',
        400,
        'bad-request',
        {}
      );
    }

    return { ...item, ...output };
  }

  async patch(
    id: NullableId,
    data: any,
    params: Params | undefined
  ): Promise<any> {
    throw new FeathersError(
      'Not implemented',
      'BadRequest',
      400,
      'bad-request',
      {}
    );
  }

  async remove(id: NullableId, params: Params): Promise<any> {
    let output: any | undefined;

    const itemInput = {
      TableName: this.options.table,
      Key: wrapAttributes({
        [this.options.primaryKey ?? 'identifier']: params.identifier,
        user_sub: params.user?.user_sub,
      }),
    };

    try {
      output = await this.client?.send(new DeleteItemCommand(itemInput));
    } catch (err) {
      return new FeathersError(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        err?.message,
        'BadRequest',
        400,
        'bad-request',
        {}
      );
    }

    return { ...output };
  }

  /**
   * Process a transaction.
   * Returns true if the transaction was useful or false otherwise. If useful,
   * it'll be saved just for the records.
   *
   * @param  {any} data
   * @param  {Params|undefined} params
   * @returns Promise
   */
  async processTransaction(
    data: any,
    params: Params | undefined
  ): Promise<boolean> {
    return true;
  }
}
