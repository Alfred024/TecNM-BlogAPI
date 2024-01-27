import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    API_PORT: Joi.number().default(3001),
    API_DEFAULT_LIMIT: Joi.number().default(20),
});