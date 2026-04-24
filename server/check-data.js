const sequelize = require('./app/config/database');
const User = require('./app/models/User');
const Project = require('./app/models/Project');
const Application = require('./app/models/Application');

const checkData = async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 1. 查找 admin12345 用户
    const adminUser = await User.findOne({
      where: { email: '123@qq.com' }
    });

    if (!adminUser) {
      console.log('未找到 admin12345 用户');
      return;
    }

    console.log(`\nAdmin 用户信息:`);
    console.log(`ID: ${adminUser.id}`);
    console.log(`Name: ${adminUser.name}`);
    console.log(`Email: ${adminUser.email}`);

    // 2. 查找该用户创建的项目
    const projects = await Project.findAll({
      where: { createdBy: adminUser.id }
    });

    console.log(`\nAdmin 创建的项目:`);
    projects.forEach((project, index) => {
      console.log(`项目 ${index + 1}:`);
      console.log(`  ID: ${project.id}`);
      console.log(`  标题: ${project.title}`);
      console.log(`  状态: ${project.status}`);
    });

    // 3. 查找每个项目的申请
    for (const project of projects) {
      const applications = await Application.findAll({
        where: { projectId: project.id, status: 'pending' },
        include: [{ model: User, as: 'applicant' }]
      });

      console.log(`\n项目 ${project.title} 的待处理申请:`);
      if (applications.length === 0) {
        console.log('  暂无待处理申请');
      } else {
        applications.forEach((app, index) => {
          console.log(`  申请 ${index + 1}:`);
          console.log(`    ID: ${app.id}`);
          console.log(`    申请人: ${app.applicant?.name || '未知'}`);
          console.log(`    申请理由: ${app.reasonText}`);
          console.log(`    状态: ${app.status}`);
        });
      }
    }

    // 4. 查找 admin 用户的申请
    const adminApplications = await Application.findAll({
      where: { applicantId: adminUser.id }
    });

    console.log(`\nAdmin 用户的申请:`);
    if (adminApplications.length === 0) {
      console.log('  暂无申请');
    } else {
      adminApplications.forEach((app, index) => {
        console.log(`  申请 ${index + 1}:`);
        console.log(`    ID: ${app.id}`);
        console.log(`    项目ID: ${app.projectId}`);
        console.log(`    状态: ${app.status}`);
      });
    }

  } catch (error) {
    console.error('检查数据时出错:', error);
  } finally {
    await sequelize.close();
    console.log('\n数据库连接已关闭');
  }
};

checkData();