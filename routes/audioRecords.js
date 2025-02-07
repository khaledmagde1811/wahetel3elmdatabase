const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// إعداد التخزين باستخدام multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // تحديد مجلد التخزين
    cb(null, 'uploads/audio');
  },
  filename: function(req, file, cb) {
    // إنشاء اسم فريد للملف مع الحفاظ على الامتداد الأصلي
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// دالة التحقق من نوع الملف (يجب أن يكون ملف صوتي)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('الملف المرفوع ليس ملف صوتي'), false);
  }
};

// إعداد multer مع خيارات التخزين والتحقق من حجم الملف (مثلاً 10MB)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 ميجابايت
});

// Middleware بسيط للتحقق من صلاحيات الأدمن (يمكنك تخصيصه حسب نظامك)
const isAdmin = (req, res, next) => {
  // هنا يجب أن تتحقق من أن المستخدم مسجل الدخول وصلاحياته admin
  // على سبيل المثال:
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'ليس لديك صلاحيات الوصول' });
};

// نقطة النهاية لرفع الملف الصوتي عبر الأدمن
router.post('/upload', isAdmin, upload.single('audio'), (req, res) => {
  try {
    // يتم تخزين معلومات الملف في req.file
    res.status(201).json({ 
      message: 'تم رفع الملف الصوتي بنجاح!', 
      file: req.file 
    });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء رفع الملف', error: err.message });
  }
});

module.exports = router;
