const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  // اسم المستخدم (يمكن استخدام "name" أو "username")
  name: { type: String, required: true },
  // البريد الإلكتروني يجب أن يكون فريدًا
  email: { type: String, required: true, unique: true },
  // كلمة المرور مطلوبة
  password: { type: String, required: true },
  // الدور مطلوب ويجب أن يكون إما "teacher" أو "student"
  role: { 
    type: String, 
    required: true, 
    enum: ['teacher', 'student'] 
  },
  // حقول اختيارية للمصادقة عبر الجهات الخارجية
  googleId: String,
  facebookId: String
});

// دالة لمقارنة كلمات المرور عند تسجيل الدخول
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
