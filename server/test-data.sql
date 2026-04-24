-- 测试数据SQL脚本

-- 首先创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS teamup_platform;
USE teamup_platform;

-- 清空现有数据（可选）
-- TRUNCATE TABLE messages;
-- TRUNCATE TABLE applications;
-- TRUNCATE TABLE projects;
-- TRUNCATE TABLE chats;
-- TRUNCATE TABLE users;

-- 插入用户数据
INSERT INTO users (name, email, password, avatar, college, major, bio, skills, verified, notification_enabled, created_at, updated_at)
VALUES 
('张三', 'zhangsan@example.com', '$2b$10$Q6fJ5wX3Y7z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square', '计算机科学与技术学院', '计算机科学与技术', '热爱编程，擅长前端开发，参加过多项编程竞赛', '["Vue", "JavaScript", "React", "Python"]', true, true, NOW(), NOW()),
('李四', 'lisi@example.com', '$2b$10$Q6fJ5wX3Y7z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square', '电子信息工程学院', '电子信息工程', '专注于算法研究，机器学习爱好者', '["Python", "机器学习", "数据挖掘", "C++"]', true, true, NOW(), NOW()),
('王五', 'wangwu@example.com', '$2b$10$Q6fJ5wX3Y7z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square', '软件学院', '软件工程', '全栈开发工程师，喜欢挑战新技术', '["Node.js", "Express", "MongoDB", "Vue"]', false, true, NOW(), NOW()),
('赵六', 'zhaoliu@example.com', '$2b$10$Q6fJ5wX3Y7z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square', '自动化学院', '自动化', '机器人爱好者，擅长嵌入式开发', '["C", "C++", "嵌入式", "Python"]', false, true, NOW(), NOW()),
('钱七', 'qianqi@example.com', '$2b$10$Q6fJ5wX3Y7z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square', '数学学院', '数学与应用数学', '数学建模高手，数据分析专家', '["Python", "MATLAB", "数学建模", "数据分析"]', true, true, NOW(), NOW());

-- 插入项目数据
INSERT INTO projects (title, description, competition_name, competition_type, deadline, people_needed, verification_required, cover_image, status, created_by, created_at, updated_at)
VALUES 
('AI 驱动的校园二手交易平台', '我们正在开发一个AI驱动的校园二手交易平台，通过机器学习算法实现智能推荐和价格预测。项目已经获得校级立项，现需要前端开发和算法优化的同学加入。', '互联网+', '国家级', '2026-05-10', 4, true, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=competition%20logo%20design&image_size=square', 'active', 1, NOW(), NOW()),
('基于区块链的学术成果认证系统', '利用区块链技术构建学术成果认证系统，确保学术成果的真实性和不可篡改性。项目旨在解决学术造假问题，推动学术诚信建设。', '挑战杯', '省级', '2026-06-15', 3, false, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blockchain%20technology&image_size=square', 'active', 2, NOW(), NOW()),
('智能校园导航系统', '开发一款智能校园导航系统，结合AR技术，为新生和访客提供直观的校园导览服务。系统将包含校园地图、建筑信息、路线规划等功能。', '大学生创新创业大赛', '校级', '2026-04-30', 5, false, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=campus%20navigation%20system&image_size=square', 'active', 3, NOW(), NOW()),
('环保材料检测与分析系统', '研发一套环保材料检测与分析系统，利用光谱技术快速检测材料的成分和环保指标。项目致力于推动环保材料的发展和应用。', '全国大学生节能减排社会实践与科技竞赛', '国家级', '2026-07-20', 4, true, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=environmental%20testing&image_size=square', 'closed', 4, NOW(), NOW()),
('基于大数据的学生学习行为分析系统', '通过分析学生的学习行为数据，为教师提供个性化的教学建议，帮助学生提高学习效率。项目将使用机器学习算法进行数据挖掘和预测分析。', '全国大学生数学建模竞赛', '国家级', '2026-05-25', 3, true, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20analysis%20education&image_size=square', 'active', 5, NOW(), NOW());

-- 插入申请表数据
INSERT INTO applications (project_id, applicant_id, reason_text, status, applied_at)
VALUES 
(1, 2, '我是李四，擅长机器学习和数据挖掘，希望能加入项目负责算法部分的开发。', 'accepted', NOW()),
(1, 3, '我是王五，全栈开发工程师，希望能加入项目负责后端开发。', 'pending', NOW()),
(2, 1, '我是张三，前端开发工程师，希望能加入项目负责前端界面的开发。', 'accepted', NOW()),
(3, 4, '我是赵六，自动化专业学生，擅长嵌入式开发，希望能加入项目负责硬件部分。', 'rejected', NOW()),
(5, 2, '我是李四，机器学习爱好者，希望能加入项目负责数据分析和算法设计。', 'accepted', NOW());

-- 插入聊天数据
INSERT INTO chats (type, last_message, participant_ids, updated_at)
VALUES 
('private', '你好，我对你们的项目很感兴趣，想了解更多细节。', '[1, 2]', NOW()),
('private', '好的，我们可以约个时间详细讨论一下。', '[1, 3]', NOW()),
('private', '项目进展如何了？', '[2, 4]', NOW()),
('group', '大家好，我们来讨论一下下周的任务分配。', '[1, 2, 3]', NOW());

-- 插入消息数据
INSERT INTO messages (chat_id, sender_id, receiver_id, content, is_read, created_at)
VALUES 
(1, 2, 1, '你好，我对你们的AI驱动校园二手交易平台项目很感兴趣。', true, NOW() - INTERVAL 2 HOUR),
(1, 1, 2, '你好，很高兴听到你对项目感兴趣，请问你擅长什么技术？', true, NOW() - INTERVAL 1 HOUR 30 MINUTE),
(1, 2, 1, '我擅长机器学习和数据挖掘，有相关项目经验。', false, NOW() - INTERVAL 1 HOUR),
(2, 3, 1, '你好，我看到你发布的项目，想了解一下后端技术栈。', true, NOW() - INTERVAL 3 HOUR),
(2, 1, 3, '我们后端使用Node.js和Express，数据库用MySQL。', true, NOW() - INTERVAL 2 HOUR 30 MINUTE),
(3, 4, 2, '项目进展如何了？', true, NOW() - INTERVAL 4 HOUR),
(3, 2, 4, '进展顺利，我们已经完成了核心功能的开发。', true, NOW() - INTERVAL 3 HOUR 30 MINUTE),
(4, 1, 2, '大家好，我们来讨论一下下周的任务分配。', true, NOW() - INTERVAL 5 HOUR),
(4, 2, 1, '好的，我已经准备了一个任务清单。', true, NOW() - INTERVAL 4 HOUR 30 MINUTE),
(4, 3, 1, '我没问题，随时可以开始。', false, NOW() - INTERVAL 4 HOUR);

-- 插入评论数据（如果有comment表）
-- 这里假设Comment模型文件存在
-- INSERT INTO comments (project_id, user_id, content, created_at, updated_at)
-- VALUES
-- (1, 2, '这个项目很有创意，我很感兴趣！', NOW(), NOW()),
-- (1, 3, '技术栈选择得很好，后端用Node.js很合适。', NOW(), NOW()),
-- (2, 1, '区块链技术在学术认证方面的应用很有前景。', NOW(), NOW()),
-- (3, 4, 'AR导航在校园场景中很实用，期待看到成品。', NOW(), NOW()),
-- (5, 5, '数据分析对教育的促进作用很大，支持这个项目。', NOW(), NOW());

-- 插入通知数据（如果有notification表）
-- 这里假设Notification模型文件存在
-- INSERT INTO notifications (user_id, type, content, is_read, created_at)
-- VALUES
-- (1, 'application', '李四申请加入你的项目', false, NOW()),
-- (2, 'application_accepted', '你的申请已被接受', false, NOW()),
-- (3, 'message', '张三给你发送了一条消息', false, NOW()),
-- (4, 'application_rejected', '你的申请被拒绝了', false, NOW()),
-- (5, 'project_update', '你关注的项目有更新', false, NOW());

-- 插入项目成员数据（如果有project_members表）
-- 这里假设ProjectMember模型文件存在
-- INSERT INTO project_members (project_id, user_id, role, joined_at)
-- VALUES
-- (1, 1, '队长', NOW()),
-- (1, 2, '算法工程师', NOW()),
-- (2, 2, '队长', NOW()),
-- (2, 1, '前端开发', NOW()),
-- (3, 3, '队长', NOW()),
-- (5, 5, '队长', NOW()),
-- (5, 2, '数据分析师', NOW());

-- 插入竞赛数据（如果有competition表）
-- 这里假设Competition模型文件存在
-- INSERT INTO competitions (name, type, level, description, start_date, end_date, created_at, updated_at)
-- VALUES
-- ('互联网+', '创新创业', '国家级', '中国“互联网+”大学生创新创业大赛', '2026-03-01', '2026-10-31', NOW(), NOW()),
-- ('挑战杯', '学术科技', '省级', '“挑战杯”全国大学生课外学术科技作品竞赛', '2026-04-01', '2026-09-30', NOW(), NOW()),
-- ('大学生创新创业大赛', '创新创业', '校级', '校级大学生创新创业大赛', '2026-02-01', '2026-06-30', NOW(), NOW()),
-- ('全国大学生节能减排社会实践与科技竞赛', '科技', '国家级', '全国大学生节能减排社会实践与科技竞赛', '2026-03-15', '2026-08-15', NOW(), NOW()),
-- ('全国大学生数学建模竞赛', '学术', '国家级', '全国大学生数学建模竞赛', '2026-09-01', '2026-09-15', NOW(), NOW());
