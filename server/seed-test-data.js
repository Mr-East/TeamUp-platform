// 测试数据种子脚本
const bcrypt = require('bcryptjs');
const sequelize = require('./app/config/database');
const User = require('./app/models/User');
const Project = require('./app/models/Project');
const Application = require('./app/models/Application');
const Chat = require('./app/models/Chat');
const Message = require('./app/models/Message');

// 加密密码
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// 主函数
const seedTestData = async () => {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 同步表结构（如果需要）
    // await sequelize.sync({ force: true });
    // console.log('表结构同步完成');

    // 生成测试数据
    console.log('开始生成测试数据...');

    // 1. 插入用户数据
    console.log('插入用户数据...');
    const users = await User.bulkCreate([
      {
        name: '张三',
        email: 'zhangsan@example.com',
        password: await hashPassword('123456'),
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
        college: '计算机科学与技术学院',
        major: '计算机科学与技术',
        bio: '热爱编程，擅长前端开发，参加过多项编程竞赛',
        skills: ['Vue', 'JavaScript', 'React', 'Python'],
        verified: true,
        notificationEnabled: true
      },
      {
        name: '李四',
        email: 'lisi@example.com',
        password: await hashPassword('123456'),
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square',
        college: '电子信息工程学院',
        major: '电子信息工程',
        bio: '专注于算法研究，机器学习爱好者',
        skills: ['Python', '机器学习', '数据挖掘', 'C++'],
        verified: true,
        notificationEnabled: true
      },
      {
        name: '王五',
        email: 'wangwu@example.com',
        password: await hashPassword('123456'),
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
        college: '软件学院',
        major: '软件工程',
        bio: '全栈开发工程师，喜欢挑战新技术',
        skills: ['Node.js', 'Express', 'MongoDB', 'Vue'],
        verified: false,
        notificationEnabled: true
      },
      {
        name: '赵六',
        email: 'zhaoliu@example.com',
        password: await hashPassword('123456'),
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square',
        college: '自动化学院',
        major: '自动化',
        bio: '机器人爱好者，擅长嵌入式开发',
        skills: ['C', 'C++', '嵌入式', 'Python'],
        verified: false,
        notificationEnabled: true
      },
      {
        name: '钱七',
        email: 'qianqi@example.com',
        password: await hashPassword('123456'),
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
        college: '数学学院',
        major: '数学与应用数学',
        bio: '数学建模高手，数据分析专家',
        skills: ['Python', 'MATLAB', '数学建模', '数据分析'],
        verified: true,
        notificationEnabled: true
      }
    ], { returning: true });

    console.log(`成功插入 ${users.length} 个用户`);

    // 2. 插入项目数据
    console.log('插入项目数据...');
    const projects = await Project.bulkCreate([
      {
        title: 'AI 驱动的校园二手交易平台',
        description: '我们正在开发一个AI驱动的校园二手交易平台，通过机器学习算法实现智能推荐和价格预测。项目已经获得校级立项，现需要前端开发和算法优化的同学加入。',
        competitionName: '互联网+',
        competitionType: '国家级',
        deadline: new Date('2026-05-10'),
        peopleNeeded: 4,
        verificationRequired: true,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=competition%20logo%20design&image_size=square',
        status: 'active',
        createdBy: users[0].id
      },
      {
        title: '基于区块链的学术成果认证系统',
        description: '利用区块链技术构建学术成果认证系统，确保学术成果的真实性和不可篡改性。项目旨在解决学术造假问题，推动学术诚信建设。',
        competitionName: '挑战杯',
        competitionType: '省级',
        deadline: new Date('2026-06-15'),
        peopleNeeded: 3,
        verificationRequired: false,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blockchain%20technology&image_size=square',
        status: 'active',
        createdBy: users[1].id
      },
      {
        title: '智能校园导航系统',
        description: '开发一款智能校园导航系统，结合AR技术，为新生和访客提供直观的校园导览服务。系统将包含校园地图、建筑信息、路线规划等功能。',
        competitionName: '大学生创新创业大赛',
        competitionType: '校级',
        deadline: new Date('2026-04-30'),
        peopleNeeded: 5,
        verificationRequired: false,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=campus%20navigation%20system&image_size=square',
        status: 'active',
        createdBy: users[2].id
      },
      {
        title: '环保材料检测与分析系统',
        description: '研发一套环保材料检测与分析系统，利用光谱技术快速检测材料的成分和环保指标。项目致力于推动环保材料的发展和应用。',
        competitionName: '全国大学生节能减排社会实践与科技竞赛',
        competitionType: '国家级',
        deadline: new Date('2026-07-20'),
        peopleNeeded: 4,
        verificationRequired: true,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=environmental%20testing&image_size=square',
        status: 'closed',
        createdBy: users[3].id
      },
      {
        title: '基于大数据的学生学习行为分析系统',
        description: '通过分析学生的学习行为数据，为教师提供个性化的教学建议，帮助学生提高学习效率。项目将使用机器学习算法进行数据挖掘和预测分析。',
        competitionName: '全国大学生数学建模竞赛',
        competitionType: '国家级',
        deadline: new Date('2026-05-25'),
        peopleNeeded: 3,
        verificationRequired: true,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20analysis%20education&image_size=square',
        status: 'active',
        createdBy: users[4].id
      }
    ], { returning: true });

    console.log(`成功插入 ${projects.length} 个项目`);

    // 3. 插入申请表数据
    console.log('插入申请表数据...');
    const applications = await Application.bulkCreate([
      {
        projectId: projects[0].id,
        applicantId: users[1].id,
        reasonText: '我是李四，擅长机器学习和数据挖掘，希望能加入项目负责算法部分的开发。',
        status: 'accepted',
        appliedAt: new Date()
      },
      {
        projectId: projects[0].id,
        applicantId: users[2].id,
        reasonText: '我是王五，全栈开发工程师，希望能加入项目负责后端开发。',
        status: 'pending',
        appliedAt: new Date()
      },
      {
        projectId: projects[1].id,
        applicantId: users[0].id,
        reasonText: '我是张三，前端开发工程师，希望能加入项目负责前端界面的开发。',
        status: 'accepted',
        appliedAt: new Date()
      },
      {
        projectId: projects[2].id,
        applicantId: users[3].id,
        reasonText: '我是赵六，自动化专业学生，擅长嵌入式开发，希望能加入项目负责硬件部分。',
        status: 'rejected',
        appliedAt: new Date()
      },
      {
        projectId: projects[4].id,
        applicantId: users[1].id,
        reasonText: '我是李四，机器学习爱好者，希望能加入项目负责数据分析和算法设计。',
        status: 'accepted',
        appliedAt: new Date()
      }
    ], { returning: true });

    console.log(`成功插入 ${applications.length} 个申请`);

    // 4. 插入聊天数据
    console.log('插入聊天数据...');
    const chats = await Chat.bulkCreate([
      {
        type: 'private',
        lastMessage: '你好，我对你们的项目很感兴趣，想了解更多细节。',
        participantIds: [users[0].id, users[1].id]
      },
      {
        type: 'private',
        lastMessage: '好的，我们可以约个时间详细讨论一下。',
        participantIds: [users[0].id, users[2].id]
      },
      {
        type: 'private',
        lastMessage: '项目进展如何了？',
        participantIds: [users[1].id, users[3].id]
      },
      {
        type: 'group',
        lastMessage: '大家好，我们来讨论一下下周的任务分配。',
        participantIds: [users[0].id, users[1].id, users[2].id]
      }
    ], { returning: true });

    console.log(`成功插入 ${chats.length} 个聊天`);

    // 5. 插入消息数据
    console.log('插入消息数据...');
    const messages = await Message.bulkCreate([
      {
        chatId: chats[0].id,
        senderId: users[1].id,
        receiverId: users[0].id,
        content: '你好，我对你们的AI驱动校园二手交易平台项目很感兴趣。',
        isRead: true
      },
      {
        chatId: chats[0].id,
        senderId: users[0].id,
        receiverId: users[1].id,
        content: '你好，很高兴听到你对项目感兴趣，请问你擅长什么技术？',
        isRead: true
      },
      {
        chatId: chats[0].id,
        senderId: users[1].id,
        receiverId: users[0].id,
        content: '我擅长机器学习和数据挖掘，有相关项目经验。',
        isRead: false
      },
      {
        chatId: chats[1].id,
        senderId: users[2].id,
        receiverId: users[0].id,
        content: '你好，我看到你发布的项目，想了解一下后端技术栈。',
        isRead: true
      },
      {
        chatId: chats[1].id,
        senderId: users[0].id,
        receiverId: users[2].id,
        content: '我们后端使用Node.js和Express，数据库用MySQL。',
        isRead: true
      },
      {
        chatId: chats[2].id,
        senderId: users[3].id,
        receiverId: users[1].id,
        content: '项目进展如何了？',
        isRead: true
      },
      {
        chatId: chats[2].id,
        senderId: users[1].id,
        receiverId: users[3].id,
        content: '进展顺利，我们已经完成了核心功能的开发。',
        isRead: true
      },
      {
        chatId: chats[3].id,
        senderId: users[0].id,
        receiverId: users[1].id,
        content: '大家好，我们来讨论一下下周的任务分配。',
        isRead: true
      },
      {
        chatId: chats[3].id,
        senderId: users[1].id,
        receiverId: users[0].id,
        content: '好的，我已经准备了一个任务清单。',
        isRead: true
      },
      {
        chatId: chats[3].id,
        senderId: users[2].id,
        receiverId: users[0].id,
        content: '我没问题，随时可以开始。',
        isRead: false
      }
    ], { returning: true });

    console.log(`成功插入 ${messages.length} 条消息`);

    console.log('测试数据生成完成！');
    console.log('\n测试账号信息：');
    users.forEach(user => {
      console.log(`邮箱: ${user.email}，密码: 123456`);
    });

  } catch (error) {
    console.error('生成测试数据时出错:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
    console.log('数据库连接已关闭');
  }
};

// 执行种子脚本
seedTestData();
