import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

    APP_PORT: Joi.number().default(3000),
    APP_URL: Joi.string().uri().required(),
    FRONTEND_URL: Joi.string().uri().required(),

    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),

    JWT_ACCESS_SECRET: Joi.string().min(32).required(),
    JWT_REFRESH_SECRET: Joi.string().min(32).required(),
    JWT_ACCESS_EXPIRES: Joi.string().required(),
    JWT_REFRESH_EXPIRES: Joi.string().required(),

    MAIL_HOST: Joi.string().required(),
    MAIL_PORT: Joi.number().required(),
    MAIL_USER: Joi.string().required(),
    MAIL_KEY: Joi.string().required(),
    MAIL_FROM: Joi.string().email().required(),
    MAIL_FROM_NAME: Joi.string().required(),

    TELEGRAM_BOT_TOKEN: Joi.string(),
    TELEGRAM_CHAT_ID: Joi.string()
})