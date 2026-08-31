import Joi from '@hapi/joi';

const schema = Joi.object({
  item_ref: Joi.string().max(150),
  item_type: Joi.string().max(50),
  item_read: Joi.boolean().default(false),
  item_msg: Joi.object(),
});

export default schema;
