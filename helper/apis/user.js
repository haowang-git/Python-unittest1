const _ = require('lodash');
const { portalApi } = require('../../utils/axios');
const db = require('../../utils/db');

async function create(name) {
  const phone = _.random(12100000000, 12199999999);
  const accessToken = `cucumber_${phone}`;
  const params = {
    phone,
    username: name ? `cucumber_${phone}` : accessToken,
    hash: `11b7a8f56b68ecc20f9b${phone}`,
    role: 3,
    is_staff: 0,
    is_verified: 1,
    access_token: accessToken,
    status: 1,
  };

  const [res] = await db.portal('users').insert(params);

  return {
    id: res,
    ...params,
  };
}

const quitClazz = async (clazzId, studentId) => {
  const [
    [{ order_id: orderId }],
  ] = await db.portal.raw(
    `select order_id from clazz_student where clazz_id = :clazzId and student_id = :studentId and status = 1`,
    { clazzId, studentId },
  );
  const createquitedata = {
    orderId,
    quitType: 1,
    applyAmount: 0,
    clazzQuitTagId: 1,
    applyReason: 'cucumber',
    reasonImgUrls: [
      'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1579165013&di=33423a6be2b157ff31c693900cc1dfd7&src=http://b-ssl.duitang.com/uploads/item/201606/14/20160614224510_HwyZv.thumb.700_0.jpeg',
    ],
  };
  console.log('发起退课请求body:', createquitedata);

  const createquiteClazzRes = await portalApi.post(
    `/portalapi/api/1/clazz_quit/create_clazz_quit?access_token=${db.portal_access_token}`,
    createquitedata
  );

  // console.log('退课请求结果:', createquiteClazzRes);
  // console.log('退课请求返回code:', createquiteClazzRes.code);
  // console.log('退课请求返回data:', createquiteClazzRes.data);

  if (createquiteClazzRes.status !== 200) {
    console.log('申请退课失败:', createquiteClazzRes);
  }

  const [
    [{ approval_code }],
  ] = await db.portal.raw(
    `SELECT approval_code FROM clazz_quit WHERE order_id = :orderId and type = 1 `,
    { orderId },
  );

  const agreequitedata = {
    approval_code,
    result: 'AGREE',
  };
  console.log('同意退课请求body:', agreequitedata);

  const agreequiteClazzRes = await portalApi.post(
    `/portalapi/api/1/clazz_quit/approval/finish?access_token=${db.portal_access_token}`,
    agreequitedata
  );
  // console.log('同意退课结果:', agreequiteClazzRes);

  if (agreequiteClazzRes.status !== 200) {
    throw new Error('同意退课失败:', agreequiteClazzRes);
  }

  console.log('退课成功', {
    clazzId,
    studentId,
    orderId,
  });
};

// create('测试').then((res) => {
//   console.log('res', res);
// });

module.exports = {
  create,
  quitClazz,
};
