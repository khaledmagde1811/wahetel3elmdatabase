const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// تسجيل الدخول عبر Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard'); // الوجهة بعد تسجيل الدخول عبر Google
  }
);

// تسجيل الدخول عبر Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard'); // الوجهة بعد تسجيل الدخول عبر Facebook
  }
);

// تسجيل الخروج
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "حدث خطأ أثناء تسجيل الخروج" });
    res.redirect('/');
  });
});

// تسجيل مستخدم جديد (Register)
router.post('/register', async (req, res) => {
  try {
    // استخراج البيانات من جسم الطلب
    const { name, email, password, role } = req.body;

    // التحقق من صحة الدور المدخل: يجب أن يكون "teacher" أو "student"
    if (!['teacher', 'student'].includes(role)) {
      return res.status(400).json({ message: 'يجب اختيار دور صحيح: معلم أو طالب.' });
    }

    // التحقق من وجود مستخدم بنفس البريد الإلكتروني مسبقًا
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'البريد الإلكتروني مسجل بالفعل.' });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم الجديد مع البيانات المطلوبة
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'تم تسجيل المستخدم بنجاح!' });
  } catch (err) {
    res.status(400).json({ message: 'حدث خطأ أثناء تسجيل المستخدم', error: err.message });
  }
});

// تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور (Login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // البحث عن المستخدم باستخدام البريد الإلكتروني
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });
    
    // التحقق من كلمة المرور
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'بيانات اعتماد غير صحيحة' });

    res.status(200).json({ message: 'تم تسجيل الدخول بنجاح', user });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول', error: err.message });
  }
});

module.exports = router;
