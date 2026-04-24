const bcrypt = require('bcryptjs');
const sequelize = require('./app/config/database');
const User = require('./app/models/User');
const Project = require('./app/models/Project');
const Application = require('./app/models/Application');
const ProjectMember = require('./app/models/ProjectMember');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const seedInvitesTestData = async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    console.log('开始生成组队申请测试数据...');

    // 1. 获取或创建测试用户
    const [adminUser] = await User.findOrCreate({
      where: { email: '123@qq.com' },
      defaults: {
        name: 'admin12345',
        email: '123@qq.com',
        password: await hashPassword('123456'),
        avatar: 'http://localhost:3000/uploads/avatar-1776773303408-558237130.jpg',
        college: '计算机学院',
        major: '计算机科学与技术',
        bio: '我是admin',
        skills: ['前端开发'],
        verified: false,
        notificationEnabled: true
      }
    });
    console.log(`用户: ${adminUser.name} (ID: ${adminUser.id})`);

    // 创建更多测试用户
    const [user2] = await User.findOrCreate({
      where: { email: 'zhangsan@example.com' },
      defaults: {
        name: '张三',
        email: 'zhangsan@example.com',
        password: await hashPassword('123456'),
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
        college: '计算机学院',
        major: '软件工程',
        bio: '热爱编程，擅长前端开发',
        skills: ['Vue', 'React', 'JavaScript'],
        verified: true,
        notificationEnabled: true
      }
    });

    const [user3] = await User.findOrCreate({
      where: { email: 'lisi@example.com' },
      defaults: {
        name: '李四',
        email: 'lisi@example.com',
        password: await hashPassword('123456'),
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square',
        college: '信息学院',
        major: '计算机科学与技术',
        bio: '擅长机器学习和数据挖掘',
        skills: ['Python', '机器学习', '数据挖掘'],
        verified: true,
        notificationEnabled: true
      }
    });

    const [user4] = await User.findOrCreate({
      where: { email: 'wangwu@example.com' },
      defaults: {
        name: '王五',
        email: 'wangwu@example.com',
        password: await hashPassword('123456'),
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
        college: '管理学院',
        major: '工商管理',
        bio: '有丰富的项目管理经验',
        skills: ['项目管理', '市场营销', '活动策划'],
        verified: false,
        notificationEnabled: true
      }
    });

    console.log(`成功创建/获取 4 个用户`);

    // 2. 创建测试项目（由admin用户创建）
    const [project1] = await Project.findOrCreate({
      where: { title: 'AI驱动的校园二手交易平台' },
      defaults: {
        title: 'AI驱动的校园二手交易平台',
        description: '我们正在开发一个AI驱动的校园二手交易平台，通过机器学习算法实现智能推荐和价格预测。项目已经获得校级立项，现需要前端开发和算法优化的同学加入。',
        competitionName: '互联网+',
        competitionType: '国家级',
        deadline: new Date('2026-05-10'),
        peopleNeeded: 4,
        verificationRequired: true,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=competition%20logo%20design&image_size=square',
        status: 'active',
        createdBy: adminUser.id
      }
    });

    const [project2] = await Project.findOrCreate({
      where: { title: '校园社团资源整合平台' },
      defaults: {
        title: '校园社团资源整合平台',
        description: '开发一款校园社团资源整合平台，方便学生查找和加入社团，管理社团活动。',
        competitionName: '校园创新大赛',
        competitionType: '校级',
        deadline: new Date('2026-06-15'),
        peopleNeeded: 3,
        verificationRequired: false,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=campus%20platform&image_size=square',
        status: 'active',
        createdBy: adminUser.id
      }
    });

    console.log(`成功创建/获取 2 个项目`);

    // 3. 将admin用户设置为其创建项目的成员（owner）
    await ProjectMember.findOrCreate({
      where: { projectId: project1.id, userId: adminUser.id },
      defaults: {
        projectId: project1.id,
        userId: adminUser.id,
        role: 'owner',
        status: 'accepted'
      }
    });

    await ProjectMember.findOrCreate({
      where: { projectId: project2.id, userId: adminUser.id },
      defaults: {
        projectId: project2.id,
        userId: adminUser.id,
        role: 'owner',
        status: 'accepted'
      }
    });

    // 4. 创建组队申请（其他用户申请加入admin的项目）
    const applications = [
      {
        projectId: project1.id,
        applicantId: user2.id,
        reasonText: '我对深度学习很有经验，曾主导过类似项目的后端开发，希望能加入你们共同完善算法。',
        status: 'pending'
      },
      {
        projectId: project1.id,
        applicantId: user3.id,
        reasonText: '我擅长前端开发，希望能为项目的用户界面设计贡献力量。',
        status: 'pending'
      },
      {
        projectId: project2.id,
        applicantId: user4.id,
        reasonText: '我有丰富的社团管理经验，希望能帮助平台更好地整合社团资源。',
        status: 'pending'
      }
    ];

    for (const app of applications) {
      await Application.findOrCreate({
        where: { projectId: app.projectId, applicantId: app.applicantId },
        defaults: app
      });
    }

    console.log(`成功创建 ${applications.length} 个申请记录`);

    // 5. 创建一些我的申请（admin用户申请加入其他用户的项目）
    // 先创建其他用户的项目
    const [project3] = await Project.findOrCreate({
      where: { title: '绿色校园碳普惠小程序' },
      defaults: {
        title: '绿色校园碳普惠小程序',
        description: '开发一款绿色校园碳普惠小程序，鼓励学生参与环保活动。',
        competitionName: '环保创意大赛',
        competitionType: '省级',
        deadline: new Date('2026-07-01'),
        peopleNeeded: 3,
        verificationRequired: false,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=green%20campus&image_size=square',
        status: 'active',
        createdBy: user2.id
      }
    });

    // admin用户申请加入project3
    await Application.findOrCreate({
      where: { projectId: project3.id, applicantId: adminUser.id },
      defaults: {
        projectId: project3.id,
        applicantId: adminUser.id,
        reasonText: '我对环保项目很感兴趣，希望能为校园环保贡献力量。',
        status: 'pending'
      }
    });

    console.log('测试数据生成完成！');
    console.log('\n测试账号信息：');
    console.log('邮箱: 123@qq.com，密码: 123456 (admin用户，创建了2个项目)');
    console.log('邮箱: zhangsan@example.com，密码: 123456 (张三，创建了1个项目)');
    console.log('邮箱: lisi@example.com，密码: 123456 (李四)');
    console.log('邮箱: wangwu@example.com，密码: 123456 (王五)');

  } catch (error) {
    console.error('生成测试数据时出错:', error);
  } finally {
    await sequelize.close();
    console.log('数据库连接已关闭');
  }
};

seedInvitesTestData();