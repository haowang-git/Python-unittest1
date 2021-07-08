const _ = require('lodash');
const dayjs = require('dayjs');
const { sellApi, saleApi } = require('../../utils/axios');
const db = require('../../utils/db');

const findClazzTypeId = async (year, clazzType, timeSeq) => {
    const [rows] = await db.sales.raw(
        `select id from sale_clazz_type where year like '${year}%' and clazz_type = ${clazzType} and time_seq = ${timeSeq} and status = 1`
    );
    console.log(`查询的clazzTypeId：`, rows[0].id);
    console.log(`rows[0]：`, rows[0]);
    return rows[0].id;
}

const findRenewResultByStudent = async (userId, clazzTypeId) => {
    const [rows] = await db.sales.raw(
        `SELECT CASE
           WHEN p.renew_result =0 THEN '未转化'
           WHEN p.renew_result =1 THEN '转正后流失'
           WHEN p.renew_result =2 THEN '转正'
           WHEN p.renew_result IS NULL THEN '不存在'
       END AS renewResult,
       CASE
           WHEN sum(s.is_first_order=1) IS NULL THEN 0
           ELSE sum(s.is_first_order=1)
       END AS firstOrderCount,
       CASE
           WHEN p.expand_order_count IS NULL THEN 0
           ELSE p.expand_order_count
       END AS expandOrderCount,
       CASE
           WHEN sum(s.deactive_time IS NOT NULL) IS NULL THEN 0
           ELSE sum(s.deactive_time IS NOT NULL)
       END AS refundOrderCount,
       CASE
           WHEN sum(s.is_interim_class_order=1) IS NULL THEN 0
           ELSE sum(s.is_interim_class_order=1)
       END AS interimOrderCount,
       CASE
           WHEN sum(s.is_performance =0) IS NULL THEN 0
           ELSE sum(s.is_performance =0)
       END AS unPerformanceCount
FROM perf_user_result p
LEFT JOIN perf_result_order s ON p.id = s.result_id
WHERE p.type=1
  AND p.user_id=${userId}
  AND p.sale_clazz_type_id=${clazzTypeId}
  AND p.status=1
  AND s.status=1`
    );
    console.log(`查询的用户转正结果：`, rows);
    return rows[0];
}

const findSaleResultByStudent = async (userId, clazzTypeId) => {
    const [rows] = await db.sales.raw(
        `SELECT CASE
           WHEN p.sale_result =1 THEN '转正后流失'
           WHEN p.sale_result =2 THEN '插班'
           WHEN p.sale_result =3 THEN '正转正'
           WHEN p.sale_result =4 THEN '低转正'
           WHEN p.sale_result =5 THEN '0转正'
           WHEN p.sale_result =6 THEN '直接正价获客'
           WHEN p.sale_result IS NULL THEN '不存在'
       END AS saleResult,
       CASE
           WHEN sum(s.is_first_order=1) IS NULL THEN 0
           ELSE sum(s.is_first_order=1)
       END AS firstOrderCount,
       CASE
           WHEN p.expand_order_count IS NULL THEN 0
           ELSE p.expand_order_count
       END AS expandOrderCount,
       CASE
           WHEN sum(s.deactive_time IS NOT NULL) IS NULL THEN 0
           ELSE sum(s.deactive_time IS NOT NULL)
       END AS refundOrderCount,
       CASE
           WHEN sum(s.is_interim_class_order=1) IS NULL THEN 0
           ELSE sum(s.is_interim_class_order=1)
       END AS interimOrderCount,
       CASE
           WHEN sum(s.is_performance =0) IS NULL THEN 0
           ELSE sum(s.is_performance =0)
       END AS unPerformanceCount
FROM perf_user_result p
LEFT JOIN perf_result_order s ON p.id = s.result_id
WHERE p.type=2
  AND p.user_id=${userId}
  AND p.sale_clazz_type_id=${clazzTypeId}
  AND p.status=1
  AND s.status=1`
    );
    console.log(`查询的用户转正结果：`, rows);
    return rows[0];
}

module.exports = {
    findClazzTypeId,
    findRenewResultByStudent,
    findSaleResultByStudent
};