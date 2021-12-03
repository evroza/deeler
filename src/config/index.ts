import * as dotenv from 'dotenv';
import convict from 'convict';
dotenv.config();

const config = convict({
  port: {
    doc: 'The port express is served on.',
    format: Number,
    default: 3001,
    env: 'APP_PORT',
  },
  mysql: {
    host: {
      doc: 'The MYSQL HOST',
      default: '127.0.0.1',
      env: 'DATABASE_HOST',
    },
    user: {
      doc: 'The MYSQL user',
      default: 'root',
      env: 'DATABASE_USER',
    },
    pass: {
      doc: 'The Mysql Password',
      default: 'qwerty123',
      env: 'DATABASE_PASS',
    },
    schema: {
      doc: 'The MYSQL Schema',
      default: 'deel_db',
      env: 'DATABASE_SCHEMA',
    },
  },
});

export default config;
