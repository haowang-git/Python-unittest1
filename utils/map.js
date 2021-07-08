const clazzTypeMap = {
  寒假体验课: {
    type: 8,
    studentType: 1,
  },
  寒假系统课: {
    type: 8,
    studentType: 2,
  },
  春季系统课: {
    type: 9,
    studentType: 0,
  },
  春秋体验课: {
    type: 10,
    studentType: 1,
  },
  秋季系统课: {
    type: 2,
    studentType: 0,
  },
};

const subjectMap = {
  数学: 1,
  英语: 2,
  物理: 3,
  化学: 4,
  生物: 5,
  语文: 6,
  思想品德: 7,
};

const gradeMap = {
  一年级: '1A,1B',
  二年级: '2A,2B',
  三年级: '3A,3B',
  四年级: '4A,4B',
  五年级: '5A,5B',
  六年级: '6A,6B',
  七年级: '7A,7B',
  八年级: '8A,8B',
  九年级: '9A,9B',
  高一: '10A,10B',
  高二: '11A,11B',
  高三: '12A,12B',
};

const gradeNumMap = {
  一年级: 1,
  二年级: 2,
  三年级: 3,
  四年级: 4,
  五年级: 5,
  六年级: 6,
  七年级: 7,
  八年级: 8,
  九年级: 9,
  高一: 10,
  高二: 11,
  高三: 12,
};

module.exports = {
  clazzTypeMap,
  subjectMap,
  gradeMap,
  gradeNumMap,
};
