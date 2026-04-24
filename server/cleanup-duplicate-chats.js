const sequelize = require('./app/config/database');
const Chat = require('./app/models/Chat');
const Message = require('./app/models/Message');

async function cleanupDuplicateChats() {
  try {
    console.log('开始清理重复聊天记录...');
    
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 获取所有聊天
    const allChats = await Chat.findAll();
    console.log(`找到 ${allChats.length} 条聊天记录`);
    
    // 分组：按参与者组合分组
    const chatGroups = {};
    for (const chat of allChats) {
      if (Array.isArray(chat.participantIds)) {
        const participants = chat.participantIds.map(id => Number(id)).sort((a, b) => a - b);
        const key = `${participants[0]}-${participants[1]}`;
        if (!chatGroups[key]) {
          chatGroups[key] = [];
        }
        chatGroups[key].push(chat);
      }
    }
    
    // 找出有重复的分组
    let totalDuplicates = 0;
    for (const key in chatGroups) {
      const group = chatGroups[key];
      if (group.length > 1) {
        console.log(`找到重复聊天组: ${key}, 共有 ${group.length} 条`);
        totalDuplicates += (group.length - 1);
        
        // 保留最新的一条，删除其余的
        const sortedChats = group.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        const chatToKeep = sortedChats[0];
        const chatsToDelete = sortedChats.slice(1);
        
        // 将重复聊天中的消息移动到保留的聊天
        for (const chatToDelete of chatsToDelete) {
          const messagesToMove = await Message.findAll({
            where: { chatId: chatToDelete.id }
          });
          
          for (const message of messagesToMove) {
            message.chatId = chatToKeep.id;
            await message.save();
          }
          
          // 删除重复聊天
          await chatToDelete.destroy();
          console.log(`已删除聊天 ID ${chatToDelete.id}，并将消息移动到聊天 ID ${chatToKeep.id}`);
        }
      }
    }
    
    if (totalDuplicates === 0) {
      console.log('没有找到重复的聊天记录');
    } else {
      console.log(`共清理了 ${totalDuplicates} 条重复聊天记录`);
    }
    
    console.log('清理完成');
  } catch (error) {
    console.error('清理失败:', error);
  } finally {
    await sequelize.close();
  }
}

cleanupDuplicateChats();