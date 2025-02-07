const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// إعداد التخزين باستخدام multer للكتب
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // تحديد مجلد تخزين الكتب (تأكد من وجود المجلد uploads/books)
    cb(null, 'uploads/books');
  },
  filename: function(req, file, cb) {
    // إنشاء اسم فريد للملف مع الاحتفاظ بامتداده الأصلي
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// دالة التحقق من نوع الملف (سنسمح فقط بملفات PDF أو DOC أو DOCX أو EPUB)
const fileFilter = (req, file, cb) => {
  const allowedMimetypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/epub+zip'
  ];
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('الملف المرفوع ليس ملف كتاب مسموح به'), false);
  }
};

// إعداد multer مع خيارات التخزين والتحقق من حجم الملف (مثلاً 20 ميجابايت)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 ميجابايت
});

// Middleware للتحقق من صلاحيات الأدمن
const isAdmin = (req, res, next) => {
  // تأكد من أن المستخدم مسجل الدخول وصلاحياته admin
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'ليس لديك صلاحيات الوصول' });
};

// نقطة النهاية لرفع ملف كتاب عبر الأدمن
// يجب إرسال الملف مع المفتاح "book" ضمن form-data
router.post('/upload', isAdmin, upload.single('book'), (req, res) => {
  try {
    res.status(201).json({ 
      message: 'تم رفع ملف الكتاب بنجاح!', 
      file: req.file 
    });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء رفع الملف', error: err.message });
  }
});

// مثال لنقطة نهاية للحصول على قائمة الكتب (يمكنك تعديلها حسب الحاجة)
router.get('/', (req, res) => {
  res.json({ message: 'قائمة الكتب' });
});

module.exports = router;
