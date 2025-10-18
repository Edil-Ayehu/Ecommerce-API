import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    syncronize: process.env.DB_SYNC === 'true' ? true : false,
    autoLoadEntities: process.env.AUTO_LOAD === 'true' ? true : false,
}))