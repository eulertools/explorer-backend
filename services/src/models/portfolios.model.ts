import Joi from '@hapi/joi';

const portfolioItem = Joi.object({
  identifier: Joi.string().required(),
  name: Joi.string().max(100).required(),
  network: Joi.string().max(100),
  type: Joi.string().max(50).required(),
  order: Joi.number(),
});
const schema = Joi.object({
  name: Joi.string().max(50),
  items: Joi.array().items(portfolioItem),
});

export default schema;
