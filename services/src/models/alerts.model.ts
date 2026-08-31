import Joi from '@hapi/joi';

const condition = Joi.object({
  attr: Joi.string().max(50),
  comp: Joi.string().valid('<', '>', '<=', '>=', '!=', '='),
  target: Joi.number().less(10 ** 50),
});
const schema = Joi.object({
  cond: condition,
  item_name: Joi.string().max(100),
  item_type: Joi.string().max(50),
});

export default schema;
