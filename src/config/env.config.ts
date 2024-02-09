export const EnvConfig = () => ({
    port: process.env.API_PORT,
    default_limit: process.env.API_DEFAULT_LIMIT,
    jwt_secret: process.env.API_JWT_SECRET,
    api_key: process.env.API_KEY,
    db_host: process.env.DB_HOST,
    db_name: process.env.DB_NAME,
    db_port: +process.env.DB_PORT,
    db_user: process.env.DB_USER,
    db_user_pwd: process.env.DB_USER_PWD,
});