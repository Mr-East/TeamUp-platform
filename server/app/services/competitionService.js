// 模拟竞赛数据
const competitions = [
  {
    id: 1,
    name: '全国大学生数学建模竞赛',
    type: '学术竞赛',
    description: '全国大学生数学建模竞赛是全国高校规模最大的基础性学科竞赛，也是世界上规模最大的数学建模竞赛。',
    deadline: '2026-09-15',
    organization: '中国工业与应用数学学会',
    level: '国家级',
    image: 'https://example.com/math-modeling.jpg'
  },
  {
    id: 2,
    name: '全国大学生电子设计竞赛',
    type: '科技竞赛',
    description: '全国大学生电子设计竞赛是教育部和工业和信息化部共同主办的全国性大学生学科竞赛。',
    deadline: '2026-08-20',
    organization: '教育部高等教育司',
    level: '国家级',
    image: 'https://example.com/electronic-design.jpg'
  },
  {
    id: 3,
    name: '挑战杯全国大学生课外学术科技作品竞赛',
    type: '综合竞赛',
    description: '挑战杯是由共青团中央、中国科协、教育部、全国学联和地方政府共同主办的全国性大学生课外学术科技活动。',
    deadline: '2026-11-30',
    organization: '共青团中央',
    level: '国家级',
    image: 'https://example.com/challenge-cup.jpg'
  },
  {
    id: 4,
    name: '全国大学生程序设计竞赛',
    type: '科技竞赛',
    description: '全国大学生程序设计竞赛是由教育部高等学校计算机类专业教学指导委员会主办的全国性大学生学科竞赛。',
    deadline: '2026-10-10',
    organization: '教育部高等学校计算机类专业教学指导委员会',
    level: '国家级',
    image: 'https://example.com/programming.jpg'
  },
  {
    id: 5,
    name: '全国大学生英语竞赛',
    type: '语言竞赛',
    description: '全国大学生英语竞赛是经教育部有关部门批准举办的全国性大学生英语综合能力竞赛。',
    deadline: '2026-04-15',
    organization: '高等学校大学外语教学指导委员会',
    level: '国家级',
    image: 'https://example.com/english-competition.jpg'
  }
];

// 模拟技能标签
const skills = [
  '前端开发', '后端开发', '移动开发', '人工智能', '机器学习',
  '数据科学', '大数据', '云计算', '区块链', '网络安全',
  '嵌入式开发', '物联网', 'UI设计', 'UX设计', '产品经理',
  '项目管理', '市场营销', '商务策划', '财务分析', '法律',
  '数学建模', '物理', '化学', '生物', '环境科学',
  '机械设计', '电子电路', '自动化', '材料科学', '土木工程'
];

const getCompetitions = () => {
  return competitions;
};

const getCompetitionById = (id) => {
  const competition = competitions.find(c => c.id === parseInt(id));
  if (!competition) {
    throw new Error('Competition not found');
  }
  return competition;
};

const getSkills = () => {
  return skills;
};

const searchSkills = (query) => {
  return skills.filter(skill => skill.toLowerCase().includes(query.toLowerCase()));
};

module.exports = {
  getCompetitions,
  getCompetitionById,
  getSkills,
  searchSkills
};
