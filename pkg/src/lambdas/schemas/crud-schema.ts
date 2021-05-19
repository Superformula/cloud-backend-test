const Joi = require(`joi`)

export const putSchema = {
	pk: Joi.string().required(),
	sk: Joi.string().required(),
	
	dob: Joi.date().allow(null),
	name: Joi.string().required(),
	address: Joi.string().allow(null),
	imageUrl: Joi.string().allow(null),
	description: Joi.string().allow(null)
}

export const postSchema = {
	dob: Joi.date().allow(null),
	name: Joi.string().allow(null),
	address: Joi.string().allow(null),
	imageUrl: Joi.string().allow(null),
	description: Joi.string().allow(null)
}