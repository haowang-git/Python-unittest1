const axios = require('axios');

function transformResponse(data) {
  const res = JSON.parse(data);

  if (res.code !== 0) {
    throw Error(data);
  }

  return res.data;
}

const portalApi = axios.create({
  baseURL: 'http://portal.test.guorou.net',
  transformResponse: [transformResponse],
  timeout: 0,
});

const sellApi = axios.create({
  baseURL: 'http://sellapi.test.guorou.net',
  transformResponse: [transformResponse],
  timeout: 0,
});

const saleApi = axios.create({
  baseURL: 'http://sale.test.guorou.net',
  transformResponse: [transformResponse],
  timeout: 0,
});

module.exports = {
  portalApi,
  sellApi,
  saleApi,
};
