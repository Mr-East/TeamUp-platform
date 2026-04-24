const sequelize = require('./app/config/database');
const User = require('./app/models/User');
const Chat = require('./app/models/Chat');
const Message = require('./app/models/Message');

const checkChatData = async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    const adminUser = await User.findOne({
      where: { email: '123@qq.com' }
    });

    if (!adminUser) {
      console.log('未找到 admin 用户');
      return;
    }

    console.log(`\nAdmin 用户信息:`);
    console.log(`ID: ${adminUser.id}`);
    console.log(`Name: ${adminUser.name}`);
    console.log(`Email: ${adminUser.email}`);

    const chats = await Chat.findAll();
    console.log(`\n所有聊天 (共 ${chats.length} 个):`);

    for (const chat of chats) {
      const messages = await Message.findAll({
        where: { chatId: chat.id },
        order: [['created_at', 'ASC']]
      });

      const otherUserId = chat.participantIds.find(id => id !== adminUser.id);
      const otherUser = await User.findByPk(otherUserId);

      console.log(`\n聊天 ${chat.id}:`);
      console.log(`  对方用户: ${otherUser?.name || '未知'} (ID: ${otherUserId})`);
      console.log(`  消息数量: ${messages.length}`);
      console.log(`  最后消息: ${chat.lastMessage || '无'}`);

      if (messages.length > 0) {
        console.log(`  最新消息:`);
        const lastMsg = messages[messages.length - 1];
        const sender = await User.findByPk(lastMsg.senderId);
        console.log(`    ${sender?.name || '未知'}: ${lastMsg.content}`);
      }
    }

    const myChats = chats.filter(chat => chat.participantIds.includes(adminUser.id));
    console.log(`\nAdmin 参与的聊天: ${myChats.length} 个`);

  } catch (error) {
    console.error('检查聊天数据时出错:', error);
  } finally {
    await sequelize.close();
    console.log('\n数据库连接已关闭');
  }
};

checkChatData();