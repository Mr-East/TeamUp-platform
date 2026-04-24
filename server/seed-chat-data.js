const sequelize = require('./app/config/database');
const User = require('./app/models/User');
const Chat = require('./app/models/Chat');
const Message = require('./app/models/Message');

const seedChatData = async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    const users = await User.findAll({ limit: 5 });
    if (users.length < 2) {
      console.log('用户数据不足，请先运行 seed-test-data.js');
      return;
    }

    console.log(`\n找到 ${users.length} 个用户`);
    users.forEach((user, index) => {
      console.log(`用户 ${index + 1}: ${user.name} (ID: ${user.id})`);
    });

    const adminUser = users[0];
    const otherUsers = users.slice(1);

    console.log(`\n开始为用户 ${adminUser.name} (ID: ${adminUser.id}) 创建聊天数据...`);

    for (let i = 0; i < otherUsers.length; i++) {
      const otherUser = otherUsers[i];

      console.log(`\n创建与用户 ${otherUser.name} 的聊天...`);

      const [chat, created] = await Chat.findOrCreate({
        where: {
          type: 'private',
          participantIds: [Math.min(adminUser.id, otherUser.id), Math.max(adminUser.id, otherUser.id)]
        },
        defaults: {
          type: 'private',
          participantIds: [Math.min(adminUser.id, otherUser.id), Math.max(adminUser.id, otherUser.id)],
          lastMessage: null
        }
      });

      if (created) {
        console.log(`  新建聊天，ID: ${chat.id}`);
      } else {
        console.log(`  已有聊天，ID: ${chat.id}`);
      }

      const existingMessages = await Message.count({
        where: { chatId: chat.id }
      });

      if (existingMessages === 0) {
        console.log(`  添加消息...`);

        await Message.create({
          chatId: chat.id,
          senderId: adminUser.id,
          receiverId: otherUser.id,
          content: `你好，我是${adminUser.name}！很高兴认识你。`,
          isRead: true
        });

        await Message.create({
          chatId: chat.id,
          senderId: otherUser.id,
          receiverId: adminUser.id,
          content: `你好！我是${otherUser.name}，很高兴认识你！`,
          isRead: true
        });

        await Message.create({
          chatId: chat.id,
          senderId: adminUser.id,
          receiverId: otherUser.id,
          content: '我在组队广场看到你的项目，想了解一下具体情况。',
          isRead: false
        });

        chat.lastMessage = '我在组队广场看到你的项目，想了解一下具体情况。';
        await chat.save();

        console.log(`  添加了 3 条消息`);
      } else {
        console.log(`  已有 ${existingMessages} 条消息，跳过`);
      }
    }

    console.log('\n聊天数据创建完成！');

    const allChats = await Chat.findAll();
    console.log(`\n总共有 ${allChats.length} 个聊天`);

    for (const chat of allChats) {
      const messageCount = await Message.count({
        where: { chatId: chat.id }
      });
      const otherUserId = chat.participantIds.find(id => id !== adminUser.id);
      const otherUser = await User.findByPk(otherUserId);
      console.log(`\n聊天 ${chat.id} (与 ${otherUser?.name || '未知'}): ${messageCount} 条消息`);
    }

  } catch (error) {
    console.error('创建聊天数据时出错:', error);
  } finally {
    await sequelize.close();
    console.log('\n数据库连接已关闭');
  }
};

seedChatData();