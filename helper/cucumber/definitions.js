const { Given, Before, When, Then } = require('cucumber');

const user = require('../apis/user');
const clazz = require('../apis/clazz');
const pay = require('../apis/pay');
const clazzStudentRenewal = require('../apis/clazzStudentRenewal');
const assert = require('assert');
require('./defineParameters');

Before(function () {
  this.user = {};
  this.clazz = {};
});

Given('创建一个学生{student}', async function (student) {
  const userInfo = await user.create(student);
  // console.log('userinfo:',userInfo);
  this.user[student] = userInfo;
  console.log('userinfo[student]:', userInfo);
});

Given(
  '创建一个课程{year}{clazzType}{timeSeq}{gradeNum}{subjectId}{clazzName}{clazzStopTime}',
  { timeout: 60 * 1000 },
  async function (
    year,
    clazzType,
    timeSeq,
    gradeNum,
    subjectId,
    clazzName,
    clazzStopTime
  ) {
    const clazzRes = await clazz.createClazzAndProduct({
      timeSeq,
      year,
      ...clazzType,
      grade: gradeNum,
      subjectId,
      name: clazzName,
      stopTime: clazzStopTime,
    });

    this.clazz[clazzName] = clazzRes;
  }
);

When(
  '{student}于{string}购买一门课程{clazzName}source为{string}',
  { timeout: 60 * 1000 },
  async function (student, orderPayTime, clazzName, source) {
    const product = this.clazz[clazzName].product;
    const user = this.user[student];
    console.log('product:', product);
    console.log('user.access_token:', user.access_token);

    await pay.createOrderAndSync({
      skuIds: String(product.skuId),
      source,
      accessToken: user.access_token,
      userId: user.id,
      orderPayTime,
    });
  }
);

When('{student}退掉一门课程{clazzName}',
   async function (student,clazzName) {
     const student_id = this.user[student].id;

     console.log('退课student_id:', student_id);
    //  console.log('this.clazz:', this.clazz);
     const clazz_id = this.clazz[clazzName].clazz.clazzId
     console.log('退课clazz_id:', this.clazz[clazzName].clazz.clazzId);

     await user.quitClazz(clazz_id, student_id);
    return 'success';
 }
);

Then(
  '{student}在{year}{clazzType}{timeSeq}{renewResult}，首单量{int}，拓单量{int}，退课量{int}，插班量{int}，不计绩效量{int}',
  async function (
    student,
    year,
    clazzType,
    timeSeq,
    renewResult,
    firstOrderCount,
    expandOrderCount,
    refundOrderCount,
    interimOrderCount,
    unPerformanceCount
  ) {
    const student_id = this.user[student].id;
    console.log(student_id);
    console.log(clazzType);
    console.log(clazzType.type);
    const clazz_type_id = await clazzStudentRenewal.findClazzTypeId(year,clazzType.type,timeSeq);
    console.log(clazz_type_id);
    const info = await clazzStudentRenewal.findRenewResultByStudent(student_id, clazz_type_id);
    console.log(info);
    const checkMsg = `需要判断的数据，转正结果:${renewResult},firstOrderCount:${firstOrderCount},expandOrderCount:${expandOrderCount},refundOrderCount:${refundOrderCount},interimOrderCount:${interimOrderCount},unPerformanceCount:${unPerformanceCount}`;
    console.log(checkMsg);
    assert.ok(info, `${checkMsg}:查询表获取数据为空`);
    console.log(`需要判断的info:`, info);
    if (
      info 
    ) {
      assert.equal(
        info.renewResult,
        renewResult,
        `${checkMsg}:转正结果匹配失败!`,
      );
      assert.equal(
        info.firstOrderCount,
        firstOrderCount,
        `${checkMsg}:首单量匹配失败!`,
      );
      assert.equal(
        info.expandOrderCount,
        expandOrderCount,
        `${checkMsg}:拓单量匹配失败!`,
      );
      assert.equal(
        info.refundOrderCount,
        refundOrderCount,
        `${checkMsg}:退课量匹配失败!`,
      );
      assert.equal(
        info.interimOrderCount,
        interimOrderCount,
        `${checkMsg}:插班量匹配失败!`,
      );
      assert.equal(
        info.unPerformanceCount,
        unPerformanceCount,
        `${checkMsg}:不计绩效量匹配失败!`,
      );
      console.log(`[数据匹配成功]：${checkMsg}`);
    }

  }
);


Then(
  '{student}在{year}{clazzType}{timeSeq}{saleResult}，首单量{int}，拓单量{int}，退课量{int}，插班量{int}，不计绩效量{int}',
  async function (
    student,
    year,
    clazzType,
    timeSeq,
    saleResult,
    firstOrderCount,
    expandOrderCount,
    refundOrderCount,
    interimOrderCount,
    unPerformanceCount
  ) {
    const student_id = this.user[student].id;
    console.log(student_id);
    console.log(clazzType);
    console.log(clazzType.type);
    const clazz_type_id = await clazzStudentRenewal.findClazzTypeId(year, clazzType.type, timeSeq);
    console.log(clazz_type_id);
    const info = await clazzStudentRenewal.findSaleResultByStudent(student_id, clazz_type_id);
    console.log(info);
    const checkMsg = `需要判断的数据，转正结果:${saleResult},firstOrderCount:${firstOrderCount},expandOrderCount:${expandOrderCount},refundOrderCount:${refundOrderCount},interimOrderCount:${interimOrderCount},unPerformanceCount:${unPerformanceCount}`;
    console.log(checkMsg);
    assert.ok(info, `${checkMsg}:查询表获取数据为空`);
    console.log(`需要判断的info:`, info);
    if (
      info
    ) {
      assert.equal(
        info.saleResult,
        saleResult,
        `${checkMsg}:转正结果匹配失败!`,
      );
      assert.equal(
        info.firstOrderCount,
        firstOrderCount,
        `${checkMsg}:首单量匹配失败!`,
      );
      assert.equal(
        info.expandOrderCount,
        expandOrderCount,
        `${checkMsg}:拓单量匹配失败!`,
      );
      assert.equal(
        info.refundOrderCount,
        refundOrderCount,
        `${checkMsg}:退课量匹配失败!`,
      );
      assert.equal(
        info.interimOrderCount,
        interimOrderCount,
        `${checkMsg}:插班量匹配失败!`,
      );
      assert.equal(
        info.unPerformanceCount,
        unPerformanceCount,
        `${checkMsg}:不计绩效量匹配失败!`,
      );
      console.log(`[数据匹配成功]：${checkMsg}`);
    }

  }
);