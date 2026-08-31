/**
 * 2021-06-14T19:09:28.384Z	2d58a064-6d0c-4db2-89c0-74ee9ab426ec	INFO	Decoded payload: {
    "token_address": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    "from_address": "0x3036b1a77f403a6ed39c117035de3626acb9142b",
    "to_address": "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    "value": 2738345786813826,
    "transaction_hash": "0xc87836e616a02b249fee8bda84f02c8e48336c9c9324b51a684930c54ac5cd96",
    "log_index": 223,
    "block_timestamp": "2021-06-14T19:09:26.000Z",
    "block_number": 8297794,
    "block_hash": "0x3bc66d41d42bd9d74ff68e9d60668f712dac43a4efd9d99d5e64b93782f3f06d",
    "transaction_index": 82
}

 */
import Joi from '@hapi/joi';
import 'joi-extract-type';

const schema = Joi.object({
  token_address: Joi.string(),
  from_address: Joi.string().required(),
  to_address: Joi.string().required(),
  value: Joi.number().required(),
  transaction_hash: Joi.string().required(),
  block_number: Joi.number().required(),
  block_hash: Joi.string().required(),
});

export type BscTransaction = Joi.extractType<typeof schema>;
export default schema;
