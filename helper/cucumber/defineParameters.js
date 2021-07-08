// const { defineParameterType } = require('@cucumber/cucumber');
const { defineParameterType } = require('cucumber');
const map = require('../../utils/map');
// console.log(map);

defineParameterType({
  name: 'student',
  regexp: /<学生.*>/,
  transformer: (s) => s.replace(/<|>/g, ''),
});

defineParameterType({
  name: 'year',
  regexp: /(.*)年/,
  transformer: (s) => s.replace(/年/g, ''),
});

defineParameterType({
  name: 'clazzType',
  regexp: /寒假体验课|寒假系统课|春季系统课|春秋体验课|秋季系统课/,
  transformer: (s) => map.clazzTypeMap[s] || {},
});

defineParameterType({
  name: 'timeSeq',
  regexp: /(.*)期/,
  transformer: (s) => s.replace(/期/g, ''),
});

defineParameterType({
  name: 'gradeNum',
  regexp: /一年级|二年级|三年级|四年级|五年级|六年级|七年级|八年级|九年级|高一|高二|高三/,
  transformer: (s) => map.gradeNumMap[s] || null,
});

defineParameterType({
  name: 'subjectId',
  regexp: /数学|英语|物理|化学|生物|语文|思想品德/,
  transformer: (s) => map.subjectMap[s] || 0,
});

defineParameterType({
  name: 'clazzName',
  regexp: /<课程.*>/,
  transformer: (s) => s.replace(/<|>/g, ''),
});

defineParameterType({
  name: 'clazzStopTime',
  regexp: /结课时间是<.*>/,
  transformer: (s) => s.replace(/结课时间是<|>/g, ''),
});

defineParameterType({
  name: 'renewResult',
  regexp: /转正结果为<.*>/,
  transformer: (s) => s.replace(/转正结果为<|>/g, ''),
});

defineParameterType({
  name: 'saleResult',
  regexp: /正价课销售结果为<.*>/,
  transformer: (s) => s.replace(/正价课销售结果为<|>/g, ''),
});

// defineParameterType({
//   name: 'source',
//   regexp: /source为<.*>/,
//   transformer: (s) => s.replace(/<|>/g, ''),
// });
