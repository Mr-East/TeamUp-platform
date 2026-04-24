// 数据库迁移脚本 - 添加 skills 列到 projects 表
const sequelize = require('./app/config/database');

const migrateDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 检查列是否存在
    const [columns] = await sequelize.query("SHOW COLUMNS FROM projects LIKE 'skills'");
    
    if (columns.length === 0) {
      console.log('正在添加 skills 列...');
      await sequelize.query("ALTER TABLE projects ADD COLUMN skills JSON");
      console.log('skills 列添加成功');
    } else {
      console.log('skills 列已存在，跳过添加列');
    }

    // 更新现有项目的 skills 数据
    console.log('正在更新现有项目的 skills 数据...');
    await sequelize.query(`
      UPDATE projects SET skills = '["Vue", "JavaScript", "Node.js", "Python"]' WHERE id = 1 AND (skills IS NULL OR skills = '[]' OR JSON_LENGTH(skills) = 0);
    `);
    await sequelize.query(`
      UPDATE projects SET skills = '["机器学习", "深度学习", "TensorFlow", "Python"]' WHERE id = 2 AND (skills IS NULL OR skills = '[]' OR JSON_LENGTH(skills) = 0);
    `);
    await sequelize.query(`
      UPDATE projects SET skills = '["Java", "Spring Boot", "MySQL", "Redis"]' WHERE id = 3 AND (skills IS NULL OR skills = '[]' OR JSON_LENGTH(skills) = 0);
    `);
    await sequelize.query(`
      UPDATE projects SET skills = '["HTML", "CSS", "JavaScript", "React"]' WHERE id = 4 AND (skills IS NULL OR skills = '[]' OR JSON_LENGTH(skills) = 0);
    `);
    await sequelize.query(`
      UPDATE projects SET skills = '["Python", "数据分析", "Pandas", "NumPy"]' WHERE id = 5 AND (skills IS NULL OR skills = '[]' OR JSON_LENGTH(skills) = 0);
    `);
    await sequelize.query(`
      UPDATE projects SET skills = '["Vue", "微信小程序", "云开发", "云函数"]' WHERE id = 6 AND (skills IS NULL OR skills = '[]' OR JSON_LENGTH(skills) = 0);
    `);
    await sequelize.query(`
      UPDATE projects SET skills = '["JavaScript", "TypeScript", "Node.js", "MongoDB"]' WHERE id = 7 AND (skills IS NULL OR skills = '[]' OR JSON_LENGTH(skills) = 0);
    `);
    await sequelize.query(`
      UPDATE projects SET skills = '["Python", "Flask", "前端开发", "UI设计"]' WHERE id = 8 AND (skills IS NULL OR skills = '[]' OR JSON_LENGTH(skills) = 0);
    `);
    console.log('项目 skills 数据更新完成');

    console.log('迁移完成');
  } catch (error) {
    console.error('迁移失败:', error);
  } finally {
    await sequelize.close();
  }
};

migrateDatabase();