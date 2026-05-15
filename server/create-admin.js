const bcrypt = require('bcryptjs');
const sequelize = require('./app/config/database');
const User = require('./app/models/User');

async function createAdminUser() {
  try {
    await sequelize.sync();
    
    // 检查管理员是否已存在
    const existingAdmin = await User.findOne({
      where: { email: 'admin@example.com' }
    });
    
    if (existingAdmin) {
      console.log('管理员用户已存在');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
      process.exit(0);
    }
    
    // 创建管理员用户
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: '管理员',
      email: 'admin@example.com',
      password: hashedPassword,
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=admin%20avatar&image_size=square',
      college: '系统管理',
      major: '系统管理',
      bio: '系统管理员',
      skills: [],
      verified: true,
      notificationEnabled: true
    });
    
    console.log('管理员用户创建成功！');
    console.log('ID:', admin.id);
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('创建管理员用户失败:', error);
    process.exit(1);
  }
}

createAdminUser();
