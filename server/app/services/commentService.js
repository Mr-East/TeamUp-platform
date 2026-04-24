const Comment = require('../models/Comment');
const Project = require('../models/Project');
const User = require('../models/User');

const createComment = async (projectId, userId, content) => {
  // 检查项目是否存在
  const project = await Project.findByPk(projectId);
  if (!project) {
    throw new Error('Project not found');
  }
  
  // 创建评论
  const comment = await Comment.create({
    projectId,
    userId,
    content
  });
  
  // 加载用户信息
  const populatedComment = await Comment.findByPk(comment.id, {
    include: [{
      model: User,
      attributes: ['id', 'name', 'avatar']
    }]
  });
  
  return populatedComment;
};

const replyToComment = async (commentId, userId, content) => {
  // 检查父评论是否存在
  const parentComment = await Comment.findByPk(commentId);
  if (!parentComment) {
    throw new Error('Parent comment not found');
  }
  
  // 创建回复
  const reply = await Comment.create({
    projectId: parentComment.projectId,
    userId,
    content,
    parentCommentId: commentId
  });
  
  // 加载用户信息
  const populatedReply = await Comment.findByPk(reply.id, {
    include: [{
      model: User,
      attributes: ['id', 'name', 'avatar']
    }]
  });
  
  return populatedReply;
};

const getProjectComments = async (projectId) => {
  // 检查项目是否存在
  const project = await Project.findByPk(projectId);
  if (!project) {
    throw new Error('Project not found');
  }
  
  // 获取所有评论（包括回复）
  const comments = await Comment.findAll({
    where: { projectId, parentCommentId: null },
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'avatar']
      },
      {
        model: Comment,
        as: 'replies',
        include: [{
          model: User,
          attributes: ['id', 'name', 'avatar']
        }],
        order: [['created_at', 'ASC']]
      }
    ],
    order: [['created_at', 'DESC']]
  });
  
  return comments;
};

const likeComment = async (commentId) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  comment.likesCount += 1;
  await comment.save();
  
  return comment;
};

const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  // 检查权限
  if (comment.userId !== userId) {
    throw new Error('Permission denied');
  }
  
  await comment.destroy();
  
  return { message: 'Comment deleted successfully' };
};

module.exports = {
  createComment,
  replyToComment,
  getProjectComments,
  likeComment,
  deleteComment
};
