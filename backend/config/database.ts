import { Sequelize, Dialect } from 'sequelize';

const databaseConfig = {
  database: process.env.DB_NAME || 'admin_dashboard',
  username: process.env.DB_USER || 'admin_user',
  password: process.env.DB_PASSWORD || 'admin_password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres' as Dialect,
};

const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: databaseConfig.dialect,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : undefined
    },
    // Add connection pooling configuration
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || '20'),
      min: parseInt(process.env.DB_POOL_MIN || '5'),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
      idle: parseInt(process.env.DB_POOL_IDLE || '10000')
    },
    // Add retry configuration
    retry: {
      match: [
        /SQLITE_BUSY/,
      ],
      max: parseInt(process.env.DB_RETRY_MAX || '3'),
    },
  }
);

export default sequelize;