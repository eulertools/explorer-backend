import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Application } from './declarations';

export default function (app: Application): void {
  const aws_config: any = app.get('aws_config');
  const client = new DynamoDBClient(aws_config);

  app.set('ddb', client);

  const oldSetup = app.setup;

  app.setup = function (...args): Application {
    const result = oldSetup.apply(this, args);

    return result;
  };
}
