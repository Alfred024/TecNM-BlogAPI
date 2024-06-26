export const EnvConfig = () => ({
    // API 
    port: process.env.API_PORT,
    default_limit: process.env.API_DEFAULT_LIMIT,
    api_key: process.env.API_KEY,
    // Auth
    jwt_secret: process.env.API_JWT_SECRET,
    refresh_jwt_secret: process.env.API_REFRESH_JWT_SECRET,
    // Database
    db_host: process.env.DB_HOST,
    db_name: process.env.DB_NAME,
    db_port: +process.env.DB_PORT,
    db_user: process.env.DB_USER,
    db_user_pwd: process.env.DB_USER_PWD,
    // SMTP
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_email: process.env.SMTP_EMAIL,
    smtp_pwd: process.env.SMTP_PASSWORD,
});