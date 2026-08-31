import Joi from '@hapi/joi';

const schema = Joi.object({
  item_name: Joi.string().max(100),
  item_type: Joi.string().valid('project', 'token'),
  item_rate: Joi.string().valid('good', 'bad'),
});

export default schema;
