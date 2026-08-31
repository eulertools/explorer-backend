// eslint-disable-next-line @typescript-eslint/no-var-requires
const aws = require('aws-sdk');
const ddb = new aws.DynamoDB();
const sqs = new aws.SQS();
const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID || process.env.CDK_DEV_ACCOUNT;
const QUEUE_URL = `https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT_ID}/data-gateway-queue`;

function dbAddressLookup(target, value) {
  return new Promise((resolve, reject) => {
    let count;
    const params = {
      KeyConditionExpression: '#target = :value',
      IndexName: 'address-index',
      ExpressionAttributeNames: {
        '#target': target,
      },
      ExpressionAttributeValues: {
        ':value': { S: value },
      },
      TableName: 'user_entities',
    };

    // Call DynamoDB
    try {
      ddb.query(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

exports.handler = async (event, context) => {
  for (const record of event.Records) {
    try {
      // Kinesis data is base64 encoded so decode here
      const payload = Buffer.from(record.kinesis.data, 'base64').toString(
        'ascii'
      );
      const transaction = JSON.parse(payload);

      if (transaction.from_address || transaction.to_address) {
        console.info(transaction);

        // do we care about this transaction?
        const all = [];
        for (const prop of ['from_address', 'to_address']) {
          all.push(dbAddressLookup('address', transaction[prop]));
        }

        const responses = await Promise.all(all);

        if (responses) {
          for (const response of responses) {
            const { Items = [] } = response;

            for (const item of Items) {
              // inform data-gateway via SQS
              const doc = aws.DynamoDB.Converter.unmarshall(item);
              const params = {
                MessageBody: JSON.stringify({
                  type: 'service_call',
                  details: {
                    service: 'bsc_transactions',
                    action: 'create',
                    data: {
                      user_sub: doc.user_sub,
                      ...transaction,
                    },
                  },
                }),
                QueueUrl: QUEUE_URL,
              };

              try {
                const sqsResponse = await sqs.sendMessage(params).promise();

                console.info(sqsResponse);
              } catch (_err) {
                console.error(_err);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  return {
    statusCode: 200,
    body: 'Batch processed',
  };
};
