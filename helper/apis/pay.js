const _ = require('lodash');
const dayjs = require('dayjs');
const { sellApi, saleApi } = require('../../utils/axios');
const db = require('../../utils/db');

/**
 * 创建订单触发同步
 *
 * @param {*} {
 *   skuIds,
 *   orderPayTime = null,
 *   source = 'cucumber_test',
 *   activity = 'cucumber_test',
 *   sellType = 'cucumber_test',
 *   orderAddressId = 0,
 *   userCouponIds = [],
 *   accessToken,
 *   enabledAutoSync = true
 * }
 * @returns
 */
async function createOrderAndSync({
  skuIds,
  orderPayTime = null,
  source = 'cucumber_test',
  activity = 'cucumber_test',
  sellType = 'cucumber_test',
  orderAddressId = 0,
  userCouponIds = [],
  accessToken,
  userId,
  enabledAutoSync = true,
})   {
  const res = await sellApi.post(
    `/sellapi/1/pay/create_order?access_token=${accessToken}`,
    {
      sku_ids: skuIds,
      sell_type: sellType,
      access_token: accessToken,
      activity,
      source,
      order_address_id: orderAddressId,
      user_coupon_ids: userCouponIds,
    }
  );

  const orderId = res.data && res.data.order && res.data.order.order_id;

  // 触发分班
  await sellApi.post(
    `/sellapi/1/pay/pay_success_callback?access_token=${accessToken}`,
    {
      order_id: orderId,
      user_id: userId,
      is_order_cart: false,
      access_token: accessToken,
    }
  );

  console.log('支付成功,orderId:', orderId);

  if (orderPayTime && orderId) {
    await db.payment.raw(
      'update sszpay_order set paid_at = :orderPayTime where order_id = :orderId',
      { orderPayTime, orderId }
    );
  }

  // 自动触发同步
  if ((enabledAutoSync || orderPayTime) && orderId && userId) {
    await saleApi.get(`/asyncapi/api/v1/test/sync/${orderId}`);
    // await saleApi.get(`/asyncapi/api/v1/test/perf/${orderId}`);
    await saleApi.post(`/asyncapi/api/v1/test/sync4th`,
    [${userId}]
    );
  }

  return res.data;
}

// createOrderAndSync({
//   skuIds: '18649',
//   accessToken: 'cucuber_13469703335',
//   source: 'qd_5_activity_5',
//   orderPayTime: '2020-12-12 00:00:39',
// }).then((res) => {
//   console.log(res);
//   process.exit();
// });

module.exports = {
  createOrderAndSync,
};
