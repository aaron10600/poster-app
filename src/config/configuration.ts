export default () => ({
    app: {
        env: process.env.NODE_ENV,
        port: parseInt(process.env.APP_PORT || '3000', 10),
        url: process.env.APP_URL,
        frontendUrl: process.env.FRONTEND_URL
    },

    database: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
    },

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES,
    },

    mail: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT || '587', 10),
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_KEY,
        from: process.env.MAIL_FROM,
        fromName: process.env.MAIL_FROM_NAME
    },

    telegram: {
        token: process.env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID
    }
})