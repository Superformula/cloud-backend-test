const Joi = require(`joi`)

export default {
	address: Joi.string().required(),
	provider: Joi.string().required()
}