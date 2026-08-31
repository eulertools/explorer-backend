import Joi from '@hapi/joi';

const schema = Joi.object({
  identifier: Joi.string().max(150),
  address: Joi.string().max(150),
  name: Joi.string().max(100),
  network: Joi.string().max(100),
  type: Joi.string().max(100),
});

export default schema;
