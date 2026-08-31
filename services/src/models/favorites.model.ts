import Joi from '@hapi/joi';

const schema = Joi.object({
  name: Joi.string().max(100),
  type: Joi.string().max(50),
  address: Joi.string().max(50),
  symbol: Joi.string().max(50),
  network: Joi.string().max(50),
});

export default schema;
