const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

// تحميل المتغيرات البيئية
dotenv.config();

// إنشاء التطبيق
const app = express();

// الاتصال بقاعدة البيانات
connectDB();

// تحميل Passport واستدعاء الملف الخاص به
require('./config/passport');

// استيراد وتفعيل الـ adminController
const { createAdmin } = require('./controllers/adminController');
createAdmin();  // التأكد من أن الأدمن يتم إنشاؤه عند تشغيل السيرفر

// إعداد الـ Middleware
app.use(express.json());
app.use(cors());

// إعداد الـ session و passport
app.use(session({
    secret: process.env.SESSION_SECRET,  // تأكد من أن المتغير موجود في .env
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// تعريف المسارات
app.use('/User', require('./routes/User'));
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/books', require('./routes/books'));
app.use('/api/audioRecords', require('./routes/audioRecords'));

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
