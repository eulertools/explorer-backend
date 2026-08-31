// eslint-disable-next-line @typescript-eslint/no-var-requires
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID || process.env.CDK_DEV_ACCOUNT;
const QUEUE_URL = `https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT_ID}/data-gateway-queue`;

exports.handler = function (event, context, callback) {
  const userSub = event.request.userAttributes.sub;
  const params = {
    MessageBody: JSON.stringify({
      type: 'service_call',
      details: {
        service: 'profiles',
        action: 'create',
        data: {
          user_sub: userSub,
        },
      },
    }),
    QueueUrl: QUEUE_URL,
  };

  sqs.sendMessage(params, function (err, data) {
    if (err) {
      console.log('error:', 'Fail Send Message' + err);

      callback(null, event);
    } else {
      console.log('data:', data.MessageId);

      callback(null, event);
    }
  });

  return event;
};
