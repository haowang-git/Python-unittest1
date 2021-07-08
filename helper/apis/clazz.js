const _ = require('lodash');
const dayjs = require('dayjs');
const { portalApi } = require('../../utils/axios');
const db = require('../../utils/db');

const now = dayjs();

/**
 * 创建课程以及商品
 *
 * @param {*} {
 *   timeSeq 期数 默认0,
 *   year 年份 默认当前年份,
 *   type 课程类型(1,2,8,9,10)[必传],
 *   grade 年级(1-10)[必传],
 *   subjectId 科目id [必传],
 *   name 课程名 [必传],
 *   studentType 学生类型 0全部 1新生 2老生 默认0 全部,
 *   stopTime 课程结束时间 默认当前时间+60天,
 *   startTime 课程开始时间 默认当期那时间,
 * }
 * @returns
 */
async function createClazzAndProduct({
  timeSeq,
  year,
  type,
  grade,
  subjectId,
  name,
  studentType,
  stopTime,
  startTime,
}) {
  const clazzRes = await createClazz({
    timeSeq,
    year,
    type,
    grade,
    subjectId,
    name,
    studentType,
    stopTime,
    startTime,
  });

  const clazzplanRes = await createClazzplan({
    clazzId: clazzRes.clazzId,
    
    stopTime: stopTime,
  });

  const productRes = await createProduct({
    title: clazzRes.name,
    clazzId: clazzRes.clazzId,
  });

  return {
    clazz: clazzRes,
    clazzplan: clazzplanRes,
    product: productRes,
  };
}

// 创建课程
async function createClazz({
  timeSeq,
  year,
  type,
  grade,
  subjectId,
  name,
  studentType,
  stopTime,
  startTime,
}) {
  const clazzStopTime =
    stopTime || now.add(30, 'd').format('YYYY-MM-DD HH:mm:ss');
  const clazzStartTime =
    startTime ||
    dayjs(clazzStopTime).subtract(7, 'd').format('YYYY-MM-DD HH:mm:ss');
  const clazzName = `[cucumber]_自动创建课程_${name}_${now.valueOf()}`;
  const data = {
    clazzId: 0,
    name: clazzName,
    year: year || dayjs().format('YYYY'),
    type,
    grade: [String(grade)],
    subjectId,
    level: 1,
    studentType: studentType || 0,
    mentorId: 6,
    startTime: clazzStartTime,
    stopTime: clazzStopTime,
    timeType: 2,
    starCount: 4,
    tags: [],
    timeSeq: timeSeq || 0,
    isStaff: 0,
    masterStudentLimit: 200,
    surveyId: '',
    timeTypeDetail: [
      {
        period: '周五',
        startTime: '19:00',
        stopTime: '21:00',
      },
    ],
  };

  const createRes = await portalApi.post(
    `/portalapi/api/1/clazz/create_clazz?access_token=${db.portal_access_token}`,
    data
  );
  console.log('课程创建成功：',createRes.data);

  data.clazzId = createRes.data.clazzId;
  
  return data;
}


//创建课讲
async function createClazzplan({ clazzId, stopTime }) {
  const clazzStopTime =
    stopTime || now.add(30, 'd').format('YYYY-MM-DD HH:mm:ss');
  const clazzStartTime =
    dayjs(clazzStopTime).subtract(1, 'h').format('YYYY-MM-DD HH:mm:ss');
  const clazzplan = {
    title: '测试课时',
    type : 1,
    startTime: clazzStartTime,
    stopTime: clazzStopTime,
    seq : 1,
    clazzId: clazzId,
  };
  console.log('clazzplan请求body：', clazzplan);

  const clazzplanRes = await portalApi.post(
    `/portalapi/api/1/clazz/create_clazz_plan?access_token=${db.portal_access_token}`,
    clazzplan
  );
  console.log(clazzplanRes.data);
  return clazzplanRes.data;
}


// 创建商品
async function createProduct({ title, clazzId, saleStartAt, saleEndAt }) {
  /* 创建商品 */
  const product = {
    title: title,
    price: 0,
    skuNum: -1,
    deliveryType: 2,
    teamLevel: 1,
    saleStartAt: saleStartAt || dayjs().format('YYYY-MM-DD'),
    saleEndAt: saleEndAt || dayjs().add(30, 'd').format('YYYY-MM-DD'),
    hideMall: 0,
    clazzId,
    status: 1,
  };

  const productResult = await portalApi.post(
    `/portalapi/api/1/clazz/create_product?access_token=${db.portal_access_token}`,
    product
  );
  console.log(productResult.data);

  return productResult.data;
}

// createClazzAndProduct({
//   grade: 2,
//   subjectId: 1,
//   type: 10,
//   name: '测试333',
// }).then((res) => {
//   console.log('res', res);
//   process.exit();
// });

module.exports = {
  createClazz,
  createClazzplan,
  createProduct,
  createClazzAndProduct,
};
