const { successResponse, errorResponse } = require('../utils/response');
const path = require('path');
const fs = require('fs');

const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const file = req.file;
    const fileName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    const filePath = path.join(__dirname, '../../uploads', fileName);

    // 保存文件
    fs.writeFileSync(filePath, file.buffer);

    // 返回文件URL
    const fileUrl = `http://localhost:3000/uploads/${fileName}`;

    return successResponse(res, { url: fileUrl }, 'File uploaded successfully');
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse(res, 'Upload failed', 500);
  }
};

module.exports = {
  uploadFile
};