const knex = require('knex');

const portal = knex({
  client: 'mysql',
  connection: {
    host: 'rm-bp1tjet9282if6519uo.mysql.rds.aliyuncs.com',
    port: 3306,
    user: 'highauthority',
    password: 'gArjibFv3TzjnqhH',
    database: 'shensz_course',
  },
  // debug: true,
});

const sales = knex({
  client: 'mysql',
  connection: {
    host: 'rm-bp1tjet9282if6519uo.mysql.rds.aliyuncs.com',
    port: 3306,
    user: 'highauthority',
    password: 'gArjibFv3TzjnqhH',
    database: 'sales',
  },
  // debug: true,
});

const payment = knex({
  client: 'mysql',
  connection: {
    host: 'rm-bp1tjet9282if6519uo.mysql.rds.aliyuncs.com',
    port: 3306,
    user: 'highauthority',
    password: 'gArjibFv3TzjnqhH',
    database: 'payment',
  },
  // debug: true,
});

module.exports = {
  portal,
  sales,
  payment,
  portal_access_token: 'zf',
};
